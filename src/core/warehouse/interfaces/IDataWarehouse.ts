/**
 * Data Warehouse Interface
 *
 * Common interface for all data warehouse implementations (BigQuery, Oracle Finance, etc.)
 * Provides abstraction for warehouse operations and enables runtime warehouse selection.
 */

export type WarehouseType = 'bigquery' | 'oracle-finance';

export type FileFormat = 'CSV' | 'JSON' | 'PARQUET' | 'AVRO';

/**
 * Result of insert operations
 */
export interface InsertResult {
  insertedRows: number;
  errors: InsertError[];
}

export interface InsertError {
  row: number;
  message: string;
  code?: string;
}

/**
 * Options for batch operations
 */
export interface BatchOptions {
  batchSize?: number;
  autoCommit?: boolean;
  continueOnError?: boolean;
}

/**
 * Options for load operations
 */
export interface LoadOptions extends BatchOptions {
  skipInvalidRows?: boolean;
  maxBadRecords?: number;
}

/**
 * Health check result
 */
export interface HealthCheckResult {
  healthy: boolean;
  latencyMs?: number;
  message?: string;
  details?: Record<string, any>;
}

/**
 * Table definition for schema creation
 */
export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  partitionColumn?: string;
  clusteringColumns?: string[];
  description?: string;
}

export interface ColumnDefinition {
  name: string;
  type: string;
  mode?: 'REQUIRED' | 'NULLABLE' | 'REPEATED';
  description?: string;
}

/**
 * Warehouse capabilities
 */
export interface WarehouseCapabilities {
  supportsStreaming: boolean;
  supportsPartitioning: boolean;
  supportsJSON: boolean;
  supportsMaterializedViews: boolean;
  supportsTransactions: boolean;
  maxBatchSize: number;
  optimalBatchSize: number;
}

/**
 * Main interface that all data warehouse clients must implement
 */
export interface IDataWarehouse {
  // ============================================================================
  // Lifecycle Management
  // ============================================================================

  /**
   * Initialize the warehouse connection (lazy initialization)
   */
  initialize(): Promise<void>;

  /**
   * Disconnect and clean up resources
   */
  disconnect(): Promise<void>;

  /**
   * Check warehouse health and connectivity
   */
  healthCheck(): Promise<HealthCheckResult>;

  // ============================================================================
  // Data Loading
  // ============================================================================

  /**
   * Stream insert for real-time, low-latency inserts
   * Best for: Real-time data feeds, event streaming
   *
   * @param table - Target table name
   * @param rows - Array of row objects
   * @returns Insert result with row count and errors
   */
  streamInsert(table: string, rows: any[]): Promise<InsertResult>;

  /**
   * Batch insert with retry logic for bulk data loading
   * Best for: Large data imports, scheduled jobs
   *
   * @param table - Target table name
   * @param rows - Array of row objects
   * @param options - Batch configuration
   * @returns Insert result with row count and errors
   */
  batchInsert(table: string, rows: any[], options?: BatchOptions): Promise<InsertResult>;

  /**
   * Load data from file (CSV, JSON, Parquet)
   * Best for: Data migrations, file-based ETL
   *
   * @param table - Target table name
   * @param filePath - Path to source file
   * @param format - File format
   * @returns Insert result
   */
  loadFromFile(table: string, filePath: string, format: FileFormat): Promise<InsertResult>;

  // ============================================================================
  // Querying
  // ============================================================================

  /**
   * Execute a SQL query and return results
   *
   * @param sql - SQL query (BigQuery syntax - will be translated for other warehouses)
   * @param params - Query parameters (positional or named)
   * @returns Array of result rows
   */
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;

  /**
   * Execute a query and return a single row (or null)
   *
   * @param sql - SQL query
   * @param params - Query parameters
   * @returns Single row or null
   */
  querySingle<T = any>(sql: string, params?: any[]): Promise<T | null>;

  // ============================================================================
  // Schema Management
  // ============================================================================

  /**
   * Create a table with the given definition
   *
   * @param definition - Table structure
   */
  createTable(definition: TableDefinition): Promise<void>;

  /**
   * Check if a table exists
   *
   * @param tableName - Table name to check
   * @returns True if table exists
   */
  tableExists(tableName: string): Promise<boolean>;

  /**
   * Drop a table (use with caution!)
   *
   * @param tableName - Table name to drop
   */
  dropTable(tableName: string): Promise<void>;

  // ============================================================================
  // Metadata
  // ============================================================================

  /**
   * Get the warehouse type identifier
   */
  getWarehouseType(): WarehouseType;

  /**
   * Get warehouse capabilities
   */
  getCapabilities(): WarehouseCapabilities;
}

/**
 * Base error class for warehouse operations
 */
export class WarehouseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'WarehouseError';
  }
}

/**
 * Error thrown when warehouse connection fails
 */
export class WarehouseConnectionError extends WarehouseError {
  constructor(message: string, details?: any) {
    super(message, 'CONNECTION_ERROR', details);
    this.name = 'WarehouseConnectionError';
  }
}

/**
 * Error thrown when insert operation fails
 */
export class WarehouseInsertError extends WarehouseError {
  constructor(message: string, details?: any) {
    super(message, 'INSERT_ERROR', details);
    this.name = 'WarehouseInsertError';
  }
}

/**
 * Error thrown when query execution fails
 */
export class WarehouseQueryError extends WarehouseError {
  constructor(message: string, details?: any) {
    super(message, 'QUERY_ERROR', details);
    this.name = 'WarehouseQueryError';
  }
}
