const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Middleware to ensure user has access to organization context
const requireOrganizationContext = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Get user with organization context
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            organizationType: true,
            isActive: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.organization) {
      return res.status(400).json({ message: 'User not associated with any organization' });
    }

    if (!user.organization.isActive) {
      return res.status(400).json({ message: 'Organization is not active' });
    }

    // Add organization context to request
    req.organization = user.organization;
    req.user.organizationId = user.organizationId;

    next();
  } catch (error) {
    console.error('Organization context middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to check if organization type supports the requested feature
const requireOrganizationType = (allowedTypes) => {
  return (req, res, next) => {
    const organizationType = req.organization?.organizationType;
    
    if (!organizationType) {
      return res.status(400).json({ message: 'Organization context required' });
    }

    if (!allowedTypes.includes(organizationType)) {
      return res.status(403).json({ 
        message: `This feature is only available for ${allowedTypes.join(' or ')} organizations` 
      });
    }

    next();
  };
};

// Middleware to get organization-specific data based on type
const getOrganizationData = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const organizationType = req.organization.organizationType;

    // Get organization-specific statistics
    let stats = {};

    if (organizationType === 'CHURCH') {
      const [memberCount, contributionCount, totalContributions] = await Promise.all([
        prisma.member.count({
          where: { 
            organizationId,
            isActive: true 
          }
        }),
        prisma.memberContribution.count({
          where: {
            member: { organizationId }
          }
        }),
        prisma.memberContribution.aggregate({
          where: {
            member: { organizationId }
          },
          _sum: { amount: true }
        })
      ]);

      stats = {
        memberCount,
        contributionCount,
        totalContributions: totalContributions._sum.amount || 0
      };
    } else if (organizationType === 'SCHOOL') {
      const [studentCount, feePaymentCount, totalFeePayments] = await Promise.all([
        prisma.student.count({
          where: { 
            organizationId,
            isActive: true 
          }
        }),
        prisma.studentFeePayment.count({
          where: {
            student: { organizationId }
          }
        }),
        prisma.studentFeePayment.aggregate({
          where: {
            student: { organizationId }
          },
          _sum: { amount: true }
        })
      ]);

      stats = {
        studentCount,
        feePaymentCount,
        totalFeePayments: totalFeePayments._sum.amount || 0
      };
    }

    req.organizationStats = stats;
    next();
  } catch (error) {
    console.error('Organization data middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to get organization-specific routes
const getOrganizationRoutes = (organizationType) => {
  const baseRoutes = [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/reports', name: 'Reports' },
    { path: '/users', name: 'User Management' },
    { path: '/branches', name: 'Branches' },
    { path: '/currencies', name: 'Currencies' },
    { path: '/payment-methods', name: 'Payment Methods' },
    { path: '/expenditures', name: 'Expenditures' },
    { path: '/assets', name: 'Assets' }
  ];

  if (organizationType === 'CHURCH') {
    return [
      ...baseRoutes,
      { path: '/members', name: 'Members' },
      { path: '/contributions', name: 'Contributions' },
      { path: '/projects', name: 'Projects' },
      { path: '/revenue-heads', name: 'Revenue Heads' },
      { path: '/expenditure-heads', name: 'Expenditure Heads' }
    ];
  } else if (organizationType === 'SCHOOL') {
    return [
      ...baseRoutes,
      { path: '/students', name: 'Students' },
      { path: '/fees', name: 'Fee Management' },
      { path: '/academic-years', name: 'Academic Years' },
      { path: '/fee-categories', name: 'Fee Categories' },
      { path: '/fee-structures', name: 'Fee Structures' }
    ];
  }

  return baseRoutes;
};

// Helper function to get organization-specific dashboard data
const getDashboardData = async (organizationId, organizationType) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  if (organizationType === 'CHURCH') {
    const [
      totalMembers,
      monthlyContributions,
      yearlyContributions,
      recentContributions,
      projectStats
    ] = await Promise.all([
      prisma.member.count({
        where: { organizationId, isActive: true }
      }),
      prisma.memberContribution.aggregate({
        where: {
          member: { organizationId },
          paymentDate: { gte: startOfMonth }
        },
        _sum: { amount: true },
        _count: true
      }),
      prisma.memberContribution.aggregate({
        where: {
          member: { organizationId },
          paymentDate: { gte: startOfYear }
        },
        _sum: { amount: true },
        _count: true
      }),
      prisma.memberContribution.findMany({
        where: { member: { organizationId } },
        include: {
          member: {
            select: {
              firstName: true,
              lastName: true,
              memberNumber: true
            }
          },
          currency: true
        },
        orderBy: { paymentDate: 'desc' },
        take: 10
      }),
      prisma.project.findMany({
        where: { organizationId, isActive: true },
        select: {
          id: true,
          name: true,
          targetAmount: true,
          progress: true,
          status: true,
          currency: true,
          _count: {
            select: {
              memberProjects: true,
              contributions: true
            }
          }
        }
      })
    ]);

    return {
      totalMembers,
      monthlyContributions: monthlyContributions._sum.amount || 0,
      monthlyContributionCount: monthlyContributions._count,
      yearlyContributions: yearlyContributions._sum.amount || 0,
      yearlyContributionCount: yearlyContributions._count,
      recentContributions,
      projectStats
    };
  } else if (organizationType === 'SCHOOL') {
    const [
      totalStudents,
      monthlyFeePayments,
      yearlyFeePayments,
      recentFeePayments,
      outstandingFees
    ] = await Promise.all([
      prisma.student.count({
        where: { organizationId, isActive: true }
      }),
      prisma.studentFeePayment.aggregate({
        where: {
          student: { organizationId },
          paymentDate: { gte: startOfMonth }
        },
        _sum: { amount: true },
        _count: true
      }),
      prisma.studentFeePayment.aggregate({
        where: {
          student: { organizationId },
          paymentDate: { gte: startOfYear }
        },
        _sum: { amount: true },
        _count: true
      }),
      prisma.studentFeePayment.findMany({
        where: { student: { organizationId } },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              studentNumber: true
            }
          },
          feeStructure: {
            include: {
              feeCategory: true
            }
          },
          currency: true
        },
        orderBy: { paymentDate: 'desc' },
        take: 10
      }),
      prisma.studentBalance.findMany({
        where: {
          student: { organizationId },
          balance: { gt: 0 }
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              studentNumber: true
            }
          },
          feeStructure: {
            include: {
              feeCategory: true
            }
          }
        }
      })
    ]);

    return {
      totalStudents,
      monthlyFeePayments: monthlyFeePayments._sum.amount || 0,
      monthlyFeePaymentCount: monthlyFeePayments._count,
      yearlyFeePayments: yearlyFeePayments._sum.amount || 0,
      yearlyFeePaymentCount: yearlyFeePayments._count,
      recentFeePayments,
      outstandingFees
    };
  }

  return {};
};

module.exports = {
  requireOrganizationContext,
  requireOrganizationType,
  getOrganizationData,
  getOrganizationRoutes,
  getDashboardData
};
