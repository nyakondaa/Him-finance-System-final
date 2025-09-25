const express = require('express');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const asyncHandler = require('express-async-handler');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Fee validation schemas
const createFeeCategorySchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().optional()
});

const createFeeStructureSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  feeCategoryId: Joi.number().integer().required(),
  academicYearId: Joi.number().integer().required(),
  amount: Joi.number().positive().required(),
  currencyCode: Joi.string().required(),
  dueDate: Joi.date().optional(),
  isRecurring: Joi.boolean().default(false),
  frequency: Joi.string().valid('DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'BI_MONTHLY', 'QUARTERLY', 'SEMI_ANNUALLY', 'ANNUALLY', 'CUSTOM').optional()
});

const createAcademicYearSchema = Joi.object({
  name: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  isCurrent: Joi.boolean().default(false)
});

// Academic Years Routes
// Get all academic years
router.get('/academic-years', authenticateToken, authorize(['admin', 'finance_officer', 'teacher']), asyncHandler(async (req, res) => {
  const academicYears = await prisma.academicYear.findMany({
    where: { organizationId: 1 }, // Default organization for now
    orderBy: { startDate: 'desc' }
  });

  res.json(academicYears);
}));

// Create academic year
router.post('/academic-years', authenticateToken, authorize(['admin', 'finance_officer']), asyncHandler(async (req, res) => {
  const { error, value } = createAcademicYearSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // If setting as current, deactivate other current academic years
  if (value.isCurrent) {
    await prisma.academicYear.updateMany({
      where: { 
        organizationId: 1,
        isCurrent: true 
      },
      data: { isCurrent: false }
    });
  }

  const academicYear = await prisma.academicYear.create({
    data: {
      ...value,
      organizationId: 1 // Default organization for now
    }
  });

  res.status(201).json(academicYear);
}));

// Fee Categories Routes
// Get all fee categories
router.get('/categories', authenticateToken, authorize(['admin', 'finance_officer', 'teacher']), asyncHandler(async (req, res) => {
  const categories = await prisma.feeCategory.findMany({
    where: { 
      organizationId: 1, // Default organization for now
      isActive: true 
    },
    include: {
      _count: {
        select: {
          feeStructures: true
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  res.json(categories);
}));

// Create fee category
router.post('/categories', authenticateToken, authorize(['admin', 'finance_officer']), asyncHandler(async (req, res) => {
  const { error, value } = createFeeCategorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { code, name, description } = value;

  // Check if category code already exists
  const existingCategory = await prisma.feeCategory.findUnique({
    where: { code }
  });

  if (existingCategory) {
    return res.status(400).json({ message: 'Fee category code already exists' });
  }

  const category = await prisma.feeCategory.create({
    data: {
      code,
      name,
      description,
      organizationId: 1 // Default organization for now
    }
  });

  res.status(201).json(category);
}));

// Fee Structures Routes
// Get all fee structures
router.get('/structures', authenticateToken, authorize(['admin', 'finance_officer', 'teacher']), asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 50, 
    academicYearId, 
    feeCategoryId,
    isActive = true 
  } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    organizationId: 1, // Default organization for now
    isActive: isActive === 'true'
  };

  if (academicYearId) where.academicYearId = parseInt(academicYearId);
  if (feeCategoryId) where.feeCategoryId = parseInt(feeCategoryId);

  const [structures, total] = await Promise.all([
    prisma.feeStructure.findMany({
      where,
      include: {
        feeCategory: true,
        academicYear: true,
        _count: {
          select: {
            studentFeePayments: true
          }
        }
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.feeStructure.count({ where })
  ]);

  res.json({
    structures,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// Create fee structure
router.post('/structures', authenticateToken, authorize(['admin', 'finance_officer']), asyncHandler(async (req, res) => {
  const { error, value } = createFeeStructureSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Verify fee category and academic year exist
  const [feeCategory, academicYear] = await Promise.all([
    prisma.feeCategory.findUnique({
      where: {
        id: value.feeCategoryId
      }
    }),
    prisma.academicYear.findUnique({
      where: {
        id: value.academicYearId
      }
    })
  ]);

  if (!feeCategory) {
    return res.status(404).json({ message: 'Fee category not found' });
  }

  if (!academicYear) {
    return res.status(404).json({ message: 'Academic year not found' });
  }

  const structure = await prisma.feeStructure.create({
    data: {
      ...value,
      organizationId: 1 // Default organization for now
    },
    include: {
      feeCategory: true,
      academicYear: true
    }
  });

  res.status(201).json(structure);
}));

// Get fee structure by ID
router.get('/structures/:id', authenticateToken, authorize(['admin', 'finance_officer', 'teacher']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const organizationId = req.user.organizationId;

  const structure = await prisma.feeStructure.findFirst({
    where: { 
      id: parseInt(id),
      organizationId 
    },
    include: {
      feeCategory: true,
      academicYear: true,
      studentFeePayments: {
        include: {
          student: {
            select: {
              id: true,
              studentNumber: true,
              firstName: true,
              lastName: true
            }
          },
          paymentMethod: true
        },
        orderBy: { paymentDate: 'desc' }
      }
    }
  });

  if (!structure) {
    return res.status(404).json({ message: 'Fee structure not found' });
  }

  res.json(structure);
}));

// Fee Reports Routes
// Get fee collection report
router.get('/reports/collection', authenticateToken, authorize(['admin', 'finance_officer']), asyncHandler(async (req, res) => {
  const { 
    startDate, 
    endDate, 
    academicYearId, 
    feeCategoryId,
    groupBy = 'day' 
  } = req.query;
  
  const organizationId = req.user.organizationId;

  const where = {
    student: { organizationId }
  };

  if (startDate || endDate) {
    where.paymentDate = {};
    if (startDate) where.paymentDate.gte = new Date(startDate);
    if (endDate) where.paymentDate.lte = new Date(endDate);
  }

  if (academicYearId) {
    where.feeStructure = {
      academicYearId: parseInt(academicYearId)
    };
  }

  if (feeCategoryId) {
    where.feeStructure = {
      ...where.feeStructure,
      feeCategoryId: parseInt(feeCategoryId)
    };
  }

  const payments = await prisma.studentFeePayment.findMany({
    where,
    include: {
      feeStructure: {
        include: {
          feeCategory: true,
          academicYear: true
        }
      },
      student: {
        select: {
          studentNumber: true,
          firstName: true,
          lastName: true
        }
      }
    },
    orderBy: { paymentDate: 'desc' }
  });

  // Group payments by specified period
  const groupedPayments = {};
  const totalAmount = payments.reduce((sum, payment) => {
    const date = new Date(payment.paymentDate);
    let key;
    
    switch (groupBy) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'year':
        key = date.getFullYear().toString();
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!groupedPayments[key]) {
      groupedPayments[key] = {
        period: key,
        count: 0,
        amount: 0,
        payments: []
      };
    }

    groupedPayments[key].count++;
    groupedPayments[key].amount += parseFloat(payment.amount);
    groupedPayments[key].payments.push(payment);

    return sum + parseFloat(payment.amount);
  }, 0);

  const report = {
    summary: {
      totalPayments: payments.length,
      totalAmount,
      period: { startDate, endDate },
      groupBy
    },
    data: Object.values(groupedPayments).sort((a, b) => a.period.localeCompare(b.period))
  };

  res.json(report);
}));

// Get outstanding fees report
router.get('/reports/outstanding', authenticateToken, authorize(['admin', 'finance_officer']), asyncHandler(async (req, res) => {
  const { academicYearId } = req.query;
  const organizationId = req.user.organizationId;

  // Get all active students
  const students = await prisma.student.findMany({
    where: { 
      organizationId,
      isActive: true,
      ...(academicYearId && { academicYearId: parseInt(academicYearId) })
    },
    include: {
      academicYear: true,
      branch: true,
      studentBalances: {
        include: {
          feeStructure: {
            include: {
              feeCategory: true
            }
          }
        }
      }
    }
  });

  // Get all fee structures for the academic year
  const feeStructures = await prisma.feeStructure.findMany({
    where: {
      organizationId,
      isActive: true,
      ...(academicYearId && { academicYearId: parseInt(academicYearId) })
    },
    include: {
      feeCategory: true,
      academicYear: true
    }
  });

  // Calculate outstanding fees for each student
  const outstandingFees = students.map(student => {
    const studentBalances = student.studentBalances.reduce((acc, balance) => {
      acc[balance.feeStructureId] = balance.balance;
      return acc;
    }, {});

    const outstanding = feeStructures.map(structure => {
      const paid = studentBalances[structure.id] || 0;
      const outstanding = parseFloat(structure.amount) - parseFloat(paid);
      
      return {
        feeStructureId: structure.id,
        feeStructure: structure,
        amount: parseFloat(structure.amount),
        paid: parseFloat(paid),
        outstanding: Math.max(0, outstanding)
      };
    }).filter(fee => fee.outstanding > 0);

    const totalOutstanding = outstanding.reduce((sum, fee) => sum + fee.outstanding, 0);

    return {
      student: {
        id: student.id,
        studentNumber: student.studentNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        grade: student.grade,
        class: student.class,
        academicYear: student.academicYear,
        branch: student.branch
      },
      outstandingFees: outstanding,
      totalOutstanding
    };
  }).filter(student => student.totalOutstanding > 0);

  res.json({
    summary: {
      totalStudents: students.length,
      studentsWithOutstanding: outstandingFees.length,
      totalOutstandingAmount: outstandingFees.reduce((sum, student) => sum + student.totalOutstanding, 0)
    },
    data: outstandingFees.sort((a, b) => b.totalOutstanding - a.totalOutstanding)
  });
}));

module.exports = router;
