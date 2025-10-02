const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const ms = require("ms");

const prisma = new PrismaClient();
const logger = require("pino")();
const JWT_SECRET = process.env.JWT_SECRET || "";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "";
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || "15m";
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || "7d";
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5", 10);

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      roleId: user.roleId,
      roleName: user.role.name,
      branchCode: user.branchCode,
      permissions: user.role.permissions,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRATION }
  );
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
}

const logAudit = async (
  userId,
  username,
  action,
  tableName,
  recordId,
  oldValues = null,
  newValues = null,
  req = null
) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        username,
        action,
        tableName,
        recordId: recordId.toString(),
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress: req?.ip || req?.connection?.remoteAddress,
        userAgent: req?.get("User-Agent"),
      },
    });
  } catch (error) {
    logger.error("Audit logging failed:", error);
  }
};

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}
class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}
class ValidationError extends AppError {
  constructor(message = "Invalid input data") {
    super(message, 400);
  }
}
class AuthError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401);
  }
}
class ForbiddenError extends AppError {
  constructor(message = "Forbidden: Insufficient permissions") {
    super(message, 403);
  }
}

const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError("Authorization token missing or malformed.");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        throw new AuthError("Access token expired. Please refresh.");
      }
      throw new ForbiddenError("Invalid access token.");
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: {
          role: {
            select: {
              id: true,
              name: true,
              displayName: true,
              permissions: true,
              isActive: true,
            },
          },
        },
      });

      if (!user) throw new AuthError("User not found.");
      if (!user.isActive) throw new ForbiddenError("User account is inactive.");
      if (user.locked) throw new ForbiddenError("User account is locked.");
      if (!user.role || !user.role.isActive)
        throw new ForbiddenError("User role is invalid or inactive.");

      req.user = {
        id: user.id,
        username: user.username,
        roleId: user.roleId,
        branchCode: user.branchCode,
        role: user.role,
      };
      next();
    } catch (dbError) {
      logger.error("Database error during authentication:", dbError);
      throw new AuthError("Authentication failed.");
    }
  });
});

const checkPermission = (module, action) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.role || !user.role.permissions) {
      return res
        .status(403)
        .json({ error: "Access denied. No permissions found." });
    }

    const hasPermission = user.role.permissions[module]?.includes(action);

    if (!hasPermission) {
      logger.warn(
        `Access denied for user ${user.username}: Required permission ${module}:${action}`
      );
      return res.status(403).json({
        error: `Access denied. Required permission: ${module}:${action}`,
      });
    }

    next();
  };
};

// Initial data setup and DB connection logic
(async () => {
  try {
    await prisma.$connect();
    logger.info("Connected to PostgreSQL database via Prisma!");

    // Check if we need to initialize default data
    const userCount = await prisma.user.count();
    const shouldInitialize = userCount === 0;

    if (shouldInitialize) {
      logger.info("Initializing default system data...");

      // 1. Create default currencies
      const defaultCurrencies = [
        { code: "ZIG", name: "Zimbabwe Gold", symbol: "ZIG", isBaseCurrency: true },
        { code: "USD", name: "US Dollar", symbol: "$" },
        { code: "ZAR", name: "South African Rand", symbol: "R" },
        { code: "GBP", name: "British Pound", symbol: "£" },
        { code: "ZWL", name: "Zimbabwe Dollar", symbol: "ZWL" },
      ];
      await prisma.currency.createMany({ data: defaultCurrencies, skipDuplicates: true });
      logger.info("Default currencies initialized");

      // 2. Create default payment methods
      const defaultPaymentMethods = [
        { name: "Cash", description: "Physical cash payment" },
        { name: "Ecocash", description: "Ecocash mobile money" },
        { name: "One Money", description: "One Money mobile money" },
        { name: "Telecash", description: "Telecel mobile money" },
        { name: "Bank Transfer", description: "Direct bank transfer" },
        { name: "Card Swipe", description: "Card payment via POS" },
        { name: "PayPal", description: "PayPal online payment" },
      ];
      await prisma.paymentMethod.createMany({ data: defaultPaymentMethods, skipDuplicates: true });
      logger.info("Default payment methods initialized");

      // 3. Create default branch (Head Office)
      const defaultBranch = await prisma.branch.upsert({
        where: { code: process.env.DEFAULT_ADMIN_BRANCH || "00" },
        update: {},
        create: {
          code: process.env.DEFAULT_ADMIN_BRANCH || "00",
          name: "Head Office",
          isActive: true,
        },
      });
      logger.info(`Default branch created: ${defaultBranch.name}`);

      // 4. Create default revenue heads for head office
      const defaultRevenueHeads = [
        { name: "Tithes", branchCode: defaultBranch.code },
        { name: "Pledges", branchCode: defaultBranch.code },
        { name: "Offerings", branchCode: defaultBranch.code },
        { name: "Seeds", branchCode: defaultBranch.code },
        { name: "Donations", branchCode: defaultBranch.code },
      ];
      await Promise.all(
        defaultRevenueHeads.map(async (head, index) => {
          const code = `${defaultBranch.code}R${String(index + 1).padStart(3, "0")}`;
          await prisma.revenueHead.upsert({
            where: { code },
            update: {},
            create: {
              code,
              name: head.name,
              branchCode: head.branchCode,
              isActive: true,
            },
          });
        })
      );
      logger.info("Default revenue heads initialized");

      // 5. Create default expenditure heads for head office
      const defaultExpenditureHeads = [
        { name: "Salaries", category: "PERSONNEL", branchCode: defaultBranch.code },
        { name: "Utilities", category: "UTILITIES", branchCode: defaultBranch.code },
        { name: "Maintenance", category: "MAINTENANCE", branchCode: defaultBranch.code },
        { name: "Office Supplies", category: "ADMINISTRATIVE", branchCode: defaultBranch.code },
        { name: "Travel", category: "OPERATIONAL", branchCode: defaultBranch.code },
      ];
      await Promise.all(
        defaultExpenditureHeads.map(async (head, index) => {
          const code = `${defaultBranch.code}E${String(index + 1).padStart(3, "0")}`;
          await prisma.expenditureHead.upsert({
            where: { code },
            update: {},
            create: {
              code,
              name: head.name,
              category: head.category,
              branchCode: head.branchCode,
              isActive: true,
            },
          });
        })
      );
      logger.info("Default expenditure heads initialized");

      // 6. Create admin role with full permissions
      const adminRole = await prisma.role.upsert({
        where: { name: "admin" },
        update: {},
        create: {
          name: "admin",
          displayName: "Administrator",
          description: "Full system access with all permissions",
          permissions: {
            users: ["read", "create", "update", "delete", "lock_unlock"],
            roles: ["read", "create", "update", "delete"],
            branches: ["read", "create", "update", "delete"],
            transactions: ["read", "create", "update", "delete", "refund"],
            reports: ["read", "export", "advanced"],
            settings: ["read", "update", "system_config"],
            revenue_heads: ["read", "create", "update", "delete"],
            expenditure_heads: ["read", "create", "update", "delete"],
            currencies: ["read", "manage"],
            payment_methods: ["read", "manage"],
            members: ["read", "create", "update", "delete"],
            projects: ["read", "create", "update", "delete"],
            expenditures: ["read", "create", "update", "delete", "approve"],
            assets: ["read", "create", "update", "delete"],
            suppliers: ["read", "create", "update", "delete"],
            contracts: ["read", "create", "update", "delete"],
            budgets: ["read", "create", "update", "delete"],
          },
          isActive: true,
        },
      });
      logger.info("Admin role created");

      // 7. Create default admin user
      const adminUsername = process.env.DEFAULT_ADMIN_USERNAME || "";
      const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "";
      if (adminUsername && adminPassword) {
        const hashedPassword = await require("bcrypt").hash(adminPassword, 12);
        const defaultAdmin = await prisma.user.upsert({
          where: { username: adminUsername },
          update: {},
          create: {
            username: adminUsername,
            password_hash: hashedPassword,
            firstName: "System",
            lastName: "Administrator",
            roleId: adminRole.id,
            branchCode: defaultBranch.code,
            isActive: true,
            createdBy: "system",
          },
        });
        logger.info(`Default admin user created: ${defaultAdmin.username}`);
        logger.warn("IMPORTANT: Change the default admin password immediately after first login!");
      }

      // 8. Create standard roles
      const standardRoles = [
        {
          name: "supervisor",
          displayName: "Supervisor",
          description: "Branch supervisor with elevated permissions",
          permissions: {
            users: ["read", "create", "update", "lock_unlock"],
            branches: ["read"],
            transactions: ["read", "create", "update", "refund"],
            reports: ["read", "export"],
            revenue_heads: ["read", "create"],
            expenditure_heads: ["read", "create"],
            members: ["read", "create", "update"],
            projects: ["read", "create", "update"],
            expenditures: ["read", "create", "update"],
            assets: ["read", "create", "update"],
            suppliers: ["read", "create", "update"],
            contracts: ["read", "create", "update"],
          },
        },
        {
          name: "cashier",
          displayName: "Cashier",
          description: "Standard cashier with basic permissions",
          permissions: {
            users: ["read"],
            branches: ["read"],
            budgets: ["read"],
            transactions: ["read", "create"],
            reports: ["read"],
            revenue_heads: ["read"],
            expenditure_heads: ["read"],
            members: ["read", "create"],
            projects: ["read"],
            expenditures: ["read"],
            assets: ["read"],
            suppliers: ["read"],
          },
        },
      ];
      await prisma.role.createMany({ data: standardRoles, skipDuplicates: true });
      logger.info("Standard roles initialized");

      // Ensure required read permissions for non-admin roles (idempotent)
      const rolesToEnsure = ["cashier", "supervisor"];
      const roles = await prisma.role.findMany({ where: { name: { in: rolesToEnsure } } });
      for (const role of roles) {
        const permissions = role.permissions || {};
        permissions.currencies = Array.isArray(permissions.currencies) ? permissions.currencies : [];
        permissions.payment_methods = Array.isArray(permissions.payment_methods) ? permissions.payment_methods : [];
        let changed = false;
        if (!permissions.currencies.includes("read")) {
          permissions.currencies.push("read");
          changed = true;
        }
        if (!permissions.payment_methods.includes("read")) {
          permissions.payment_methods.push("read");
          changed = true;
        }
        if (changed) {
          await prisma.role.update({ where: { id: role.id }, data: { permissions } });
          logger.info(`Updated role permissions for ${role.name}: added read on currencies/payment_methods`);
        }
      }
    }
  } catch (error) {
    logger.fatal({ error }, "Failed to connect to DB or perform initial setup.");
    process.exit(1);
  }
})();

// Ensure read permissions for currencies and payment_methods exist on every startup
(async () => {
  try {
    const rolesToEnsure = ["cashier", "supervisor"];
    const roles = await prisma.role.findMany({ where: { name: { in: rolesToEnsure } } });
    for (const role of roles) {
      const permissions = role.permissions || {};
      permissions.currencies = Array.isArray(permissions.currencies) ? permissions.currencies : [];
      permissions.payment_methods = Array.isArray(permissions.payment_methods) ? permissions.payment_methods : [];
      let changed = false;
      if (!permissions.currencies.includes("read")) {
        permissions.currencies.push("read");
        changed = true;
      }
      if (!permissions.payment_methods.includes("read")) {
        permissions.payment_methods.push("read");
        changed = true;
      }
      if (changed) {
        await prisma.role.update({ where: { id: role.id }, data: { permissions } });
        logger.info(`Ensured read permissions for ${role.name} on currencies/payment_methods`);
      }
    }
  } catch (e) {
    logger.error({ e }, "Failed to ensure read permissions on startup");
  }
})();

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  logAudit,
  authenticateToken,
  checkPermission,
  asyncHandler,
  AppError,
  NotFoundError,
  ConflictError,
  ValidationError,
  AuthError,
  ForbiddenError,
};
