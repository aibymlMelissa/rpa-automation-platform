/**
 * Warehouse Factory
 *
 * Factory pattern for creating and managing data warehouse client instances.
 * Supports runtime selection between BigQuery and Oracle Finance based on
 * environment configuration.
 *
 * Usage:
 * ```typescript
 * import { WarehouseFactory } from '@/core/warehouse/WarehouseFactory';
 *
 * const warehouse = WarehouseFactory.getWarehouse();
 * await warehouse.batchInsert('fact_transactions', data);
 * ```
 */

import type { IDataWarehouse, WarehouseType } from './interfaces/IDataWarehouse';
import { WarehouseError } from './interfaces/IDataWarehouse';

/**
 * Warehouse Factory
 * Implements singleton pattern with lazy initialization
 */
export class WarehouseFactory {
  private static instance: IDataWarehouse | null = null;
  private static initPromise: Promise<void> | null = null;

  /**
   * Get the configured warehouse instance (singleton)
   * Automatically initializes on first access
   *
   * @returns IDataWarehouse implementation (BigQuery or Oracle)
   */
  static getWarehouse(): IDataWarehouse {
    if (!this.instance) {
      const warehouseType = this.getWarehouseType();
      this.instance = this.createWarehouse(warehouseType);
    }

    return this.instance;
  }

  /**
   * Get the warehouse instance asynchronously with initialization
   * Use this if you need to ensure the warehouse is fully initialized
   *
   * @returns Promise<IDataWarehouse>
   */
  static async getWarehouseAsync(): Promise<IDataWarehouse> {
    const warehouse = this.getWarehouse();

    // Lazy initialization (only once)
    if (!this.initPromise) {
      this.initPromise = warehouse.initialize();
    }

    await this.initPromise;
    return warehouse;
  }

  /**
   * Reset the singleton instance (useful for testing or switching warehouses)
   * Disconnects existing warehouse before resetting
   */
  static async resetInstance(): Promise<void> {
    if (this.instance) {
      await this.instance.disconnect();
      this.instance = null;
      this.initPromise = null;
    }
  }

  /**
   * Get the configured warehouse type from environment
   *
   * @returns WarehouseType ('bigquery' | 'oracle-finance')
   */
  static getWarehouseType(): WarehouseType {
    const type = process.env.WAREHOUSE_TYPE?.toLowerCase() as WarehouseType;

    // Default to BigQuery if not specified
    if (!type) {
      console.log('[WarehouseFactory] WAREHOUSE_TYPE not set, defaulting to bigquery');
      return 'bigquery';
    }

    // Validate warehouse type
    if (type !== 'bigquery' && type !== 'oracle-finance') {
      throw new WarehouseError(
        `Invalid WAREHOUSE_TYPE: ${type}. Must be 'bigquery' or 'oracle-finance'`
      );
    }

    console.log(`[WarehouseFactory] Using warehouse: ${type}`);
    return type;
  }

  /**
   * Create a warehouse instance based on type
   *
   * @param type - Warehouse type
   * @returns IDataWarehouse instance
   */
  private static createWarehouse(type: WarehouseType): IDataWarehouse {
    switch (type) {
      case 'bigquery':
        return this.createBigQueryClient();

      case 'oracle-finance':
        return this.createOracleFinanceClient();

      default:
        throw new WarehouseError(`Unsupported warehouse type: ${type}`);
    }
  }

  /**
   * Create BigQuery client instance
   */
  private static createBigQueryClient(): IDataWarehouse {
    // Check if running on Vercel (stubbed implementation)
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

    if (isVercel) {
      // Use stubbed version on Vercel
      const { BigQueryClient } = require('./BigQueryClient');
      return new BigQueryClient();
    } else {
      // Check if local implementation exists
      try {
        const { BigQueryClient } = require('./BigQueryClient.local');
        return new BigQueryClient();
      } catch {
        // Fall back to stub if local version not found
        const { BigQueryClient } = require('./BigQueryClient');
        return new BigQueryClient();
      }
    }
  }

  /**
   * Create Oracle Finance client instance
   */
  private static createOracleFinanceClient(): IDataWarehouse {
    try {
      // Try to load production implementation (remove .mockup)
      const { OracleFinanceClient } = require('./OracleFinanceClient');
      return new OracleFinanceClient();
    } catch {
      try {
        // Fall back to mockup if production version doesn't exist
        const { OracleFinanceClient } = require('./OracleFinanceClient.mockup');
        console.warn(
          '[WarehouseFactory] Using OracleFinanceClient.mockup - install oracledb for production'
        );
        return new OracleFinanceClient();
      } catch (error: any) {
        throw new WarehouseError(
          `Failed to load OracleFinanceClient: ${error.message}. ` +
            `Please install dependencies: npm install oracledb @oracle/oci-sdk`
        );
      }
    }
  }

  /**
   * Check if a warehouse type is available
   *
   * @param type - Warehouse type to check
   * @returns True if warehouse implementation is available
   */
  static isWarehouseAvailable(type: WarehouseType): boolean {
    try {
      this.createWarehouse(type);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all available warehouse types
   *
   * @returns Array of available warehouse types
   */
  static getAvailableWarehouses(): WarehouseType[] {
    const warehouses: WarehouseType[] = [];

    if (this.isWarehouseAvailable('bigquery')) {
      warehouses.push('bigquery');
    }

    if (this.isWarehouseAvailable('oracle-finance')) {
      warehouses.push('oracle-finance');
    }

    return warehouses;
  }
}

// ============================================================================
// Convenience Exports
// ============================================================================

/**
 * Get the current warehouse instance (shorthand)
 */
export function getWarehouse(): IDataWarehouse {
  return WarehouseFactory.getWarehouse();
}

/**
 * Get the current warehouse instance async (with initialization)
 */
export async function getWarehouseAsync(): Promise<IDataWarehouse> {
  return WarehouseFactory.getWarehouseAsync();
}

/**
 * Reset warehouse instance (for testing)
 */
export async function resetWarehouse(): Promise<void> {
  return WarehouseFactory.resetInstance();
}

// ============================================================================
// Usage Examples
// ============================================================================

/*
// Example 1: Basic usage
import { WarehouseFactory } from '@/core/warehouse/WarehouseFactory';

const warehouse = WarehouseFactory.getWarehouse();
await warehouse.batchInsert('fact_transactions', data);

// Example 2: Check warehouse type
const type = WarehouseFactory.getWarehouseType();
console.log(`Using warehouse: ${type}`); // "bigquery" or "oracle-finance"

// Example 3: Check capabilities
const warehouse = WarehouseFactory.getWarehouse();
const capabilities = warehouse.getCapabilities();
if (capabilities.supportsStreaming) {
  await warehouse.streamInsert('table', rows);
} else {
  await warehouse.batchInsert('table', rows);
}

// Example 4: Switch warehouses (testing)
process.env.WAREHOUSE_TYPE = 'oracle-finance';
await WarehouseFactory.resetInstance();
const oracleWarehouse = WarehouseFactory.getWarehouse();

// Example 5: Check availability
const available = WarehouseFactory.getAvailableWarehouses();
console.log('Available warehouses:', available); // ['bigquery', 'oracle-finance']
*/
