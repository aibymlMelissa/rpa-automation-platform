# Oracle Finance Data Warehouse Implementation Plan

## Executive Summary

This document outlines the implementation plan for adding **Oracle Finance (Oracle Financials Cloud/ERP Cloud)** as an alternative data warehouse connector to the existing Google BigQuery integration. The implementation follows a **parallel support strategy**, allowing both warehouses to coexist with runtime selection.

**Status**: Planning Phase
**Target Completion**: TBD
**Estimated Effort**: 40-60 developer hours

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Implementation Strategy](#implementation-strategy)
3. [Phase 1: Foundation & Abstraction](#phase-1-foundation--abstraction)
4. [Phase 2: Oracle Client Implementation](#phase-2-oracle-client-implementation)
5. [Phase 3: Schema & Data Mapping](#phase-3-schema--data-mapping)
6. [Phase 4: Integration & Testing](#phase-4-integration--testing)
7. [Phase 5: Migration & Deployment](#phase-5-migration--deployment)
8. [Configuration Guide](#configuration-guide)
9. [Testing Strategy](#testing-strategy)
10. [Rollback Plan](#rollback-plan)

---

## Architecture Overview

### Current State (BigQuery Only)

```
ETL Pipeline → StorageManager → BigQueryClient → Google BigQuery
                                      ↓
                                Analytics API
```

### Target State (Multi-Warehouse Support)

```
                            ┌─→ BigQueryClient → Google BigQuery
ETL Pipeline → StorageManager → WarehouseFactory ─┤
                            └─→ OracleFinanceClient → Oracle Finance
                                      ↓
                                Analytics API
                                (warehouse-agnostic queries)
```

### Design Principles

1. **Abstraction Layer**: Shared `IDataWarehouse` interface for all warehouse implementations
2. **Factory Pattern**: Runtime selection of warehouse based on configuration
3. **Zero Breaking Changes**: Existing BigQuery functionality remains unchanged
4. **Dual Support**: Both warehouses can run simultaneously (A/B testing, migration)
5. **Type Safety**: Strict TypeScript interfaces with compile-time checks

---

## Implementation Strategy

### Approach: Parallel Support with Abstraction

**Rationale**: Avoid breaking changes, enable gradual migration, support hybrid deployments.

**Key Components**:

| Component | Purpose | Status |
|-----------|---------|--------|
| `IDataWarehouse` | Common interface for all warehouse clients | New |
| `WarehouseFactory` | Runtime warehouse selection | New |
| `OracleFinanceClient` | Oracle-specific implementation | New |
| `OracleSchemaMapper` | BigQuery ↔ Oracle schema translation | New |
| `StorageManager` | Updated for multi-warehouse routing | Modified |
| `BigQueryClient` | Refactored to implement `IDataWarehouse` | Modified |
| `WarehouseConfig` | Centralized warehouse configuration | New |

---

## Phase 1: Foundation & Abstraction

**Effort**: 6-8 hours
**Risk**: Low

### 1.1 Create Data Warehouse Interface

**File**: `src/core/warehouse/interfaces/IDataWarehouse.ts`

**Purpose**: Define common contract for all warehouse implementations.

**Interface Design**:

```typescript
export interface IDataWarehouse {
  // Lifecycle
  initialize(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<HealthCheckResult>;

  // Data Loading
  streamInsert(table: string, rows: any[]): Promise<InsertResult>;
  batchInsert(table: string, rows: any[], options?: BatchOptions): Promise<InsertResult>;
  loadFromFile(table: string, filePath: string, format: FileFormat): Promise<InsertResult>;

  // Querying
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  querySingle<T>(sql: string, params?: any[]): Promise<T | null>;

  // Schema Management
  createTable(definition: TableDefinition): Promise<void>;
  tableExists(tableName: string): Promise<boolean>;
  dropTable(tableName: string): Promise<void>;

  // Metadata
  getWarehouseType(): WarehouseType;
  getCapabilities(): WarehouseCapabilities;
}

export type WarehouseType = 'bigquery' | 'oracle-finance';

export interface WarehouseCapabilities {
  supportsStreaming: boolean;
  supportsPartitioning: boolean;
  supportsJSON: boolean;
  supportsMaterializedViews: boolean;
  maxBatchSize: number;
}
```

**Deliverables**:
- [ ] `IDataWarehouse.ts` interface definition
- [ ] `WarehouseTypes.ts` common types
- [ ] `WarehouseErrors.ts` error classes

---

### 1.2 Create Warehouse Factory

**File**: `src/core/warehouse/WarehouseFactory.ts`

**Purpose**: Select and instantiate the correct warehouse client at runtime.

**Implementation**:

```typescript
export class WarehouseFactory {
  private static instance: IDataWarehouse | null = null;

  static getWarehouse(): IDataWarehouse {
    if (!this.instance) {
      const type = process.env.WAREHOUSE_TYPE as WarehouseType || 'bigquery';

      switch (type) {
        case 'bigquery':
          this.instance = new BigQueryClient();
          break;
        case 'oracle-finance':
          this.instance = new OracleFinanceClient();
          break;
        default:
          throw new Error(`Unsupported warehouse type: ${type}`);
      }

      // Lazy initialization
      this.instance.initialize();
    }

    return this.instance;
  }

  static resetInstance(): void {
    if (this.instance) {
      this.instance.disconnect();
      this.instance = null;
    }
  }
}
```

**Deliverables**:
- [ ] `WarehouseFactory.ts` implementation
- [ ] Singleton pattern with lazy initialization
- [ ] Environment-based warehouse selection

---

### 1.3 Refactor BigQueryClient to Implement Interface

**File**: `src/core/warehouse/BigQueryClient.ts`

**Changes**:

```typescript
// Before
export class BigQueryClient {
  async streamInsert(...) { ... }
}

// After
import { IDataWarehouse, WarehouseCapabilities } from './interfaces/IDataWarehouse';

export class BigQueryClient implements IDataWarehouse {
  getWarehouseType(): WarehouseType {
    return 'bigquery';
  }

  getCapabilities(): WarehouseCapabilities {
    return {
      supportsStreaming: true,
      supportsPartitioning: true,
      supportsJSON: true,
      supportsMaterializedViews: true,
      maxBatchSize: 10000,
    };
  }

  // Existing methods remain unchanged
  async streamInsert(...) { ... }
}
```

**Deliverables**:
- [ ] Update `BigQueryClient` class signature
- [ ] Add `getWarehouseType()` method
- [ ] Add `getCapabilities()` method
- [ ] Ensure backward compatibility

---

## Phase 2: Oracle Client Implementation

**Effort**: 16-20 hours
**Risk**: Medium

### 2.1 Create Oracle Finance Client Core

**File**: `src/core/warehouse/OracleFinanceClient.ts`

**Dependencies**:
```json
{
  "oracledb": "^6.3.0",
  "@oracle/oci-sdk": "^2.80.0"
}
```

**Key Features**:

1. **Connection Pool Management**
```typescript
private pool: oracledb.Pool | null = null;

async initialize(): Promise<void> {
  this.pool = await oracledb.createPool({
    user: process.env.ORACLE_USERNAME,
    password: await this.getPasswordFromVault(),
    connectionString: this.buildConnectionString(),
    poolMin: parseInt(process.env.ORACLE_CONNECTION_POOL_MIN || '2'),
    poolMax: parseInt(process.env.ORACLE_CONNECTION_POOL_MAX || '10'),
    poolIncrement: 2,
    poolTimeout: 60,
    queueTimeout: 60000,
  });
}
```

2. **Streaming Insert (Simulated)**
```typescript
async streamInsert(table: string, rows: any[]): Promise<InsertResult> {
  // Oracle doesn't have true streaming - use small batches
  const STREAM_BATCH_SIZE = 50;
  let totalInserted = 0;

  for (let i = 0; i < rows.length; i += STREAM_BATCH_SIZE) {
    const batch = rows.slice(i, i + STREAM_BATCH_SIZE);
    const result = await this.batchInsert(table, batch);
    totalInserted += result.insertedRows;
  }

  return { insertedRows: totalInserted, errors: [] };
}
```

3. **Batch Insert with Array Binding**
```typescript
async batchInsert(table: string, rows: any[], options?: BatchOptions): Promise<InsertResult> {
  const connection = await this.pool!.getConnection();

  try {
    // Map to Oracle schema
    const mapped = rows.map(row => this.schemaMapper.toOracleSchema(table, row));

    // Build parameterized INSERT
    const columns = Object.keys(mapped[0]);
    const sql = `
      INSERT INTO ${table} (${columns.join(', ')})
      VALUES (${columns.map((_, i) => `:${i + 1}`).join(', ')})
    `;

    // Array binding for performance
    const binds = mapped.map(row => columns.map(col => row[col]));

    const result = await connection.executeMany(sql, binds, {
      autoCommit: true,
      batchErrors: true, // Continue on errors
    });

    return {
      insertedRows: result.rowsAffected || 0,
      errors: this.parseOracleErrors(result.batchErrors),
    };
  } finally {
    await connection.close();
  }
}
```

4. **Query Execution with Type Safety**
```typescript
async query<T>(sql: string, params?: any[]): Promise<T[]> {
  const connection = await this.pool!.getConnection();

  try {
    // Convert BigQuery-style SQL to Oracle SQL
    const oracleSql = this.sqlTranslator.translateQuery(sql);

    const result = await connection.execute<T>(oracleSql, params || [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      fetchArraySize: 100,
    });

    return result.rows as T[];
  } finally {
    await connection.close();
  }
}
```

5. **File Loading via SQL*Loader**
```typescript
async loadFromFile(table: string, filePath: string, format: FileFormat): Promise<InsertResult> {
  if (format === 'CSV') {
    // Use External Table for CSV
    return this.loadFromCSVViaExternalTable(table, filePath);
  } else if (format === 'JSON') {
    // Parse JSON and batch insert
    const data = await fs.readFile(filePath, 'utf-8');
    const rows = JSON.parse(data);
    return this.batchInsert(table, rows);
  }

  throw new Error(`Unsupported format: ${format}`);
}
```

**Deliverables**:
- [ ] `OracleFinanceClient.ts` (~600-800 lines)
- [ ] Connection pool management
- [ ] Batch insert with retry logic
- [ ] Query execution with parameter binding
- [ ] File loading support
- [ ] Health check implementation
- [ ] Error handling and logging

---

### 2.2 Oracle Finance REST API Integration (Optional)

**File**: `src/core/warehouse/OracleFinanceAPIClient.ts`

**Purpose**: If using Oracle Financials Cloud REST API instead of direct database access.

**Key Methods**:

```typescript
export class OracleFinanceAPIClient {
  private baseURL: string;
  private accessToken: string | null = null;

  // OAuth 2.0 Authentication
  async authenticate(): Promise<void> {
    const response = await fetch(`${this.baseURL}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.ORACLE_CLIENT_ID!,
        client_secret: process.env.ORACLE_CLIENT_SECRET!,
      }),
    });

    const data = await response.json();
    this.accessToken = data.access_token;
  }

  // Post Journal Entry to General Ledger
  async postJournalEntry(entry: JournalEntry): Promise<string> {
    const response = await fetch(
      `${this.baseURL}/fscmRestApi/resources/11.13.18.05/journalEntries`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          LedgerName: entry.ledgerName,
          JournalName: entry.journalName,
          AccountingDate: entry.accountingDate,
          JournalLines: entry.lines.map(line => ({
            AccountCombination: line.accountCombination,
            DebitAmount: line.debit,
            CreditAmount: line.credit,
            Description: line.description,
          })),
        }),
      }
    );

    const result = await response.json();
    return result.JournalEntryId;
  }

  // Retrieve Chart of Accounts
  async getChartOfAccounts(): Promise<Account[]> {
    const response = await fetch(
      `${this.baseURL}/fscmRestApi/resources/11.13.18.05/chartOfAccounts`,
      {
        headers: { 'Authorization': `Bearer ${this.accessToken}` },
      }
    );

    return response.json();
  }
}
```

**Deliverables**:
- [ ] `OracleFinanceAPIClient.ts` (optional feature)
- [ ] OAuth 2.0 authentication
- [ ] Journal entry posting
- [ ] Chart of Accounts retrieval
- [ ] Subledger sync methods

---

## Phase 3: Schema & Data Mapping

**Effort**: 10-12 hours
**Risk**: Medium

### 3.1 Create Oracle Schema Mapper

**File**: `src/core/warehouse/OracleSchemaMapper.ts`

**Purpose**: Translate BigQuery data types and structures to Oracle equivalents.

**Data Type Mapping**:

```typescript
export class OracleSchemaMapper {
  private typeMap: Map<string, string> = new Map([
    ['STRING', 'VARCHAR2(4000)'],
    ['INT64', 'NUMBER(19,0)'],
    ['FLOAT64', 'NUMBER(38,9)'],
    ['NUMERIC', 'NUMBER(38,9)'],
    ['BOOLEAN', 'NUMBER(1)'], // 0 = false, 1 = true
    ['TIMESTAMP', 'TIMESTAMP WITH TIME ZONE'],
    ['DATE', 'DATE'],
    ['TIME', 'TIMESTAMP'], // Oracle has no TIME type
    ['DATETIME', 'TIMESTAMP'],
    ['BYTES', 'BLOB'],
    ['GEOGRAPHY', 'SDO_GEOMETRY'], // Oracle Spatial
    ['JSON', 'CLOB'], // JSON stored as CLOB with constraint
    ['ARRAY', 'CLOB'], // Store as JSON array
    ['STRUCT', 'CLOB'], // Store as JSON object
  ]);

  // Convert BigQuery row to Oracle row
  toOracleSchema(tableName: string, row: any): any {
    const mapped: any = {};

    for (const [key, value] of Object.entries(row)) {
      // Handle special cases
      if (typeof value === 'boolean') {
        mapped[key] = value ? 1 : 0;
      } else if (value instanceof Date) {
        mapped[key] = value; // oracledb handles Date objects
      } else if (typeof value === 'object' && value !== null) {
        // Nested objects/arrays → JSON string
        mapped[key] = JSON.stringify(value);
      } else {
        mapped[key] = value;
      }
    }

    return mapped;
  }

  // Convert Oracle row to standard format
  fromOracleSchema(tableName: string, row: any): any {
    const mapped: any = {};

    for (const [key, value] of Object.entries(row)) {
      // Reconstruct booleans
      if (this.isBooleanColumn(tableName, key)) {
        mapped[key] = value === 1;
      }
      // Parse JSON columns
      else if (this.isJSONColumn(tableName, key)) {
        try {
          mapped[key] = typeof value === 'string' ? JSON.parse(value) : value;
        } catch {
          mapped[key] = value;
        }
      } else {
        mapped[key] = value;
      }
    }

    return mapped;
  }
}
```

**Deliverables**:
- [ ] `OracleSchemaMapper.ts`
- [ ] Data type conversion logic
- [ ] JSON serialization/deserialization
- [ ] Boolean conversion (1/0)
- [ ] Date/timestamp formatting

---

### 3.2 Create SQL Translator

**File**: `src/core/warehouse/OracleSQLTranslator.ts`

**Purpose**: Convert BigQuery SQL syntax to Oracle SQL syntax.

**Translation Rules**:

```typescript
export class OracleSQLTranslator {
  translateQuery(bigQuerySQL: string): string {
    let oracleSQL = bigQuerySQL;

    // Date functions
    oracleSQL = oracleSQL.replace(/CURRENT_DATE\(\)/g, 'TRUNC(SYSDATE)');
    oracleSQL = oracleSQL.replace(/CURRENT_TIMESTAMP\(\)/g, 'SYSTIMESTAMP');
    oracleSQL = oracleSQL.replace(/DATE_SUB\(CURRENT_DATE\(\), INTERVAL (\d+) DAY\)/g, 'SYSDATE - $1');
    oracleSQL = oracleSQL.replace(/DATE_ADD\(CURRENT_DATE\(\), INTERVAL (\d+) DAY\)/g, 'SYSDATE + $1');

    // Conditional aggregates
    oracleSQL = oracleSQL.replace(/COUNTIF\(([^)]+)\)/g, 'COUNT(CASE WHEN $1 THEN 1 END)');
    oracleSQL = oracleSQL.replace(/SUMIF\(([^,]+),\s*([^)]+)\)/g, 'SUM(CASE WHEN $1 THEN $2 END)');

    // JSON functions
    oracleSQL = oracleSQL.replace(/JSON_EXTRACT\(([^,]+),\s*'([^']+)'\)/g, 'JSON_VALUE($1, \'$2\')');
    oracleSQL = oracleSQL.replace(/JSON_EXTRACT_SCALAR/g, 'JSON_VALUE');

    // LIMIT → FETCH FIRST
    oracleSQL = oracleSQL.replace(/LIMIT (\d+)/g, 'FETCH FIRST $1 ROWS ONLY');

    // OFFSET
    oracleSQL = oracleSQL.replace(/OFFSET (\d+)/g, 'OFFSET $1 ROWS');

    // Table decorators (BigQuery partitioning)
    oracleSQL = oracleSQL.replace(/`([^`]+)`/g, '$1'); // Remove backticks

    return oracleSQL;
  }
}
```

**Deliverables**:
- [ ] `OracleSQLTranslator.ts`
- [ ] Date function translation
- [ ] Conditional aggregate translation
- [ ] JSON function translation
- [ ] Pagination syntax translation

---

### 3.3 Create Oracle Table Definitions

**File**: `src/core/warehouse/schemas/oracleTables.ts`

**Purpose**: Define Oracle DDL for all fact and dimension tables.

**Example**:

```typescript
export const ORACLE_FACT_TABLES = {
  fact_banking_transactions: `
    CREATE TABLE fact_banking_transactions (
      transaction_id VARCHAR2(255) NOT NULL,
      job_id VARCHAR2(255) NOT NULL,
      network_id VARCHAR2(255) NOT NULL,
      transaction_date DATE NOT NULL,
      transaction_time TIMESTAMP,
      transaction_type VARCHAR2(100),
      amount NUMBER(18, 2),
      currency VARCHAR2(10),
      status VARCHAR2(50),
      source_account VARCHAR2(255),
      destination_account VARCHAR2(255),
      metadata CLOB CHECK (metadata IS JSON),
      created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
      CONSTRAINT pk_fact_banking_txn PRIMARY KEY (transaction_id, transaction_date)
    )
    PARTITION BY RANGE (transaction_date)
      INTERVAL(NUMTODSINTERVAL(1, 'DAY'))
      (PARTITION p_start VALUES LESS THAN (TO_DATE('2020-01-01', 'YYYY-MM-DD')))
  `,

  // Indexes
  idx_fact_txn_type_status: `
    CREATE INDEX idx_fact_txn_type_status
    ON fact_banking_transactions(transaction_type, status)
    LOCAL
  `,

  idx_fact_txn_network: `
    CREATE INDEX idx_fact_txn_network
    ON fact_banking_transactions(network_id, transaction_date)
    LOCAL
  `,
};
```

**Deliverables**:
- [ ] `oracleTables.ts` with all DDL statements
- [ ] Fact tables (4 tables)
- [ ] Dimension tables (4 tables)
- [ ] Indexes
- [ ] Partition definitions

---

## Phase 4: Integration & Testing

**Effort**: 12-16 hours
**Risk**: High

### 4.1 Update StorageManager

**File**: `src/core/pipeline/StorageManager.ts`

**Changes**:

```typescript
import { WarehouseFactory } from '@/core/warehouse/WarehouseFactory';

export class StorageManager {
  private warehouse: IDataWarehouse;

  constructor() {
    // Get warehouse from factory (environment-based)
    this.warehouse = WarehouseFactory.getWarehouse();
  }

  async load(data: any[], options?: LoadOptions): Promise<void> {
    const destination = options?.destination || 'warehouse';

    if (destination === 'warehouse') {
      await this.loadToWarehouse(options?.tableName || 'default', data, options);
    }
    // ... other destinations
  }

  private async loadToWarehouse(
    tableName: string,
    data: any[],
    options?: LoadOptions
  ): Promise<void> {
    // Warehouse-agnostic loading
    const warehouseType = this.warehouse.getWarehouseType();

    // Transform data based on warehouse type
    const transformed = this.transformForWarehouse(tableName, data, warehouseType);

    // Use batch insert (works for both BigQuery and Oracle)
    const result = await this.warehouse.batchInsert(tableName, transformed, {
      batchSize: options?.batchSize,
    });

    if (result.errors.length > 0) {
      throw new Error(`Failed to load ${result.errors.length} rows to ${warehouseType}`);
    }
  }

  private transformForWarehouse(
    tableName: string,
    data: any[],
    warehouseType: WarehouseType
  ): any[] {
    // Apply warehouse-specific transformations
    // For Oracle: handled by OracleSchemaMapper inside OracleFinanceClient
    // For BigQuery: already in correct format
    return data;
  }
}
```

**Deliverables**:
- [ ] Update `StorageManager.ts` to use `WarehouseFactory`
- [ ] Remove direct `BigQueryClient` instantiation
- [ ] Add warehouse-agnostic loading logic
- [ ] Maintain backward compatibility

---

### 4.2 Update Analytics API

**File**: `src/app/api/analytics/route.ts`

**Changes**:

```typescript
import { WarehouseFactory } from '@/core/warehouse/WarehouseFactory';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const warehouse = WarehouseFactory.getWarehouse();
    const warehouseType = warehouse.getWarehouseType();

    // Get analytics data (warehouse-agnostic)
    const jobStats = await getJobStats(warehouse);
    const extractionStats = await getExtractionStats(warehouse);
    const pipelineStats = await getPipelineStats(warehouse);

    const response: DashboardAnalyticsResponse = {
      jobs: jobStats,
      extraction: extractionStats,
      pipeline: pipelineStats,
      system: {
        status: 'healthy',
        warehouse: warehouseType,
        uptime: process.uptime(),
        version: '1.0.0',
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    // Fallback to mock data
    return NextResponse.json(getMockAnalytics());
  }
}

async function getJobStats(warehouse: IDataWarehouse): Promise<JobStats> {
  // Use BigQuery SQL (will be translated for Oracle)
  const sql = `
    SELECT
      COUNT(DISTINCT job_id) as total_jobs,
      COUNTIF(status = 'active') as active_jobs,
      COUNTIF(status = 'success') as completed_jobs,
      COUNTIF(status = 'failed') as failed_jobs
    FROM fact_job_executions
    WHERE execution_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
  `;

  const result = await warehouse.querySingle<JobStats>(sql);
  return result || { total_jobs: 0, active_jobs: 0, completed_jobs: 0, failed_jobs: 0 };
}
```

**Deliverables**:
- [ ] Update `analytics/route.ts` to use `WarehouseFactory`
- [ ] Ensure SQL queries work with both warehouses
- [ ] Add warehouse type to response
- [ ] Test with both BigQuery and Oracle

---

### 4.3 Update DimensionSync

**File**: `src/core/warehouse/DimensionSync.ts`

**Changes**:

```typescript
import { WarehouseFactory } from './WarehouseFactory';

export class DimensionSync {
  private warehouse: IDataWarehouse;

  constructor() {
    this.warehouse = WarehouseFactory.getWarehouse();
  }

  async upsertJob(job: RPAJob): Promise<void> {
    const warehouseType = this.warehouse.getWarehouseType();

    if (warehouseType === 'bigquery') {
      // BigQuery MERGE statement
      await this.upsertJobBigQuery(job);
    } else if (warehouseType === 'oracle-finance') {
      // Oracle MERGE statement (slightly different syntax)
      await this.upsertJobOracle(job);
    }
  }

  private async upsertJobOracle(job: RPAJob): Promise<void> {
    const sql = `
      MERGE INTO dim_jobs target
      USING (
        SELECT
          :job_id as job_id,
          :name as name,
          :description as description,
          :cron_expression as cron_expression,
          :network_id as network_id,
          :status as status,
          SYSTIMESTAMP as effective_from,
          TO_TIMESTAMP('9999-12-31', 'YYYY-MM-DD') as effective_to,
          1 as is_current
        FROM DUAL
      ) source
      ON (target.job_id = source.job_id AND target.is_current = 1)
      WHEN MATCHED THEN
        UPDATE SET
          target.is_current = 0,
          target.effective_to = SYSTIMESTAMP
      WHEN NOT MATCHED THEN
        INSERT (job_id, name, description, cron_expression, network_id, status,
                effective_from, effective_to, is_current)
        VALUES (source.job_id, source.name, source.description, source.cron_expression,
                source.network_id, source.status, source.effective_from, source.effective_to,
                source.is_current)
    `;

    await this.warehouse.query(sql, [
      job.id,
      job.name,
      job.description,
      job.schedule.cronExpression,
      job.dataSource.networkId,
      job.status,
    ]);
  }
}
```

**Deliverables**:
- [ ] Update `DimensionSync.ts` to use `WarehouseFactory`
- [ ] Add warehouse-specific MERGE logic
- [ ] Handle boolean conversion for Oracle (1/0)
- [ ] Test SCD Type 2 updates

---

### 4.4 Create Unit Tests

**Files**:
- `src/core/warehouse/__tests__/OracleFinanceClient.test.ts`
- `src/core/warehouse/__tests__/OracleSchemaMapper.test.ts`
- `src/core/warehouse/__tests__/OracleSQLTranslator.test.ts`
- `src/core/warehouse/__tests__/WarehouseFactory.test.ts`

**Test Coverage**:

```typescript
describe('OracleFinanceClient', () => {
  let client: OracleFinanceClient;

  beforeEach(() => {
    // Mock oracledb connection pool
    client = new OracleFinanceClient();
  });

  it('should initialize connection pool', async () => {
    await client.initialize();
    expect(client.healthCheck()).resolves.toBe({ healthy: true });
  });

  it('should batch insert with array binding', async () => {
    const rows = [
      { transaction_id: 'tx1', amount: 100.50 },
      { transaction_id: 'tx2', amount: 200.75 },
    ];

    const result = await client.batchInsert('fact_banking_transactions', rows);
    expect(result.insertedRows).toBe(2);
  });

  it('should translate BigQuery SQL to Oracle SQL', async () => {
    const sql = `SELECT COUNT(*) FROM table WHERE date >= CURRENT_DATE()`;
    const result = await client.query(sql);

    // Should automatically translate to Oracle syntax
    expect(result).toBeDefined();
  });
});

describe('OracleSchemaMapper', () => {
  let mapper: OracleSchemaMapper;

  beforeEach(() => {
    mapper = new OracleSchemaMapper();
  });

  it('should convert boolean to 1/0', () => {
    const row = { is_active: true, is_deleted: false };
    const mapped = mapper.toOracleSchema('dim_jobs', row);

    expect(mapped.is_active).toBe(1);
    expect(mapped.is_deleted).toBe(0);
  });

  it('should serialize JSON objects to CLOB', () => {
    const row = { metadata: { key: 'value' } };
    const mapped = mapper.toOracleSchema('fact_transactions', row);

    expect(typeof mapped.metadata).toBe('string');
    expect(JSON.parse(mapped.metadata)).toEqual({ key: 'value' });
  });
});
```

**Deliverables**:
- [ ] Unit tests for all new classes
- [ ] Mock Oracle database connections
- [ ] Test data type conversions
- [ ] Test SQL translation
- [ ] Achieve >80% code coverage

---

## Phase 5: Migration & Deployment

**Effort**: 8-10 hours
**Risk**: High

### 5.1 Create Oracle Database Setup Script

**File**: `server/database/oracle-setup.ts`

**Purpose**: Initialize Oracle schema with fact/dimension tables.

```typescript
import oracledb from 'oracledb';
import { ORACLE_FACT_TABLES, ORACLE_DIM_TABLES } from '@/core/warehouse/schemas/oracleTables';

async function setupOracleWarehouse() {
  const connection = await oracledb.getConnection({
    user: process.env.ORACLE_USERNAME,
    password: process.env.ORACLE_PASSWORD,
    connectionString: process.env.ORACLE_CONNECTION_STRING,
  });

  try {
    console.log('Creating fact tables...');
    for (const [name, ddl] of Object.entries(ORACLE_FACT_TABLES)) {
      console.log(`  Creating ${name}...`);
      await connection.execute(ddl);
    }

    console.log('Creating dimension tables...');
    for (const [name, ddl] of Object.entries(ORACLE_DIM_TABLES)) {
      console.log(`  Creating ${name}...`);
      await connection.execute(ddl);
    }

    console.log('Creating indexes...');
    // ... create indexes

    console.log('Creating materialized views...');
    // ... create MVs

    await connection.commit();
    console.log('Oracle warehouse setup complete!');
  } finally {
    await connection.close();
  }
}

setupOracleWarehouse().catch(console.error);
```

**Deliverables**:
- [ ] `oracle-setup.ts` script
- [ ] Table creation logic
- [ ] Index creation
- [ ] Materialized view creation
- [ ] Error handling and rollback

---

### 5.2 Create Migration Script (BigQuery → Oracle)

**File**: `server/database/migrate-bigquery-to-oracle.ts`

**Purpose**: Migrate historical data from BigQuery to Oracle.

```typescript
import { BigQueryClient } from '@/core/warehouse/BigQueryClient';
import { OracleFinanceClient } from '@/core/warehouse/OracleFinanceClient';

async function migrateData() {
  const bigquery = new BigQueryClient();
  const oracle = new OracleFinanceClient();

  await bigquery.initialize();
  await oracle.initialize();

  const tables = [
    'fact_banking_transactions',
    'fact_job_executions',
    'fact_audit_logs',
    'dim_banking_networks',
    'dim_jobs',
  ];

  for (const table of tables) {
    console.log(`Migrating ${table}...`);

    // Extract from BigQuery
    const data = await bigquery.query(`SELECT * FROM ${table}`);
    console.log(`  Extracted ${data.length} rows`);

    // Load to Oracle in batches
    const BATCH_SIZE = 1000;
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      await oracle.batchInsert(table, batch);
      console.log(`  Loaded batch ${i / BATCH_SIZE + 1}/${Math.ceil(data.length / BATCH_SIZE)}`);
    }

    console.log(`  ✓ ${table} migration complete`);
  }

  console.log('All data migrated successfully!');
}

migrateData().catch(console.error);
```

**Deliverables**:
- [ ] `migrate-bigquery-to-oracle.ts` script
- [ ] Batch extraction from BigQuery
- [ ] Batch loading to Oracle
- [ ] Progress tracking
- [ ] Data validation

---

### 5.3 Update Environment Configuration

**File**: `.env.example`

**Add Oracle Variables**:

```bash
# =============================================================================
# DATA WAREHOUSE CONFIGURATION
# =============================================================================

# Warehouse Type: 'bigquery' or 'oracle-finance'
WAREHOUSE_TYPE=bigquery

# -----------------------------------------------------------------------------
# Google BigQuery (if WAREHOUSE_TYPE=bigquery)
# -----------------------------------------------------------------------------
GCP_PROJECT_ID=your-gcp-project-id
GCP_KEY_FILE=./credentials/gcp-service-account.json
BQ_DATASET=rpa_warehouse
BQ_LOCATION=US
BQ_BATCH_SIZE=500
BQ_BATCH_INTERVAL_MS=5000
BQ_MAX_RETRIES=3

# -----------------------------------------------------------------------------
# Oracle Finance (if WAREHOUSE_TYPE=oracle-finance)
# -----------------------------------------------------------------------------
ORACLE_HOST=your-oracle-host.oraclecloud.com
ORACLE_PORT=1521
ORACLE_SERVICE_NAME=your_service_name
ORACLE_USERNAME=rpa_warehouse_user
ORACLE_PASSWORD=secure_password_or_use_vault
ORACLE_WALLET_PATH=./credentials/oracle-wallet
ORACLE_CONNECTION_POOL_MIN=2
ORACLE_CONNECTION_POOL_MAX=10
ORACLE_BATCH_SIZE=1000
ORACLE_BATCH_INTERVAL_MS=10000
ORACLE_MAX_RETRIES=3

# Oracle Financials Cloud REST API (optional)
ORACLE_ERP_BASE_URL=https://your-instance.oraclecloud.com
ORACLE_ERP_API_VERSION=v2
ORACLE_CLIENT_ID=your_client_id
ORACLE_CLIENT_SECRET=your_client_secret
ORACLE_LEDGER_ID=300000001234567
ORACLE_BUSINESS_UNIT=US_PRIMARY
```

**Deliverables**:
- [ ] Update `.env.example` with Oracle variables
- [ ] Document configuration options
- [ ] Add `WAREHOUSE_TYPE` selection
- [ ] Create `.env.oracle` template

---

## Configuration Guide

### Switching Between Warehouses

**Option 1: Environment Variable**
```bash
# Use BigQuery (default)
WAREHOUSE_TYPE=bigquery npm run dev

# Use Oracle Finance
WAREHOUSE_TYPE=oracle-finance npm run dev
```

**Option 2: Programmatic Switch**
```typescript
// In API route or worker
import { WarehouseFactory } from '@/core/warehouse/WarehouseFactory';

// Force BigQuery
process.env.WAREHOUSE_TYPE = 'bigquery';
WarehouseFactory.resetInstance();
const warehouse = WarehouseFactory.getWarehouse();

// Force Oracle
process.env.WAREHOUSE_TYPE = 'oracle-finance';
WarehouseFactory.resetInstance();
const warehouse = WarehouseFactory.getWarehouse();
```

**Option 3: Dual Warehouse (A/B Testing)**
```typescript
// Write to both warehouses simultaneously
const bigquery = new BigQueryClient();
const oracle = new OracleFinanceClient();

await Promise.all([
  bigquery.batchInsert(table, data),
  oracle.batchInsert(table, data),
]);
```

---

## Testing Strategy

### Unit Tests
- [ ] `OracleFinanceClient` methods
- [ ] `OracleSchemaMapper` conversions
- [ ] `OracleSQLTranslator` query translation
- [ ] `WarehouseFactory` selection logic

### Integration Tests
- [ ] Connect to Oracle test database
- [ ] Insert/query operations
- [ ] Schema synchronization
- [ ] ETL pipeline end-to-end

### Performance Tests
- [ ] Batch insert benchmarks (1K, 10K, 100K rows)
- [ ] Query execution time comparison
- [ ] Connection pool stress test
- [ ] Concurrent worker load test

### Compatibility Tests
- [ ] Analytics API with both warehouses
- [ ] DimensionSync with both warehouses
- [ ] StorageManager routing
- [ ] WebSocket event emission

---

## Rollback Plan

### If Oracle Integration Fails

1. **Immediate Rollback**:
   ```bash
   export WAREHOUSE_TYPE=bigquery
   # Restart services
   npm run dev
   ```

2. **Code Rollback**:
   - Revert `StorageManager.ts` to use `BigQueryClient` directly
   - Remove `WarehouseFactory` from imports
   - Keep Oracle code isolated (no breaking changes)

3. **Data Rollback**:
   - Oracle data is separate (no BigQuery data affected)
   - Continue using BigQuery as primary warehouse

4. **Zero Downtime**:
   - Changes are backward compatible
   - BigQuery code remains functional
   - Oracle is additive, not replacement

---

## Success Criteria

### Phase 1 ✓
- [ ] `IDataWarehouse` interface defined
- [ ] `WarehouseFactory` implemented
- [ ] `BigQueryClient` refactored to implement interface
- [ ] All tests pass

### Phase 2 ✓
- [ ] `OracleFinanceClient` fully implemented
- [ ] Connection pool working
- [ ] Batch insert performance >1000 rows/sec
- [ ] Query execution functional

### Phase 3 ✓
- [ ] Schema mapper handles all data types
- [ ] SQL translator passes 50+ test cases
- [ ] Oracle DDL scripts complete

### Phase 4 ✓
- [ ] `StorageManager` uses `WarehouseFactory`
- [ ] Analytics API works with both warehouses
- [ ] DimensionSync supports both warehouses
- [ ] Unit tests >80% coverage

### Phase 5 ✓
- [ ] Oracle setup script runs successfully
- [ ] Migration script tested with sample data
- [ ] Documentation complete
- [ ] Production deployment successful

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Foundation | 6-8 hours | None |
| Phase 2: Oracle Client | 16-20 hours | Phase 1 complete |
| Phase 3: Schema Mapping | 10-12 hours | Phase 2 complete |
| Phase 4: Integration | 12-16 hours | Phase 1-3 complete |
| Phase 5: Migration | 8-10 hours | Phase 4 complete |
| **Total** | **40-60 hours** | - |

---

## Next Steps

1. **Review and Approve Plan** - Stakeholder sign-off
2. **Set Up Oracle Test Environment** - Provision Oracle Cloud instance
3. **Create Development Branch** - `feature/oracle-finance-connector`
4. **Begin Phase 1** - Foundation & abstraction layer
5. **Iterative Development** - Complete phases sequentially
6. **QA & Testing** - Comprehensive testing before production
7. **Production Deployment** - Gradual rollout with monitoring

---

## Questions & Clarifications

1. **Oracle Finance Version**: Which version? (Cloud, EBS, Fusion?)
2. **Authentication Method**: Database connection or REST API?
3. **Migration Scope**: Full historical data or recent only?
4. **Dual Support Duration**: How long to maintain both warehouses?
5. **Performance Requirements**: Expected throughput/latency SLAs?

---

**Document Version**: 1.0
**Last Updated**: 2026-01-07
**Owner**: RPA Engineering Team
**Status**: Draft - Pending Approval
