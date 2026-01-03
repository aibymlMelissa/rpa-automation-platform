import { TransformationRule } from '@/types/rpa.types';

/**
 * Data Transformer for Banking Network Data
 * Applies transformation rules to standardize and enrich data
 */
export class Transformer {
  /**
   * Transform data using provided rules
   */
  async transform(
    data: any,
    rules: TransformationRule[]
  ): Promise<any[]> {
    const items = Array.isArray(data) ? data : [data];
    const transformedItems: any[] = [];

    for (const item of items) {
      const transformed = { ...item };

      // Apply each transformation rule
      for (const rule of rules) {
        try {
          const result = await this.applyRule(transformed, rule);
          Object.assign(transformed, result);
        } catch (error) {
          console.error(`Failed to apply rule ${rule.name}:`, error);
        }
      }

      transformedItems.push(transformed);
    }

    return transformedItems;
  }

  /**
   * Apply a single transformation rule
   */
  private async applyRule(
    item: any,
    rule: TransformationRule
  ): Promise<any> {
    const result: any = {};

    switch (rule.transformationType) {
      case 'mapping':
        result[rule.outputFields[0]] = this.applyMapping(
          item,
          rule.inputFields[0],
          rule.expression
        );
        break;

      case 'calculation':
        result[rule.outputFields[0]] = this.applyCalculation(
          item,
          rule.inputFields,
          rule.expression
        );
        break;

      case 'aggregation':
        result[rule.outputFields[0]] = this.applyAggregation(
          item,
          rule.inputFields,
          rule.expression
        );
        break;

      case 'enrichment':
        const enriched = await this.applyEnrichment(
          item,
          rule.inputFields[0],
          rule.expression
        );
        Object.assign(result, enriched);
        break;
    }

    return result;
  }

  /**
   * Apply mapping transformation
   */
  private applyMapping(item: any, inputField: string, expression: string): any {
    const value = this.getNestedValue(item, inputField);

    // Parse simple expressions
    if (expression.includes('parseFloat')) {
      return parseFloat(value);
    }

    if (expression.includes('toUpperCase')) {
      return value?.toString().toUpperCase();
    }

    if (expression.includes('toLowerCase')) {
      return value?.toString().toLowerCase();
    }

    if (expression.includes('trim')) {
      return value?.toString().trim();
    }

    if (expression.includes('new Date')) {
      return new Date(value).toISOString();
    }

    // Default: return value as-is
    return value;
  }

  /**
   * Apply calculation transformation
   */
  private applyCalculation(
    item: any,
    inputFields: string[],
    expression: string
  ): number {
    const values = inputFields.map((field) =>
      parseFloat(this.getNestedValue(item, field) || '0')
    );

    // Simple calculation parsing
    if (expression.includes('+')) {
      return values.reduce((a, b) => a + b, 0);
    }

    if (expression.includes('-')) {
      return values.reduce((a, b) => a - b);
    }

    if (expression.includes('*')) {
      return values.reduce((a, b) => a * b, 1);
    }

    if (expression.includes('/')) {
      return values.reduce((a, b) => a / b);
    }

    return values[0] || 0;
  }

  /**
   * Apply aggregation transformation
   */
  private applyAggregation(
    item: any,
    inputFields: string[],
    expression: string
  ): any {
    const values = inputFields.map((field) => this.getNestedValue(item, field));

    if (expression.includes('sum')) {
      return values.reduce((a, b) => parseFloat(a || '0') + parseFloat(b || '0'), 0);
    }

    if (expression.includes('avg') || expression.includes('average')) {
      const sum = values.reduce(
        (a, b) => parseFloat(a || '0') + parseFloat(b || '0'),
        0
      );
      return sum / values.length;
    }

    if (expression.includes('min')) {
      return Math.min(...values.map((v) => parseFloat(v || '0')));
    }

    if (expression.includes('max')) {
      return Math.max(...values.map((v) => parseFloat(v || '0')));
    }

    if (expression.includes('count')) {
      return values.filter((v) => v != null).length;
    }

    return values;
  }

  /**
   * Apply enrichment transformation (lookup additional data)
   */
  private async applyEnrichment(
    item: any,
    inputField: string,
    expression: string
  ): Promise<any> {
    const value = this.getNestedValue(item, inputField);

    // Mock enrichment - in production, this would query databases or APIs
    if (expression.includes('lookupAccountDetails')) {
      return {
        accountType: this.determineAccountType(value),
        bankName: this.determineBankName(value),
      };
    }

    if (expression.includes('lookupCustomer')) {
      return {
        customerName: 'Customer Name',
        customerSegment: 'Premium',
      };
    }

    return {};
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  /**
   * Determine account type from account number
   */
  private determineAccountType(accountNumber: string): string {
    // Mock implementation - would use actual business logic
    if (accountNumber?.startsWith('1')) return 'Checking';
    if (accountNumber?.startsWith('2')) return 'Savings';
    if (accountNumber?.startsWith('3')) return 'Credit';
    return 'Unknown';
  }

  /**
   * Determine bank name from account number or routing number
   */
  private determineBankName(identifier: string): string {
    // Mock implementation - would use actual bank routing database
    const bankMap: Record<string, string> = {
      '021000021': 'JPMorgan Chase',
      '026009593': 'Bank of America',
      '121000248': 'Wells Fargo',
      '111000025': 'Citibank',
    };

    return bankMap[identifier?.substring(0, 9)] || 'Unknown Bank';
  }

  /**
   * Batch transform large datasets
   */
  async batchTransform(
    data: any[],
    rules: TransformationRule[],
    batchSize: number = 1000
  ): Promise<any[]> {
    const results: any[] = [];

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const transformed = await this.transform(batch, rules);
      results.push(...transformed);
    }

    return results;
  }
}
