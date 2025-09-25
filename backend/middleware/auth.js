const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "";

// Authentication middleware
const authenticateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token missing or malformed.' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user with role information
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                role: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        permissions: true,
                        isActive: true
                    }
                },
                branch: {
                    select: {
                        code: true,
                        name: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        if (!user.isActive) {
            return res.status(401).json({ error: 'User account is inactive.' });
        }

        if (!user.role || !user.role.isActive) {
            return res.status(401).json({ error: 'User role is inactive.' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token.' });
        } else {
            return res.status(401).json({ error: 'Token verification failed.' });
        }
    }
});

// Permission checking middleware
const checkPermission = (module, action) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user || !user.role || !user.role.permissions) {
            return res.status(403).json({ error: 'Access denied. No permissions found.' });
        }

        const hasPermission = user.role.permissions[module]?.includes(action);

        if (!hasPermission) {
            return res.status(403).json({ 
                error: `Access denied. Required permission: ${module}:${action}` 
            });
        }

        next();
    };
};

// Authorization middleware for different roles
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        if (Array.isArray(roles)) {
            if (!roles.includes(req.user.role.name)) {
                return res.status(403).json({ error: 'Insufficient permissions.' });
            }
        } else {
            if (req.user.role.name !== roles) {
                return res.status(403).json({ error: 'Insufficient permissions.' });
            }
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    checkPermission,
    authorize
};
