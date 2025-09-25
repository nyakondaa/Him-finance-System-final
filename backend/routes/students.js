const express = require('express');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const asyncHandler = require('express-async-handler');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Student validation schemas
const createStudentSchema = Joi.object({
  studentNumber: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
  phoneNumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  address: Joi.string().optional(),
  parentName: Joi.string().optional(),
  parentPhone: Joi.string().optional(),
  parentEmail: Joi.string().email().optional(),
  emergencyContact: Joi.string().optional(),
  emergencyPhone: Joi.string().optional(),
  branchCode: Joi.string().required(),
  academicYearId: Joi.number().integer().optional(),
  grade: Joi.string().optional(),
  class: Joi.string().optional()
});

const updateStudentSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
  phoneNumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  address: Joi.string().optional(),
  parentName: Joi.string().optional(),
  parentPhone: Joi.string().optional(),
  parentEmail: Joi.string().email().optional(),
  emergencyContact: Joi.string().optional(),
  emergencyPhone: Joi.string().optional(),
  academicYearId: Joi.number().integer().optional(),
  grade: Joi.string().optional(),
  class: Joi.string().optional(),
  isActive: Joi.boolean().optional()
});

// Get all students
router.get('/', authenticateToken, authorize(['admin', 'finance_officer', 'teacher']), asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 50, 
    search, 
    grade, 
    class: studentClass, 
    academicYearId,
    isActive = true 
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    branchCode: req.user.branchCode,
    isActive: isActive === 'true'
  };

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { studentNumber: { contains: search, mode: 'insensitive' } },
      { parentName: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (grade) where.grade = grade;
  if (studentClass) where.class = studentClass;
  if (academicYearId) where.academicYearId = parseInt(academicYearId);

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: {
        academicYear: {
          select: {
            id: true,
            name: true
          }
        },
        branch: {
          select: {
            code: true,
            name: true
          }
        },
        _count: {
          select: {
            feePayments: true,
            studentBalances: true
          }
        }
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.student.count({ where })
  ]);

  res.json({
    students,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// Get student by ID
router.get('/:id', authenticateToken, authorize(['admin', 'finance_officer', 'teacher']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await prisma.student.findFirst({
    where: { 
      id: parseInt(id),
      branchCode: req.user.branchCode
    },
    include: {
      academicYear: true,
      branch: true,
      feePayments: {
        include: {
          feeStructure: {
            include: {
              feeCategory: true
            }
          },
          paymentMethod: true,
          processor: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { paymentDate: 'desc' }
      },
      studentBalances: {
        include: {
          feeStructure: {
            include: {
              feeCategory: true
            }
          },
          currency: true
        }
      },
      feeReminders: {
        where: { status: 'PENDING' },
        include: {
          feeStructure: {
            include: {
              feeCategory: true
            }
          }
        }
      },
      feeExemptions: {
        where: { isActive: true },
        include: {
          feeStructure: {
            include: {
              feeCategory: true
            }
          },
          approver: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  });

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.json(student);
}));

// Create new student
router.post('/', authenticateToken, authorize(['admin', 'finance_officer']), asyncHandler(async (req, res) => {
  const { error, value } = createStudentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { studentNumber, ...studentData } = value;

  // Check if student number already exists
  const existingStudent = await prisma.student.findUnique({
    where: { studentNumber }
  });

  if (existingStudent) {
    return res.status(400).json({ message: 'Student number already exists' });
  }

  // Verify branch exists
  const branch = await prisma.branch.findUnique({
    where: {
      code: studentData.branchCode
    }
  });

  if (!branch) {
    return res.status(400).json({ message: 'Branch not found' });
  }

  const student = await prisma.student.create({
    data: {
      ...studentData,
      studentNumber,
      organizationId: 1 // Default organization for now
    },
    include: {
      academicYear: true,
      branch: true
    }
  });

  res.status(201).json(student);
}));

// Update student
router.patch('/:id', authenticateToken, authorize(['admin', 'finance_officer']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateStudentSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const student = await prisma.student.updateMany({
    where: { 
      id: parseInt(id),
      branchCode: req.user.branchCode
    },
    data: value
  });

  if (student.count === 0) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const updatedStudent = await prisma.student.findUnique({
    where: { id: parseInt(id) },
    include: {
      academicYear: true,
      branch: true
    }
  });

  res.json(updatedStudent);
}));

// Delete student (soft delete)
router.delete('/:id', authenticateToken, authorize(['admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await prisma.student.updateMany({
    where: { 
      id: parseInt(id),
      branchCode: req.user.branchCode
    },
    data: { isActive: false }
  });

  if (student.count === 0) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.json({ message: 'Student deactivated successfully' });
}));

// Get student fee payments
router.get('/:id/fee-payments', authenticateToken, authorize(['admin', 'finance_officer', 'teacher']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 50, startDate, endDate } = req.query;
  const organizationId = req.user.organizationId;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    studentId: parseInt(id),
    student: { organizationId }
  };

  if (startDate || endDate) {
    where.paymentDate = {};
    if (startDate) where.paymentDate.gte = new Date(startDate);
    if (endDate) where.paymentDate.lte = new Date(endDate);
  }

  const [payments, total] = await Promise.all([
    prisma.studentFeePayment.findMany({
      where,
      include: {
        feeStructure: {
          include: {
            feeCategory: true
          }
        },
        paymentMethod: true,
        processor: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      skip,
      take: parseInt(limit),
      orderBy: { paymentDate: 'desc' }
    }),
    prisma.studentFeePayment.count({ where })
  ]);

  res.json({
    payments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// Get student balances
router.get('/:id/balances', authenticateToken, authorize(['admin', 'finance_officer', 'teacher']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const organizationId = req.user.organizationId;

  const balances = await prisma.studentBalance.findMany({
    where: {
      studentId: parseInt(id),
      student: { organizationId }
    },
    include: {
      feeStructure: {
        include: {
          feeCategory: true
        }
      },
      currency: true,
      adjustments: {
        include: {
          processor: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { processedAt: 'desc' }
      }
    }
  });

  res.json(balances);
}));

// Create fee payment for student
router.post('/:id/fee-payments', authenticateToken, authorize(['admin', 'finance_officer']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const organizationId = req.user.organizationId;
  const userId = req.user.id;

  const paymentSchema = Joi.object({
    feeStructureId: Joi.number().integer().required(),
    amount: Joi.number().positive().required(),
    currencyCode: Joi.string().required(),
    paymentMethodId: Joi.number().integer().required(),
    referenceNumber: Joi.string().optional(),
    notes: Joi.string().optional()
  });

  const { error, value } = paymentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Verify student exists and belongs to organization
  const student = await prisma.student.findFirst({
    where: { 
      id: parseInt(id),
      organizationId 
    }
  });

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  // Verify fee structure exists and belongs to organization
  const feeStructure = await prisma.feeStructure.findFirst({
    where: {
      id: value.feeStructureId,
      organizationId
    }
  });

  if (!feeStructure) {
    return res.status(404).json({ message: 'Fee structure not found' });
  }

  // Generate receipt number
  const receiptNumber = `STU-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  const payment = await prisma.studentFeePayment.create({
    data: {
      ...value,
      receiptNumber,
      studentId: parseInt(id),
      processedBy: userId
    },
    include: {
      feeStructure: {
        include: {
          feeCategory: true
        }
      },
      paymentMethod: true,
      processor: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  });

  // Update student balance
  await prisma.studentBalance.upsert({
    where: {
      studentId_feeStructureId_balanceType: {
        studentId: parseInt(id),
        feeStructureId: value.feeStructureId,
        balanceType: 'CREDIT'
      }
    },
    update: {
      balance: {
        increment: value.amount
      }
    },
    create: {
      studentId: parseInt(id),
      feeStructureId: value.feeStructureId,
      balanceType: 'CREDIT',
      balance: value.amount,
      currencyCode: value.currencyCode
    }
  });

  res.status(201).json(payment);
}));

module.exports = router;
