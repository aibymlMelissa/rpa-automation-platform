import {
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from '@/types/rpa.types';

/**
 * Data Validator for Banking Network Data
 * Implements comprehensive validation rules for financial data
 */
export class DataValidator {
  private validationRules: ValidationRule[] = [];

  constructor() {
    this.initializeRules();
  }

  /**
   * Validate data against all rules
   */
  async validate(data: any): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Run all validation rules
    for (const rule of this.validationRules) {
      try {
        const result = await rule.validate(data);

        if (!result.passed) {
          if (result.severity === 'critical' || result.severity === 'error') {
            errors.push({
              field: result.field,
              message: result.message,
              severity: result.severity,
              code: result.code,
            });
          } else {
            warnings.push({
              field: result.field,
              message: result.message,
              suggestion: result.suggestion,
            });
          }
        }
      } catch (error) {
        errors.push({
          field: 'validation',
          message: `Validation rule ${rule.name} failed: ${error}`,
          severity: 'error',
          code: 'VALIDATION_ERROR',
        });
      }
    }

    return {
      isValid: errors.filter((e) => e.severity === 'critical').length === 0,
      errors,
      warnings,
      validatedAt: new Date(),
      validationRules: this.validationRules.map((r) => r.name),
    };
  }

  /**
   * Initialize standard banking validation rules
   */
  private initializeRules(): void {
    // Schema validation
    this.validationRules.push({
      name: 'schema-validation',
      validate: async (data) => {
        if (!data || typeof data !== 'object') {
          return {
            passed: false,
            field: 'data',
            message: 'Data must be a valid object',
            severity: 'critical',
            code: 'INVALID_SCHEMA',
          };
        }
        return { passed: true, field: '', message: '', severity: 'error', code: '' };
      },
    });

    // Required fields validation
    this.validationRules.push({
      name: 'required-fields',
      validate: async (data) => {
        const requiredFields = [
          'transactionId',
          'amount',
          'currency',
          'timestamp',
        ];

        if (Array.isArray(data)) {
          for (const item of data) {
            for (const field of requiredFields) {
              if (!(field in item)) {
                return {
                  passed: false,
                  field,
                  message: `Required field '${field}' is missing`,
                  severity: 'critical',
                  code: 'MISSING_FIELD',
                };
              }
            }
          }
        }

        return { passed: true, field: '', message: '', severity: 'error', code: '' };
      },
    });

    // Amount validation
    this.validationRules.push({
      name: 'amount-validation',
      validate: async (data) => {
        const items = Array.isArray(data) ? data : [data];

        for (const item of items) {
          if ('amount' in item) {
            const amount = parseFloat(item.amount);

            if (isNaN(amount)) {
              return {
                passed: false,
                field: 'amount',
                message: 'Amount must be a valid number',
                severity: 'error',
                code: 'INVALID_AMOUNT',
              };
            }

            if (amount < 0) {
              return {
                passed: false,
                field: 'amount',
                message: 'Amount cannot be negative',
                severity: 'error',
                code: 'NEGATIVE_AMOUNT',
                suggestion: 'Check transaction type (debit vs credit)',
              };
            }

            // Large transaction warning
            if (amount > 1000000) {
              return {
                passed: false,
                field: 'amount',
                message: 'Transaction amount exceeds threshold',
                severity: 'warning',
                code: 'LARGE_TRANSACTION',
                suggestion: 'Verify large transaction for accuracy',
              };
            }
          }
        }

        return { passed: true, field: '', message: '', severity: 'error', code: '' };
      },
    });

    // Currency validation
    this.validationRules.push({
      name: 'currency-validation',
      validate: async (data) => {
        const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
        const items = Array.isArray(data) ? data : [data];

        for (const item of items) {
          if ('currency' in item) {
            const currency = item.currency?.toUpperCase();

            if (!validCurrencies.includes(currency)) {
              return {
                passed: false,
                field: 'currency',
                message: `Invalid currency code: ${currency}`,
                severity: 'error',
                code: 'INVALID_CURRENCY',
                suggestion: `Valid currencies: ${validCurrencies.join(', ')}`,
              };
            }
          }
        }

        return { passed: true, field: '', message: '', severity: 'error', code: '' };
      },
    });

    // Date validation
    this.validationRules.push({
      name: 'date-validation',
      validate: async (data) => {
        const items = Array.isArray(data) ? data : [data];

        for (const item of items) {
          if ('timestamp' in item || 'date' in item) {
            const dateValue = item.timestamp || item.date;
            const date = new Date(dateValue);

            if (isNaN(date.getTime())) {
              return {
                passed: false,
                field: 'timestamp',
                message: 'Invalid date format',
                severity: 'error',
                code: 'INVALID_DATE',
              };
            }

            // Future date warning
            if (date > new Date()) {
              return {
                passed: false,
                field: 'timestamp',
                message: 'Transaction date is in the future',
                severity: 'warning',
                code: 'FUTURE_DATE',
                suggestion: 'Verify transaction timestamp',
              };
            }

            // Very old transaction warning
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            if (date < sixMonthsAgo) {
              return {
                passed: false,
                field: 'timestamp',
                message: 'Transaction is older than 6 months',
                severity: 'warning',
                code: 'OLD_TRANSACTION',
              };
            }
          }
        }

        return { passed: true, field: '', message: '', severity: 'error', code: '' };
      },
    });

    // Account number validation
    this.validationRules.push({
      name: 'account-validation',
      validate: async (data) => {
        const items = Array.isArray(data) ? data : [data];

        for (const item of items) {
          if ('accountNumber' in item) {
            const account = item.accountNumber;

            // Basic format validation
            if (typeof account !== 'string' || account.length < 8) {
              return {
                passed: false,
                field: 'accountNumber',
                message: 'Invalid account number format',
                severity: 'error',
                code: 'INVALID_ACCOUNT',
              };
            }
          }
        }

        return { passed: true, field: '', message: '', severity: 'error', code: '' };
      },
    });

    // Duplicate detection
    this.validationRules.push({
      name: 'duplicate-detection',
      validate: async (data) => {
        if (Array.isArray(data)) {
          const transactionIds = new Set();
          const duplicates: string[] = [];

          for (const item of data) {
            if ('transactionId' in item) {
              if (transactionIds.has(item.transactionId)) {
                duplicates.push(item.transactionId);
              } else {
                transactionIds.add(item.transactionId);
              }
            }
          }

          if (duplicates.length > 0) {
            return {
              passed: false,
              field: 'transactionId',
              message: `Duplicate transactions found: ${duplicates.join(', ')}`,
              severity: 'warning',
              code: 'DUPLICATE_TRANSACTION',
              suggestion: 'Review duplicate transactions for deduplication',
            };
          }
        }

        return { passed: true, field: '', message: '', severity: 'error', code: '' };
      },
    });
  }

  /**
   * Add custom validation rule
   */
  addRule(rule: ValidationRule): void {
    this.validationRules.push(rule);
  }

  /**
   * Remove validation rule by name
   */
  removeRule(name: string): void {
    this.validationRules = this.validationRules.filter((r) => r.name !== name);
  }
}

// Types
interface ValidationRule {
  name: string;
  validate: (data: any) => Promise<ValidationRuleResult>;
}

interface ValidationRuleResult {
  passed: boolean;
  field: string;
  message: string;
  severity: 'critical' | 'error' | 'warning';
  code: string;
  suggestion?: string;
}
