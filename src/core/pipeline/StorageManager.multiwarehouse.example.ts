/**
 * Storage Manager for Banking Data Warehouse Operations
 * (MULTI-WAREHOUSE SUPPORT VERSION)
 *
 * This is an example implementation showing how to update StorageManager
 * to support multiple data warehouses (BigQuery, Oracle Finance).
 *
 * KEY CHANGES FROM ORIGINAL:
 * 1. Uses WarehouseFactory instead of direct BigQueryClient instantiation
 * 2. Warehouse-agnostic data transformation (handled by warehouse clients)
 * 3. Supports dynamic warehouse selection via WAREHOUSE_TYPE env variable
 * 4. Maintains backward compatibility with existing code
 */

import { WarehouseFactory } from '@/core/warehouse/WarehouseFactory';
import type { IDataWarehouse } from '@/core/warehouse/interfaces/IDataWarehouse';
import { BankingTransaction, AuditLogEntry, ETLJob } from '@/types/rpa.types';

/**
 * Storage Manager - Multi-Warehouse Support
 */
export class StorageManager {
  private warehouse: IDataWarehouse;

  constructor() {
    // CHANGED: Use WarehouseFactory instead of direct BigQueryClient
    // This automatically selects the correct warehouse based on WAREHOUSE_TYPE env variable
    this.warehouse = WarehouseFactory.getWarehouse();

    const warehouseType = this.warehouse.getWarehouseType();
    console.log(`[StorageManager] Initialized with warehouse: ${warehouseType}`);
  }

  /**
   * Load data into specified destination
   */
  async load(data: any[], options: LoadOptions): Promise<LoadResult> {
    const startTime = Date.now();
    let recordsLoaded = 0;
    let errors = 0;

    try {
      switch (options.destination) {
        case 'warehouse':
          const warehouseResult = await this.loadToWarehouse(data, options);
          recordsLoaded = warehouseResult.inserted;
          errors = warehouseResult.failed;
          break;

        case 'database':
          await this.loadToDatabase(data, options);
          recordsLoaded = data.length;
          break;

        case 'file':
          await this.loadToFile(data, options);
          recordsLoaded = data.length;
          break;

        case 'api':
          const result = await this.loadToAPI(data, options);
          recordsLoaded = result.success;
          errors = result.failed;
          break;

        default:
          throw new Error(`Unknown destination: ${options.destination}`);
      }

      return {
        recordsLoaded,
        errors,
        duration: Date.now() - startTime,
        destination: options.destination,
      };
    } catch (error) {
      throw new Error(
        `Failed to load data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load data to data warehouse (BigQuery or Oracle Finance)
   * CHANGED: Now warehouse-agnostic - works with any IDataWarehouse implementation
   */
  private async loadToWarehouse(
    data: any[],
    options: LoadOptions
  ): Promise<{ inserted: number; failed: number }> {
    const startTime = Date.now();
    const tableName = options.tableName || 'fact_banking_transactions';
    const warehouseType = this.warehouse.getWarehouseType();
    const capabilities = this.warehouse.getCapabilities();

    console.log(
      `[StorageManager] Loading ${data.length} records to ${warehouseType} warehouse (${tableName})...`
    );

    // Transform data to warehouse schema
    // Note: Data type conversions (e.g., boolean → 1/0 for Oracle) are handled
    // by the warehouse client itself (OracleSchemaMapper)
    const rows = this.transformToWarehouseSchema(data, tableName);

    // Choose loading strategy based on warehouse capabilities
    let result: { insertedRows: number; errors: any[] };

    if (capabilities.supportsStreaming && options.preferStreaming) {
      // Use streaming for real-time, low-latency inserts (BigQuery)
      result = await this.warehouse.streamInsert(tableName, rows);
    } else {
      // Use batch insert for bulk loading (both BigQuery and Oracle)
      const batchSize = options.batchSize || capabilities.optimalBatchSize;
      result = await this.warehouse.batchInsert(tableName, rows, { batchSize });
    }

    console.log(
      `[StorageManager] Warehouse load completed: ${result.insertedRows} inserted, ` +
        `${result.errors.length} failed (${Date.now() - startTime}ms)`
    );

    return {
      inserted: result.insertedRows,
      failed: result.errors.length,
    };
  }

  /**
   * Transform application data to warehouse schema
   * CHANGED: Simplified - warehouse-specific transformations moved to clients
   *
   * This method now focuses on application-level transformations:
   * - Field name mapping (camelCase → snake_case)
   * - Date formatting
   * - JSON serialization
   *
   * Warehouse-specific transformations (e.g., boolean → 1/0) are handled
   * by OracleSchemaMapper inside OracleFinanceClient
   */
  private transformToWarehouseSchema(data: any[], tableName: string): any[] {
    switch (tableName) {
      case 'fact_banking_transactions':
        return data.map((tx: any) => ({
          transaction_id: tx.transactionId || tx.transaction_id,
          account_number: tx.accountNumber || tx.account_number,
          amount: tx.amount,
          currency: tx.currency,
          transaction_type: tx.transactionType || tx.transaction_type,
          status: tx.status,
          transaction_timestamp:
            tx.timestamp instanceof Date ? tx.timestamp : new Date(tx.timestamp),
          transaction_date:
            (tx.timestamp instanceof Date ? tx.timestamp : new Date(tx.timestamp))
              .toISOString()
              .split('T')[0],
          created_at: new Date(),
          job_id: tx.jobId || tx.job_id || null,
          source_bank_id: tx.sourceBank || tx.source_bank_id || null,
          destination_bank_id: tx.destinationBank || tx.destination_bank_id || null,
          clearinghouse_id: tx.clearinghouseId || tx.clearinghouse_id || null,
          clearinghouse_reference: tx.clearinghouseReference || tx.clearinghouse_reference || null,
          metadata: tx.metadata || {}, // Keep as object - warehouse client will serialize
          extraction_job_id: tx.extractionJobId || tx.extraction_job_id || null,
          etl_job_id: tx.etlJobId || tx.etl_job_id || null,
          validation_status: tx.validationStatus || tx.validation_status || null,
          data_quality_score: tx.dataQualityScore || tx.data_quality_score || null,
        }));

      case 'fact_audit_logs':
        return data.map((log: any) => ({
          audit_id: log.id || log.audit_id,
          user_id: log.userId || log.user_id,
          action: log.action,
          resource: log.resource,
          resource_id: log.resourceId || log.resource_id,
          result: log.result,
          timestamp: log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp),
          log_date:
            (log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp))
              .toISOString()
              .split('T')[0],
          ip_address: log.ipAddress || log.ip_address || null,
          user_agent: log.userAgent || log.user_agent || null,
          changes: log.changes || {}, // Keep as object
          error_message: log.errorMessage || log.error_message || null,
          session_id: log.sessionId || log.session_id || null,
          compliance_mode: log.complianceMode || log.compliance_mode || null,
        }));

      default:
        // Pass through for other tables
        return data;
    }
  }

  /**
   * Load data to relational database
   * (No changes required)
   */
  private async loadToDatabase(data: any[], options: LoadOptions): Promise<void> {
    console.log(`Loading ${data.length} records to database...`);

    const batchSize = options.batchSize || 500;
    const tableName = options.tableName || 'banking_transactions';

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      const values = batch.map((record) => this.recordToSQL(record)).join(',');
      const sql = `INSERT INTO ${tableName} VALUES ${values}`;

      await this.executeSQLInsert(sql);
    }
  }

  /**
   * Load data to file (CSV, JSON, Parquet)
   * (No changes required)
   */
  private async loadToFile(data: any[], options: LoadOptions): Promise<void> {
    const format = options.fileFormat || 'json';
    const filePath = options.filePath || `./output/data.${format}`;

    console.log(`Writing ${data.length} records to ${filePath}...`);

    switch (format) {
      case 'json':
        await this.writeJSON(filePath, data);
        break;
      case 'csv':
        await this.writeCSV(filePath, data);
        break;
      case 'parquet':
        await this.writeParquet(filePath, data);
        break;
      default:
        throw new Error(`Unsupported file format: ${format}`);
    }
  }

  /**
   * Load data to external API
   * (No changes required)
   */
  private async loadToAPI(
    data: any[],
    options: LoadOptions
  ): Promise<{ success: number; failed: number }> {
    console.log(`Sending ${data.length} records to API...`);

    let success = 0;
    let failed = 0;

    const batchSize = options.batchSize || 100;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      try {
        await this.sendToAPI(batch, options.apiEndpoint || '');
        success += batch.length;
      } catch (error) {
        failed += batch.length;
        console.error(`API batch ${i / batchSize} failed:`, error);
      }
    }

    return { success, failed };
  }

  /**
   * Load job execution metadata to warehouse
   * CHANGED: Uses warehouse abstraction, no longer hardcoded to BigQuery
   */
  async loadJobExecution(execution: JobExecutionMetadata): Promise<void> {
    try {
      // Use streamInsert if supported, otherwise fallback to batchInsert
      const capabilities = this.warehouse.getCapabilities();

      const record = {
        execution_id: execution.executionId,
        job_id: execution.jobId,
        banking_network_id: execution.bankingNetworkId || null,
        status: execution.status,
        extraction_method: execution.extractionMethod,
        started_at: execution.startedAt,
        completed_at: execution.completedAt || null,
        execution_date: execution.startedAt.toISOString().split('T')[0],
        duration_ms: execution.durationMs || null,
        records_extracted: execution.recordsExtracted || null,
        records_processed: execution.recordsProcessed || null,
        error_count: execution.errorCount || null,
        data_size_bytes: execution.dataSizeBytes || null,
        error_message: execution.errorMessage || null,
        error_code: execution.errorCode || null,
        retry_attempt: execution.retryAttempt || null,
        extraction_duration_ms: execution.extractionDurationMs || null,
        validation_duration_ms: execution.validationDurationMs || null,
        transformation_duration_ms: execution.transformationDurationMs || null,
        load_duration_ms: execution.loadDurationMs || null,
      };

      if (capabilities.supportsStreaming) {
        await this.warehouse.streamInsert('fact_job_executions', [record]);
      } else {
        await this.warehouse.batchInsert('fact_job_executions', [record]);
      }

      console.log(`[StorageManager] Job execution metadata persisted: ${execution.executionId}`);
    } catch (error) {
      console.error('[StorageManager] Failed to persist job execution:', error);
      // Don't throw - metadata persistence failure shouldn't break the pipeline
    }
  }

  /**
   * Load ETL job metadata to warehouse
   * CHANGED: Uses warehouse abstraction
   */
  async loadETLJob(etlJob: ETLJob): Promise<void> {
    try {
      const capabilities = this.warehouse.getCapabilities();

      const record = {
        etl_job_id: etlJob.id,
        extraction_job_id: etlJob.extractionJobId,
        stage: etlJob.stage,
        status: etlJob.status,
        started_at: etlJob.startedAt || null,
        completed_at: etlJob.completedAt || null,
        execution_date: (etlJob.startedAt || new Date()).toISOString().split('T')[0],
        duration_ms:
          etlJob.completedAt && etlJob.startedAt
            ? etlJob.completedAt.getTime() - etlJob.startedAt.getTime()
            : null,
        records_processed: etlJob.recordsProcessed || null,
        error_count: etlJob.errorCount || null,
        warning_count: 0,
        validation_errors: {},
        transformation_rules_applied: {},
      };

      if (capabilities.supportsStreaming) {
        await this.warehouse.streamInsert('fact_etl_pipeline_jobs', [record]);
      } else {
        await this.warehouse.batchInsert('fact_etl_pipeline_jobs', [record]);
      }

      console.log(`[StorageManager] ETL job metadata persisted: ${etlJob.id}`);
    } catch (error) {
      console.error('[StorageManager] Failed to persist ETL job:', error);
    }
  }

  /**
   * Get current warehouse information
   * NEW: Useful for logging/monitoring
   */
  getWarehouseInfo(): WarehouseInfo {
    return {
      type: this.warehouse.getWarehouseType(),
      capabilities: this.warehouse.getCapabilities(),
    };
  }

  // ============================================================================
  // Private Helper Methods (No changes required)
  // ============================================================================

  private recordToSQL(record: any): string {
    const values = Object.values(record).map((v) => {
      if (v === null || v === undefined) return 'NULL';
      if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
      if (v instanceof Date) return `'${v.toISOString()}'`;
      return v;
    });

    return `(${values.join(',')})`;
  }

  private async executeSQLInsert(sql: string): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 50));
  }

  private async writeJSON(filePath: string, data: any[]): Promise<void> {
    const fs = await import('fs/promises');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  private async writeCSV(filePath: string, data: any[]): Promise<void> {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvHeader = headers.join(',') + '\n';

    const csvRows = data
      .map((record) =>
        headers
          .map((header) => {
            const value = record[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(',')
      )
      .join('\n');

    const csv = csvHeader + csvRows;

    const fs = await import('fs/promises');
    await fs.writeFile(filePath, csv, 'utf8');
  }

  private async writeParquet(filePath: string, data: any[]): Promise<void> {
    console.log(`Writing Parquet file to ${filePath} (mocked)`);
    await this.writeJSON(filePath.replace('.parquet', '.json'), data);
  }

  private async sendToAPI(batch: any[], endpoint: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.95) {
          reject(new Error('API call failed'));
        } else {
          resolve();
        }
      }, 100);
    });
  }
}

// ============================================================================
// Types
// ============================================================================

export interface LoadOptions {
  destination: 'warehouse' | 'database' | 'file' | 'api';
  batchSize?: number;
  tableName?: string;
  filePath?: string;
  fileFormat?: 'json' | 'csv' | 'parquet';
  apiEndpoint?: string;
  preferStreaming?: boolean; // NEW: Allow caller to request streaming if supported
}

export interface LoadResult {
  recordsLoaded: number;
  errors: number;
  duration: number;
  destination: string;
}

export interface JobExecutionMetadata {
  executionId: string;
  jobId: string;
  bankingNetworkId?: string;
  status: string;
  extractionMethod: string;
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
  recordsExtracted?: number;
  recordsProcessed?: number;
  errorCount?: number;
  dataSizeBytes?: number;
  errorMessage?: string;
  errorCode?: string;
  retryAttempt?: number;
  extractionDurationMs?: number;
  validationDurationMs?: number;
  transformationDurationMs?: number;
  loadDurationMs?: number;
}

export interface WarehouseInfo {
  type: string;
  capabilities: any;
}

// ============================================================================
// Migration Guide
// ============================================================================

/*
## How to Apply These Changes to Existing StorageManager.ts

### Step 1: Update imports
```typescript
// OLD
import { BigQueryClient } from '@/core/warehouse/BigQueryClient';

// NEW
import { WarehouseFactory } from '@/core/warehouse/WarehouseFactory';
import type { IDataWarehouse } from '@/core/warehouse/interfaces/IDataWarehouse';
```

### Step 2: Update constructor
```typescript
// OLD
private bigQueryClient: BigQueryClient;
constructor() {
  this.bigQueryClient = new BigQueryClient();
}

// NEW
private warehouse: IDataWarehouse;
constructor() {
  this.warehouse = WarehouseFactory.getWarehouse();
}
```

### Step 3: Replace BigQuery method calls
```typescript
// OLD
await this.bigQueryClient.batchInsert(tableName, rows, batchSize);

// NEW
await this.warehouse.batchInsert(tableName, rows, { batchSize });
```

### Step 4: Simplify transformToBigQuerySchema()
- Rename to transformToWarehouseSchema()
- Remove JSON.stringify() for metadata fields (warehouse client handles this)
- Keep Date objects as Date (don't convert to ISO strings)

### Step 5: Update loadJobExecution() and loadETLJob()
- Replace this.bigQueryClient.streamInsert() with this.warehouse.streamInsert()
- Check capabilities.supportsStreaming before using streaming

### Step 6: Test with both warehouses
```bash
# Test with BigQuery (default)
WAREHOUSE_TYPE=bigquery npm run dev

# Test with Oracle Finance
WAREHOUSE_TYPE=oracle-finance npm run dev
```

## Backward Compatibility

✅ All existing code continues to work unchanged
✅ Default behavior is identical (BigQuery)
✅ No breaking changes to public API
✅ LoadOptions, LoadResult types unchanged
*/
