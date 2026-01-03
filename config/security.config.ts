import { SecurityConfig } from '@/types/rpa.types';

/**
 * Security Configuration for Banking Operations
 * Implements PCI-DSS and GDPR compliance requirements
 */
export const securityConfig: SecurityConfig = {
  encryptionAlgorithm: 'aes-256-gcm',
  keyDerivation: 'pbkdf2',
  sessionTimeout: 3600, // 1 hour
  mfaRequired: true,
  auditEnabled: true,
  complianceMode: 'PCI-DSS',
};

export const passwordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // days
  preventReuse: 5, // last N passwords
};

export const accessControl = {
  roles: {
    admin: {
      permissions: [
        'job:create',
        'job:read',
        'job:update',
        'job:delete',
        'credential:manage',
        'audit:read',
        'system:configure',
      ],
    },
    operator: {
      permissions: [
        'job:create',
        'job:read',
        'job:update',
        'data:view',
      ],
    },
    viewer: {
      permissions: [
        'job:read',
        'data:view',
        'audit:read',
      ],
    },
  },
};

export const auditConfig = {
  enabled: true,
  retentionDays: 90,
  immutable: true,
  realTimeAlerts: true,
  logLevel: 'info',
  sensitiveDataMasking: true,
};

export const complianceConfig = {
  pciDss: {
    enabled: true,
    requireEncryptionAtRest: true,
    requireEncryptionInTransit: true,
    minimumKeyLength: 256,
    auditAllAccess: true,
  },
  gdpr: {
    enabled: true,
    dataResidency: 'US',
    rightToForget: true,
    dataMinimization: true,
    consentRequired: true,
  },
  soc2: {
    enabled: true,
    controlFramework: 'Type II',
    continuousMonitoring: true,
  },
};

export const rateLimiting = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
};

export const corsConfig = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
