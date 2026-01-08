/**
 * Oracle Database Table Definitions (MOCKUP)
 *
 * DDL statements for creating fact and dimension tables in Oracle Finance.
 * Includes partitioning, indexes, and materialized views.
 *
 * IMPORTANT: This is a mockup for planning purposes.
 * To use in production:
 * 1. Review and adjust data types based on your requirements
 * 2. Update partition definitions for your date ranges
 * 3. Test DDL in Oracle development environment
 * 4. Execute via server/database/oracle-setup.ts script
 */

// ============================================================================
// FACT TABLES
// ============================================================================

export const ORACLE_FACT_TABLES: Record<string, string> = {
  // --------------------------------------------------------------------------
  // Fact: Banking Transactions
  // --------------------------------------------------------------------------
  fact_banking_transactions: `
CREATE TABLE fact_banking_transactions (
  transaction_id VARCHAR2(255) NOT NULL,
  account_number VARCHAR2(255),
  amount NUMBER(18, 2) NOT NULL,
  currency VARCHAR2(10) NOT NULL,
  transaction_type VARCHAR2(100),
  status VARCHAR2(50) NOT NULL,
  transaction_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  job_id VARCHAR2(255),
  source_bank_id VARCHAR2(255),
  destination_bank_id VARCHAR2(255),
  clearinghouse_id VARCHAR2(255),
  clearinghouse_reference VARCHAR2(255),
  metadata CLOB CHECK (metadata IS JSON),
  extraction_job_id VARCHAR2(255),
  etl_job_id VARCHAR2(255),
  validation_status VARCHAR2(50),
  data_quality_score NUMBER(5, 2),
  CONSTRAINT pk_fact_banking_txn PRIMARY KEY (transaction_id, transaction_date)
)
PARTITION BY RANGE (transaction_date)
  INTERVAL(NUMTODSINTERVAL(1, 'DAY'))
  (PARTITION p_start VALUES LESS THAN (TO_DATE('2020-01-01', 'YYYY-MM-DD')))
`,

  // --------------------------------------------------------------------------
  // Fact: Job Executions
  // --------------------------------------------------------------------------
  fact_job_executions: `
CREATE TABLE fact_job_executions (
  execution_id VARCHAR2(255) NOT NULL,
  job_id VARCHAR2(255) NOT NULL,
  banking_network_id VARCHAR2(255),
  status VARCHAR2(50) NOT NULL,
  extraction_method VARCHAR2(100) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  execution_date DATE NOT NULL,
  duration_ms NUMBER(19, 0),
  records_extracted NUMBER(19, 0),
  records_processed NUMBER(19, 0),
  error_count NUMBER(10, 0) DEFAULT 0,
  data_size_bytes NUMBER(19, 0),
  error_message VARCHAR2(4000),
  error_code VARCHAR2(100),
  retry_attempt NUMBER(3, 0) DEFAULT 0,
  extraction_duration_ms NUMBER(19, 0),
  validation_duration_ms NUMBER(19, 0),
  transformation_duration_ms NUMBER(19, 0),
  load_duration_ms NUMBER(19, 0),
  CONSTRAINT pk_fact_job_exec PRIMARY KEY (execution_id, execution_date)
)
PARTITION BY RANGE (execution_date)
  INTERVAL(NUMTODSINTERVAL(1, 'DAY'))
  (PARTITION p_start VALUES LESS THAN (TO_DATE('2020-01-01', 'YYYY-MM-DD')))
`,

  // --------------------------------------------------------------------------
  // Fact: Audit Logs
  // --------------------------------------------------------------------------
  fact_audit_logs: `
CREATE TABLE fact_audit_logs (
  audit_id VARCHAR2(255) NOT NULL,
  user_id VARCHAR2(255) NOT NULL,
  action VARCHAR2(100) NOT NULL,
  resource VARCHAR2(255) NOT NULL,
  resource_id VARCHAR2(255),
  result VARCHAR2(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  log_date DATE NOT NULL,
  ip_address VARCHAR2(45),
  user_agent VARCHAR2(500),
  changes CLOB CHECK (changes IS JSON),
  error_message VARCHAR2(4000),
  session_id VARCHAR2(255),
  compliance_mode VARCHAR2(50),
  CONSTRAINT pk_fact_audit_logs PRIMARY KEY (audit_id, log_date)
)
PARTITION BY RANGE (log_date)
  INTERVAL(NUMTODSINTERVAL(1, 'DAY'))
  (PARTITION p_start VALUES LESS THAN (TO_DATE('2020-01-01', 'YYYY-MM-DD')))
`,

  // --------------------------------------------------------------------------
  // Fact: ETL Pipeline Jobs
  // --------------------------------------------------------------------------
  fact_etl_pipeline_jobs: `
CREATE TABLE fact_etl_pipeline_jobs (
  etl_job_id VARCHAR2(255) NOT NULL,
  extraction_job_id VARCHAR2(255) NOT NULL,
  stage VARCHAR2(50) NOT NULL,
  status VARCHAR2(50) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  execution_date DATE NOT NULL,
  duration_ms NUMBER(19, 0),
  records_processed NUMBER(19, 0),
  error_count NUMBER(10, 0) DEFAULT 0,
  warning_count NUMBER(10, 0) DEFAULT 0,
  validation_errors CLOB CHECK (validation_errors IS JSON),
  transformation_rules_applied CLOB CHECK (transformation_rules_applied IS JSON),
  CONSTRAINT pk_fact_etl_jobs PRIMARY KEY (etl_job_id, execution_date)
)
PARTITION BY RANGE (execution_date)
  INTERVAL(NUMTODSINTERVAL(1, 'DAY'))
  (PARTITION p_start VALUES LESS THAN (TO_DATE('2020-01-01', 'YYYY-MM-DD')))
`,
};

// ============================================================================
// DIMENSION TABLES
// ============================================================================

export const ORACLE_DIM_TABLES: Record<string, string> = {
  // --------------------------------------------------------------------------
  // Dimension: Banking Networks
  // --------------------------------------------------------------------------
  dim_banking_networks: `
CREATE TABLE dim_banking_networks (
  network_id VARCHAR2(255) NOT NULL PRIMARY KEY,
  network_name VARCHAR2(255) NOT NULL,
  network_type VARCHAR2(100) NOT NULL,
  description VARCHAR2(1000),
  website_url VARCHAR2(500),
  documentation_url VARCHAR2(500),
  support_contact VARCHAR2(255),
  capabilities CLOB CHECK (capabilities IS JSON),
  protocols CLOB CHECK (protocols IS JSON),
  is_active NUMBER(1) DEFAULT 1 NOT NULL,
  supports_realtime NUMBER(1) DEFAULT 0,
  requires_mfa NUMBER(1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
)
`,

  // --------------------------------------------------------------------------
  // Dimension: Jobs (SCD Type 2)
  // --------------------------------------------------------------------------
  dim_jobs: `
CREATE TABLE dim_jobs (
  surrogate_key NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id VARCHAR2(255) NOT NULL,
  name VARCHAR2(255) NOT NULL,
  description VARCHAR2(1000),
  cron_expression VARCHAR2(100),
  network_id VARCHAR2(255),
  status VARCHAR2(50),
  configuration CLOB CHECK (configuration IS JSON),
  authentication_config CLOB CHECK (authentication_config IS JSON),
  is_active NUMBER(1) DEFAULT 1,
  is_current NUMBER(1) DEFAULT 1 NOT NULL,
  effective_from TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  effective_to TIMESTAMP WITH TIME ZONE DEFAULT TO_TIMESTAMP('9999-12-31', 'YYYY-MM-DD') NOT NULL,
  created_by VARCHAR2(255),
  updated_by VARCHAR2(255)
)
`,

  // --------------------------------------------------------------------------
  // Dimension: Users
  // --------------------------------------------------------------------------
  dim_users: `
CREATE TABLE dim_users (
  user_id VARCHAR2(255) NOT NULL PRIMARY KEY,
  username VARCHAR2(255) NOT NULL UNIQUE,
  email VARCHAR2(255) NOT NULL,
  full_name VARCHAR2(255),
  role VARCHAR2(100) NOT NULL,
  department VARCHAR2(255),
  is_active NUMBER(1) DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE
)
`,

  // --------------------------------------------------------------------------
  // Dimension: Date (Pre-populated calendar)
  // --------------------------------------------------------------------------
  dim_date: `
CREATE TABLE dim_date (
  date_key DATE NOT NULL PRIMARY KEY,
  year NUMBER(4) NOT NULL,
  quarter NUMBER(1) NOT NULL,
  month NUMBER(2) NOT NULL,
  week NUMBER(2) NOT NULL,
  day NUMBER(2) NOT NULL,
  day_of_week NUMBER(1) NOT NULL,
  day_name VARCHAR2(20) NOT NULL,
  month_name VARCHAR2(20) NOT NULL,
  is_weekend NUMBER(1) DEFAULT 0 NOT NULL,
  is_holiday NUMBER(1) DEFAULT 0 NOT NULL,
  fiscal_year NUMBER(4),
  fiscal_quarter NUMBER(1),
  iso_week NUMBER(2)
)
`,
};

// ============================================================================
// INDEXES
// ============================================================================

export const ORACLE_INDEXES: Record<string, string> = {
  // Fact: Banking Transactions
  idx_fact_txn_type_status: `
CREATE INDEX idx_fact_txn_type_status
ON fact_banking_transactions(transaction_type, status)
LOCAL
`,

  idx_fact_txn_network: `
CREATE INDEX idx_fact_txn_network
ON fact_banking_transactions(clearinghouse_id, transaction_date)
LOCAL
`,

  idx_fact_txn_job: `
CREATE INDEX idx_fact_txn_job
ON fact_banking_transactions(job_id)
LOCAL
`,

  idx_fact_txn_account: `
CREATE INDEX idx_fact_txn_account
ON fact_banking_transactions(account_number, transaction_date)
LOCAL
`,

  // Fact: Job Executions
  idx_fact_job_exec_job_id: `
CREATE INDEX idx_fact_job_exec_job_id
ON fact_job_executions(job_id, execution_date)
LOCAL
`,

  idx_fact_job_exec_status: `
CREATE INDEX idx_fact_job_exec_status
ON fact_job_executions(status, execution_date)
LOCAL
`,

  idx_fact_job_exec_network: `
CREATE INDEX idx_fact_job_exec_network
ON fact_job_executions(banking_network_id, execution_date)
LOCAL
`,

  // Fact: Audit Logs
  idx_fact_audit_user: `
CREATE INDEX idx_fact_audit_user
ON fact_audit_logs(user_id, log_date)
LOCAL
`,

  idx_fact_audit_action: `
CREATE INDEX idx_fact_audit_action
ON fact_audit_logs(action, resource, log_date)
LOCAL
`,

  // Fact: ETL Pipeline Jobs
  idx_fact_etl_extraction: `
CREATE INDEX idx_fact_etl_extraction
ON fact_etl_pipeline_jobs(extraction_job_id, execution_date)
LOCAL
`,

  idx_fact_etl_status: `
CREATE INDEX idx_fact_etl_status
ON fact_etl_pipeline_jobs(status, execution_date)
LOCAL
`,

  // Dimension: Jobs (SCD Type 2)
  idx_dim_jobs_job_id_current: `
CREATE INDEX idx_dim_jobs_job_id_current
ON dim_jobs(job_id, is_current)
`,

  idx_dim_jobs_network: `
CREATE INDEX idx_dim_jobs_network
ON dim_jobs(network_id)
`,
};

// ============================================================================
// MATERIALIZED VIEWS
// ============================================================================

export const ORACLE_MATERIALIZED_VIEWS: Record<string, string> = {
  // --------------------------------------------------------------------------
  // MV: Daily Transaction Summary
  // --------------------------------------------------------------------------
  mv_daily_transaction_summary: `
CREATE MATERIALIZED VIEW mv_daily_transaction_summary
BUILD IMMEDIATE
REFRESH FAST ON COMMIT
AS
SELECT
  transaction_date,
  clearinghouse_id,
  transaction_type,
  currency,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount,
  MIN(amount) as min_amount,
  MAX(amount) as max_amount,
  COUNT(DISTINCT account_number) as unique_accounts
FROM fact_banking_transactions
GROUP BY transaction_date, clearinghouse_id, transaction_type, currency
`,

  // Materialized view log for fast refresh
  mvlog_fact_banking_txn: `
CREATE MATERIALIZED VIEW LOG ON fact_banking_transactions
WITH ROWID, SEQUENCE(transaction_date, clearinghouse_id, transaction_type, currency, amount, account_number)
INCLUDING NEW VALUES
`,

  // --------------------------------------------------------------------------
  // MV: Job Performance Metrics
  // --------------------------------------------------------------------------
  mv_job_performance_metrics: `
CREATE MATERIALIZED VIEW mv_job_performance_metrics
BUILD IMMEDIATE
REFRESH COMPLETE ON DEMAND
AS
SELECT
  job_id,
  banking_network_id,
  status,
  COUNT(*) as execution_count,
  AVG(duration_ms) as avg_duration_ms,
  AVG(records_extracted) as avg_records_extracted,
  SUM(error_count) as total_errors,
  MAX(completed_at) as last_execution
FROM fact_job_executions
WHERE execution_date >= SYSDATE - 30
GROUP BY job_id, banking_network_id, status
`,

  // --------------------------------------------------------------------------
  // MV: Hourly Network Performance
  // --------------------------------------------------------------------------
  mv_hourly_network_performance: `
CREATE MATERIALIZED VIEW mv_hourly_network_performance
BUILD IMMEDIATE
REFRESH COMPLETE ON DEMAND
AS
SELECT
  TRUNC(transaction_timestamp, 'HH') as hour,
  clearinghouse_id,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
FROM fact_banking_transactions
WHERE transaction_date >= SYSDATE - 7
GROUP BY TRUNC(transaction_timestamp, 'HH'), clearinghouse_id
`,
};

// ============================================================================
// CONSTRAINTS AND FOREIGN KEYS (Optional)
// ============================================================================

export const ORACLE_CONSTRAINTS: Record<string, string> = {
  // Foreign key: fact_banking_transactions → dim_banking_networks
  fk_fact_txn_network: `
ALTER TABLE fact_banking_transactions
ADD CONSTRAINT fk_fact_txn_network
FOREIGN KEY (clearinghouse_id)
REFERENCES dim_banking_networks(network_id)
`,

  // Foreign key: fact_job_executions → dim_jobs
  fk_fact_job_exec_job: `
ALTER TABLE fact_job_executions
ADD CONSTRAINT fk_fact_job_exec_job
FOREIGN KEY (job_id)
REFERENCES dim_jobs(job_id)
`,

  // Foreign key: fact_audit_logs → dim_users
  fk_fact_audit_user: `
ALTER TABLE fact_audit_logs
ADD CONSTRAINT fk_fact_audit_user
FOREIGN KEY (user_id)
REFERENCES dim_users(user_id)
`,
};

// ============================================================================
// SEQUENCES (for surrogate keys)
// ============================================================================

export const ORACLE_SEQUENCES: Record<string, string> = {
  // Sequence for dim_jobs surrogate key (auto-generated by IDENTITY column)
  // No manual sequence needed - Oracle 12c+ handles this automatically
};

// ============================================================================
// PARTITION MANAGEMENT (Automated purge job)
// ============================================================================

export const ORACLE_PARTITION_PURGE_JOB = `
BEGIN
  DBMS_SCHEDULER.CREATE_JOB (
    job_name        => 'PURGE_OLD_PARTITIONS',
    job_type        => 'PLSQL_BLOCK',
    job_action      => '
      BEGIN
        -- Drop partitions older than 90 days for fact_banking_transactions
        FOR rec IN (
          SELECT partition_name
          FROM user_tab_partitions
          WHERE table_name = ''FACT_BANKING_TRANSACTIONS''
            AND partition_name LIKE ''SYS_P%''
            AND TO_DATE(SUBSTR(partition_name, 6), ''YYYY-MM-DD'') < SYSDATE - 90
        ) LOOP
          EXECUTE IMMEDIATE ''ALTER TABLE fact_banking_transactions DROP PARTITION '' || rec.partition_name;
        END LOOP;

        -- Repeat for other fact tables...
      END;
    ',
    start_date      => SYSTIMESTAMP,
    repeat_interval => 'FREQ=DAILY; BYHOUR=2; BYMINUTE=0; BYSECOND=0',
    enabled         => TRUE,
    comments        => 'Purge partitions older than 90 days for fact tables'
  );
END;
`;

// ============================================================================
// Export All DDL
// ============================================================================

export const ALL_ORACLE_DDL = {
  factTables: ORACLE_FACT_TABLES,
  dimTables: ORACLE_DIM_TABLES,
  indexes: ORACLE_INDEXES,
  materializedViews: ORACLE_MATERIALIZED_VIEWS,
  constraints: ORACLE_CONSTRAINTS,
  sequences: ORACLE_SEQUENCES,
  partitionPurgeJob: ORACLE_PARTITION_PURGE_JOB,
};
