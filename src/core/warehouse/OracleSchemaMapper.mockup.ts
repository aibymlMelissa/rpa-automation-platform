/**
 * Oracle Schema Mapper (MOCKUP)
 *
 * Handles data type conversions and schema transformations between
 * BigQuery format and Oracle Finance database schema.
 *
 * Key Responsibilities:
 * - Convert BigQuery data types to Oracle data types
 * - Handle JSON serialization/deserialization (CLOB)
 * - Convert boolean values (true/false → 1/0)
 * - Format dates and timestamps
 * - Map column names (snake_case preserved)
 */

export class OracleSchemaMapper {
  // BigQuery → Oracle data type mapping
  private readonly typeMap: Map<string, string> = new Map([
    ['STRING', 'VARCHAR2(4000)'],
    ['INT64', 'NUMBER(19,0)'],
    ['FLOAT64', 'NUMBER(38,9)'],
    ['NUMERIC', 'NUMBER(38,9)'],
    ['BIGNUMERIC', 'NUMBER(38,9)'],
    ['BOOLEAN', 'NUMBER(1)'], // 0 = false, 1 = true
    ['TIMESTAMP', 'TIMESTAMP WITH TIME ZONE'],
    ['DATE', 'DATE'],
    ['TIME', 'TIMESTAMP'], // Oracle has no TIME type, use TIMESTAMP
    ['DATETIME', 'TIMESTAMP'],
    ['BYTES', 'BLOB'],
    ['GEOGRAPHY', 'SDO_GEOMETRY'], // Oracle Spatial
    ['JSON', 'CLOB'], // JSON stored as CLOB with CHECK constraint
    ['ARRAY', 'CLOB'], // Arrays stored as JSON strings
    ['STRUCT', 'CLOB'], // Structs stored as JSON objects
    ['RECORD', 'CLOB'], // Records stored as JSON objects
  ]);

  // Track which columns are boolean for each table
  private readonly booleanColumns: Map<string, Set<string>> = new Map([
    ['dim_jobs', new Set(['is_active', 'is_current', 'is_deleted'])],
    ['dim_banking_networks', new Set(['is_active', 'supports_realtime', 'requires_mfa'])],
    ['fact_banking_transactions', new Set(['is_reconciled', 'is_flagged'])],
    ['fact_job_executions', new Set(['is_success'])],
  ]);

  // Track which columns are JSON/CLOB for each table
  private readonly jsonColumns: Map<string, Set<string>> = new Map([
    ['fact_banking_transactions', new Set(['metadata', 'error_details'])],
    ['fact_job_executions', new Set(['configuration', 'error_details', 'metrics'])],
    ['dim_jobs', new Set(['configuration', 'authentication_config'])],
    ['dim_banking_networks', new Set(['capabilities', 'protocols'])],
  ]);

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Convert a BigQuery row to Oracle schema format
   * Handles data type conversions, JSON serialization, boolean conversion
   *
   * @param tableName - Target Oracle table name
   * @param row - Row data in BigQuery format
   * @returns Row data in Oracle format
   */
  toOracleSchema(tableName: string, row: Record<string, any>): Record<string, any> {
    const mapped: Record<string, any> = {};

    for (const [key, value] of Object.entries(row)) {
      if (value === null || value === undefined) {
        mapped[key] = null;
        continue;
      }

      // Handle booleans → 1/0
      if (this.isBooleanColumn(tableName, key)) {
        mapped[key] = this.convertBooleanToNumber(value);
      }
      // Handle JSON/objects → CLOB string
      else if (this.isJSONColumn(tableName, key)) {
        mapped[key] = this.serializeJSON(value);
      }
      // Handle dates
      else if (value instanceof Date) {
        mapped[key] = value; // oracledb handles Date objects natively
      }
      // Handle nested objects/arrays (convert to JSON)
      else if (typeof value === 'object') {
        mapped[key] = this.serializeJSON(value);
      }
      // Handle primitives
      else {
        mapped[key] = value;
      }
    }

    return mapped;
  }

  /**
   * Convert an Oracle row back to standard format
   * Handles deserialization, boolean conversion, JSON parsing
   *
   * @param tableName - Source Oracle table name
   * @param row - Row data from Oracle
   * @returns Row data in standard format
   */
  fromOracleSchema(tableName: string, row: Record<string, any>): Record<string, any> {
    const mapped: Record<string, any> = {};

    for (const [key, value] of Object.entries(row)) {
      if (value === null || value === undefined) {
        mapped[key] = null;
        continue;
      }

      // Handle 1/0 → booleans
      if (this.isBooleanColumn(tableName, key)) {
        mapped[key] = this.convertNumberToBoolean(value);
      }
      // Handle CLOB → JSON
      else if (this.isJSONColumn(tableName, key)) {
        mapped[key] = this.deserializeJSON(value);
      }
      // Handle primitives
      else {
        mapped[key] = value;
      }
    }

    return mapped;
  }

  /**
   * Map a BigQuery data type to Oracle data type
   *
   * @param bigQueryType - BigQuery data type (e.g., "STRING", "INT64")
   * @returns Oracle data type (e.g., "VARCHAR2(4000)", "NUMBER(19,0)")
   */
  mapType(bigQueryType: string): string {
    const oracleType = this.typeMap.get(bigQueryType.toUpperCase());

    if (!oracleType) {
      console.warn(`[OracleSchemaMapper] Unknown type: ${bigQueryType}, defaulting to VARCHAR2(4000)`);
      return 'VARCHAR2(4000)';
    }

    return oracleType;
  }

  /**
   * Get column metadata for a specific table and column
   *
   * @param tableName - Table name
   * @param columnName - Column name
   * @returns Column metadata
   */
  getColumnInfo(tableName: string, columnName: string): ColumnInfo {
    // MOCKUP: In production, load from schema definition files
    return {
      name: columnName,
      type: this.inferColumnType(tableName, columnName),
      isBoolean: this.isBooleanColumn(tableName, columnName),
      isJSON: this.isJSONColumn(tableName, columnName),
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private isBooleanColumn(tableName: string, columnName: string): boolean {
    const columns = this.booleanColumns.get(tableName);
    return columns ? columns.has(columnName) : false;
  }

  private isJSONColumn(tableName: string, columnName: string): boolean {
    const columns = this.jsonColumns.get(tableName);
    return columns ? columns.has(columnName) : false;
  }

  private convertBooleanToNumber(value: any): number {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    if (typeof value === 'number') {
      return value !== 0 ? 1 : 0;
    }
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      return lower === 'true' || lower === '1' || lower === 'yes' ? 1 : 0;
    }
    return 0;
  }

  private convertNumberToBoolean(value: any): boolean {
    if (typeof value === 'number') {
      return value !== 0;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      return lower === 'true' || lower === '1' || lower === 'yes';
    }
    return false;
  }

  private serializeJSON(value: any): string {
    try {
      if (typeof value === 'string') {
        // Already a string, validate it's valid JSON
        JSON.parse(value);
        return value;
      }
      return JSON.stringify(value);
    } catch (error) {
      console.warn('[OracleSchemaMapper] Failed to serialize JSON:', error);
      return '{}';
    }
  }

  private deserializeJSON(value: any): any {
    if (typeof value === 'object' && value !== null) {
      // Already an object
      return value;
    }

    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.warn('[OracleSchemaMapper] Failed to parse JSON:', error);
        return value; // Return as string if parsing fails
      }
    }

    return value;
  }

  private inferColumnType(tableName: string, columnName: string): string {
    // MOCKUP: In production, load from schema definition
    if (this.isBooleanColumn(tableName, columnName)) {
      return 'NUMBER(1)';
    }
    if (this.isJSONColumn(tableName, columnName)) {
      return 'CLOB';
    }
    if (columnName.endsWith('_date')) {
      return 'DATE';
    }
    if (columnName.endsWith('_timestamp') || columnName.endsWith('_at')) {
      return 'TIMESTAMP WITH TIME ZONE';
    }
    if (columnName.endsWith('_id')) {
      return 'VARCHAR2(255)';
    }
    if (columnName.includes('amount') || columnName.includes('price')) {
      return 'NUMBER(18,2)';
    }
    return 'VARCHAR2(4000)';
  }
}

// ============================================================================
// Types
// ============================================================================

export interface ColumnInfo {
  name: string;
  type: string;
  isBoolean: boolean;
  isJSON: boolean;
}

// ============================================================================
// Export Singleton (Optional)
// ============================================================================

let mapperInstance: OracleSchemaMapper | null = null;

export function getOracleSchemaMapper(): OracleSchemaMapper {
  if (!mapperInstance) {
    mapperInstance = new OracleSchemaMapper();
  }
  return mapperInstance;
}
