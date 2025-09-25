const express = require('express');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const asyncHandler = require('express-async-handler');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Organization validation schemas
const createOrganizationSchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  organizationType: Joi.string().valid('CHURCH', 'SCHOOL', 'NGO', 'BUSINESS', 'OTHER').required(),
  address: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  website: Joi.string().uri().optional(),
  registrationNumber: Joi.string().optional(),
  taxNumber: Joi.string().optional(),
  settings: Joi.object().optional()
});

const updateOrganizationSchema = Joi.object({
  name: Joi.string().optional(),
  organizationType: Joi.string().valid('CHURCH', 'SCHOOL', 'NGO', 'BUSINESS', 'OTHER').optional(),
  address: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  website: Joi.string().uri().optional(),
  registrationNumber: Joi.string().optional(),
  taxNumber: Joi.string().optional(),
  settings: Joi.object().optional(),
  isActive: Joi.boolean().optional()
});

// Get all organizations
router.get('/', authenticateToken, authorize(['admin']), asyncHandler(async (req, res) => {
  const organizations = await prisma.organization.findMany({
    include: {
      branches: {
        select: {
          code: true,
          name: true,
          isActive: true
        }
      },
      _count: {
        select: {
          users: true,
          members: true,
          students: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(organizations);
}));

// Get organization by ID
router.get('/:id', authenticateToken, authorize(['admin', 'finance_officer']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const organization = await prisma.organization.findUnique({
    where: { id: parseInt(id) },
    include: {
      branches: true,
      users: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true,
          isActive: true,
          role: {
            select: {
              name: true,
              displayName: true
            }
          }
        }
      },
      _count: {
        select: {
          members: true,
          students: true,
          projects: true,
          transactions: true
        }
      }
    }
  });

  if (!organization) {
    return res.status(404).json({ message: 'Organization not found' });
  }

  res.json(organization);
}));

// Create new organization
router.post('/', authenticateToken, authorize(['admin']), asyncHandler(async (req, res) => {
  const { error, value } = createOrganizationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { code, name, organizationType, ...otherData } = value;

  // Check if organization code or name already exists
  const existingOrg = await prisma.organization.findFirst({
    where: {
      OR: [
        { code },
        { name }
      ]
    }
  });

  if (existingOrg) {
    return res.status(400).json({ 
      message: existingOrg.code === code ? 'Organization code already exists' : 'Organization name already exists' 
    });
  }

  const organization = await prisma.organization.create({
    data: {
      code,
      name,
      organizationType,
      ...otherData
    },
    include: {
      branches: true
    }
  });

  res.status(201).json(organization);
}));

// Update organization
router.patch('/:id', authenticateToken, authorize(['admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateOrganizationSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const organization = await prisma.organization.update({
    where: { id: parseInt(id) },
    data: value,
    include: {
      branches: true
    }
  });

  res.json(organization);
}));

// Delete organization (soft delete)
router.delete('/:id', authenticateToken, authorize(['admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if organization has any active users, members, or students
  const counts = await prisma.organization.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: {
          users: true,
          members: true,
          students: true
        }
      }
    }
  });

  if (!counts) {
    return res.status(404).json({ message: 'Organization not found' });
  }

  if (counts._count.users > 0 || counts._count.members > 0 || counts._count.students > 0) {
    return res.status(400).json({ 
      message: 'Cannot delete organization with active users, members, or students. Deactivate instead.' 
    });
  }

  await prisma.organization.update({
    where: { id: parseInt(id) },
    data: { isActive: false }
  });

  res.json({ message: 'Organization deactivated successfully' });
}));

// Get organization statistics
router.get('/:id/stats', authenticateToken, authorize(['admin', 'finance_officer']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { period = 'month' } = req.query;

  const organization = await prisma.organization.findUnique({
    where: { id: parseInt(id) }
  });

  if (!organization) {
    return res.status(404).json({ message: 'Organization not found' });
  }

  // Calculate date range based on period
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  // Get statistics based on organization type
  let stats = {};

  if (organization.organizationType === 'CHURCH') {
    // Church-specific stats
    const [memberCount, contributionCount, totalContributions] = await Promise.all([
      prisma.member.count({
        where: { 
          organizationId: parseInt(id),
          isActive: true 
        }
      }),
      prisma.memberContribution.count({
        where: {
          member: { organizationId: parseInt(id) },
          paymentDate: { gte: startDate }
        }
      }),
      prisma.memberContribution.aggregate({
        where: {
          member: { organizationId: parseInt(id) },
          paymentDate: { gte: startDate }
        },
        _sum: { amount: true }
      })
    ]);

    stats = {
      memberCount,
      contributionCount,
      totalContributions: totalContributions._sum.amount || 0,
      organizationType: 'CHURCH'
    };
  } else if (organization.organizationType === 'SCHOOL') {
    // School-specific stats
    const [studentCount, feePaymentCount, totalFeePayments] = await Promise.all([
      prisma.student.count({
        where: { 
          organizationId: parseInt(id),
          isActive: true 
        }
      }),
      prisma.studentFeePayment.count({
        where: {
          student: { organizationId: parseInt(id) },
          paymentDate: { gte: startDate }
        }
      }),
      prisma.studentFeePayment.aggregate({
        where: {
          student: { organizationId: parseInt(id) },
          paymentDate: { gte: startDate }
        },
        _sum: { amount: true }
      })
    ]);

    stats = {
      studentCount,
      feePaymentCount,
      totalFeePayments: totalFeePayments._sum.amount || 0,
      organizationType: 'SCHOOL'
    };
  }

  res.json({
    organization: {
      id: organization.id,
      name: organization.name,
      organizationType: organization.organizationType
    },
    period,
    startDate,
    endDate: now,
    stats
  });
}));

// Switch organization context for user
router.post('/:id/switch', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Verify user has access to this organization
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { organization: true }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // For now, allow switching to any organization (admin functionality)
  // In production, you might want to restrict this based on user roles
  const targetOrganization = await prisma.organization.findUnique({
    where: { id: parseInt(id) }
  });

  if (!targetOrganization) {
    return res.status(404).json({ message: 'Organization not found' });
  }

  // Update user's current organization context
  // Note: This is a simplified approach. In production, you might want to use sessions or JWT claims
  await prisma.user.update({
    where: { id: userId },
    data: { organizationId: parseInt(id) }
  });

  res.json({
    message: 'Organization context switched successfully',
    organization: {
      id: targetOrganization.id,
      name: targetOrganization.name,
      organizationType: targetOrganization.organizationType
    }
  });
}));

module.exports = router;
