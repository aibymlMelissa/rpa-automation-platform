# Oracle Finance Migration Guide

## Overview

This guide provides step-by-step instructions for migrating from Google BigQuery to Oracle Finance as the data warehouse for the RPA Automation Platform.

**Estimated Time**: 4-8 hours (depending on data volume)
**Risk Level**: Medium (requires careful planning and testing)
**Downtime Required**: None (supports parallel operation)

---

## Table of Contents

1. [Pre-Migration Checklist](#pre-migration-checklist)
2. [Phase 1: Environment Setup](#phase-1-environment-setup)
3. [Phase 2: Schema Deployment](#phase-2-schema-deployment)
4. [Phase 3: Code Integration](#phase-3-code-integration)
5. [Phase 4: Data Migration](#phase-4-data-migration)
6. [Phase 5: Testing & Validation](#phase-5-testing--validation)
7. [Phase 6: Cutover](#phase-6-cutover)
8. [Rollback Procedure](#rollback-procedure)
9. [Post-Migration Tasks](#post-migration-tasks)
10. [Troubleshooting](#troubleshooting)

---

## Pre-Migration Checklist

### Infrastructure Requirements

- [ ] Oracle Cloud account with Autonomous Database or OCI Database provisioned
- [ ] Oracle database user created with appropriate privileges
- [ ] Oracle Wallet downloaded for secure connections
- [ ] Network connectivity verified (firewall rules, VPN, etc.)
- [ ] Sufficient storage allocated (estimate: 2-3x current BigQuery data size)

### Access Requirements

- [ ] Oracle database admin credentials
- [ ] Oracle Cloud Console access
- [ ] BigQuery read access (for data export)
- [ ] Application deployment credentials

### Software Requirements

- [ ] Node.js >= 18.0.0
- [ ] npm >= 9.0.0
- [ ] Oracle Instant Client (if running locally)
- [ ] `oracledb` npm package (v6.3.0+)
- [ ] Access to codebase repository

### Backup Requirements

- [ ] Full BigQuery dataset export (JSON/CSV/Parquet)
- [ ] Application database backup
- [ ] Configuration files backup
- [ ] Current .env file backup

---

## Phase 1: Environment Setup

### Step 1.1: Provision Oracle Database

1. **Log into Oracle Cloud Console**
   - Navigate to: https://cloud.oracle.com/

2. **Create Autonomous Database (Recommended)**
   ```
   - Database Type: Data Warehouse
   - Workload Type: Transaction Processing
   - Database Version: 19c or 21c
   - OCPU Count: 4-8 (adjust based on workload)
   - Storage: 1TB (adjust based on data volume)
   - Auto Scaling: Enabled
   ```

3. **Download Oracle Wallet**
   - Go to Database Details → DB Connection
   - Click "Download Wallet"
   - Save to: `./credentials/oracle-wallet/`
   - Extract wallet files

### Step 1.2: Create Database User

Connect to Oracle as admin and run:

```sql
-- Create user
CREATE USER rpa_warehouse_user IDENTIFIED BY "SecurePassword123!";

-- Grant privileges
GRANT CONNECT, RESOURCE, CREATE TABLE, CREATE VIEW, CREATE MATERIALIZED VIEW TO rpa_warehouse_user;
GRANT UNLIMITED TABLESPACE TO rpa_warehouse_user;

-- Grant scheduler privileges (for partition purge job)
GRANT CREATE JOB TO rpa_warehouse_user;
GRANT EXECUTE ON DBMS_SCHEDULER TO rpa_warehouse_user;

-- Verify grants
SELECT * FROM dba_sys_privs WHERE grantee = 'RPA_WAREHOUSE_USER';
```

### Step 1.3: Configure Network Access

1. **Update Oracle Cloud Security List**
   - Allow inbound traffic on port 1521 from your application servers
   - Whitelist IP addresses

2. **Test Connection**
   ```bash
   # Using SQL*Plus
   sqlplus rpa_warehouse_user/SecurePassword123!@oracle-host:1521/service_name

   # Using Node.js
   npx tsx server/database/test-oracle-connection.ts
   ```

### Step 1.4: Install Dependencies

```bash
# Install Oracle dependencies
npm install oracledb @oracle/oci-sdk

# Install Oracle Instant Client (if not already installed)
# macOS:
brew install instantclient-basic

# Linux:
sudo yum install oracle-instantclient-basic

# Windows:
# Download from: https://www.oracle.com/database/technologies/instant-client/downloads.html
```

### Step 1.5: Configure Environment Variables

Copy `.env.oracle.example` to `.env` and update:

```bash
cp .env.oracle.example .env

# Edit .env
WAREHOUSE_TYPE=oracle-finance
ORACLE_HOST=your-oracle-host.oraclecloud.com
ORACLE_PORT=1521
ORACLE_SERVICE_NAME=your_service_name
ORACLE_USERNAME=rpa_warehouse_user
ORACLE_PASSWORD=SecurePassword123!
ORACLE_WALLET_PATH=./credentials/oracle-wallet
```

---

## Phase 2: Schema Deployment

### Step 2.1: Review Schema Definitions

Review Oracle DDL in:
```
src/core/warehouse/schemas/oracleTables.mockup.ts
```

Customize as needed:
- Partition ranges
- Index definitions
- Materialized view refresh strategies
- Retention policies

### Step 2.2: Run Setup Script

```bash
# Dry run (preview DDL)
npx tsx server/database/oracle-setup.ts --dry-run

# Execute setup
npx tsx server/database/oracle-setup.ts

# Expected output:
# [1/7] Creating Fact Tables... ✓
# [2/7] Creating Dimension Tables... ✓
# [3/7] Creating Indexes... ✓
# [4/7] Creating Materialized Views... ✓
# [5/7] Creating Foreign Key Constraints... ✓
# [6/7] Creating Partition Purge Job... ✓
# [7/7] Populating Date Dimension... ✓
# ✓ Oracle Finance Data Warehouse Setup Complete!
```

### Step 2.3: Verify Schema Creation

```sql
-- Check tables
SELECT table_name FROM user_tables ORDER BY table_name;

-- Check partitions
SELECT table_name, partition_name, high_value
FROM user_tab_partitions
WHERE table_name LIKE 'FACT_%'
ORDER BY table_name, partition_position;

-- Check indexes
SELECT index_name, table_name, uniqueness
FROM user_indexes
ORDER BY table_name, index_name;

-- Check materialized views
SELECT mview_name, refresh_mode, refresh_method
FROM user_mviews;

-- Check scheduled jobs
SELECT job_name, enabled, state, last_start_date, next_run_date
FROM user_scheduler_jobs;
```

### Step 2.4: Populate Dimension Tables

```bash
# Sync banking networks
npx tsx server/database/sync-dimensions.ts --table=dim_banking_networks

# Sync users
npx tsx server/database/sync-dimensions.ts --table=dim_users

# Sync jobs (with SCD Type 2 history)
npx tsx server/database/sync-dimensions.ts --table=dim_jobs
```

---

## Phase 3: Code Integration

### Step 3.1: Update Imports

No changes required if using the warehouse factory pattern. The code automatically selects the warehouse based on `WAREHOUSE_TYPE` environment variable.

Verify factory is being used in:
- `src/core/pipeline/StorageManager.ts`
- `src/app/api/analytics/route.ts`
- `src/core/warehouse/DimensionSync.ts`

### Step 3.2: Deploy Code Changes

```bash
# Pull latest code with Oracle support
git pull origin feature/oracle-finance-connector

# Build application
npm run build

# Run type checks
npm run type-check

# Run linter
npm run lint
```

### Step 3.3: Update Production Environment

```bash
# Set warehouse type
export WAREHOUSE_TYPE=oracle-finance

# Restart services
pm2 restart all

# Or using Docker
docker-compose up -d --build
```

---

## Phase 4: Data Migration

### Strategy: Parallel Write (Recommended)

Write to both BigQuery and Oracle simultaneously for a transition period, then cutover to Oracle.

#### Step 4.1: Enable Dual Write Mode

```typescript
// In StorageManager.ts or create a migration script
const bigquery = new BigQueryClient();
const oracle = new OracleFinanceClient();

await bigquery.initialize();
await oracle.initialize();

// Write to both
await Promise.all([
  bigquery.batchInsert(table, data),
  oracle.batchInsert(table, data)
]);
```

#### Step 4.2: Migrate Historical Data

```bash
# Export from BigQuery
npx tsx server/database/export-bigquery-data.ts --output=./migration-data

# Import to Oracle
npx tsx server/database/migrate-bigquery-to-oracle.ts --source=./migration-data

# Expected output:
# [1/8] Migrating fact_banking_transactions...
#   Extracted 1,234,567 rows
#   Loaded batch 1/1235 (1000 rows)
#   Loaded batch 2/1235 (1000 rows)
#   ...
#   ✓ fact_banking_transactions migration complete (1,234,567 rows, 15m 32s)
# [2/8] Migrating fact_job_executions...
#   ...
# ✓ All data migrated successfully! (Total: 5,432,100 rows, 1h 23m)
```

#### Migration Script Example

```typescript
// server/database/migrate-bigquery-to-oracle.ts
import { BigQueryClient } from '@/core/warehouse/BigQueryClient';
import { OracleFinanceClient } from '@/core/warehouse/OracleFinanceClient';

async function migrateTable(
  tableName: string,
  bigquery: BigQueryClient,
  oracle: OracleFinanceClient
) {
  console.log(`Migrating ${tableName}...`);

  // Extract from BigQuery
  const data = await bigquery.query(`SELECT * FROM ${tableName}`);
  console.log(`  Extracted ${data.length} rows`);

  // Load to Oracle in batches
  const BATCH_SIZE = 1000;
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    await oracle.batchInsert(tableName, batch);
    console.log(`  Loaded batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(data.length / BATCH_SIZE)}`);
  }

  console.log(`  ✓ ${tableName} migration complete`);
}
```

---

## Phase 5: Testing & Validation

### Step 5.1: Data Validation

```sql
-- Compare row counts (BigQuery vs Oracle)
-- BigQuery:
SELECT 'fact_banking_transactions' as table_name, COUNT(*) as row_count
FROM `rpa_warehouse.fact_banking_transactions`
UNION ALL
SELECT 'fact_job_executions', COUNT(*)
FROM `rpa_warehouse.fact_job_executions`;

-- Oracle:
SELECT 'fact_banking_transactions' as table_name, COUNT(*) as row_count
FROM fact_banking_transactions
UNION ALL
SELECT 'fact_job_executions', COUNT(*)
FROM fact_job_executions;
```

### Step 5.2: Functional Testing

```bash
# Test data insertion
npx tsx tests/integration/oracle-insert.test.ts

# Test data querying
npx tsx tests/integration/oracle-query.test.ts

# Test analytics API
curl http://localhost:3000/api/analytics | jq .

# Verify warehouse type in response
{
  "system": {
    "warehouse": "oracle-finance",
    ...
  }
}
```

### Step 5.3: Performance Testing

```bash
# Benchmark batch insert performance
npx tsx tests/performance/oracle-batch-insert-benchmark.ts

# Expected: >1000 rows/sec for Oracle (vs. 500 rows/sec for BigQuery)

# Benchmark query performance
npx tsx tests/performance/oracle-query-benchmark.ts

# Compare against BigQuery baseline
```

### Step 5.4: End-to-End Testing

1. **Create a test job**
   ```bash
   curl -X POST http://localhost:3000/api/jobs \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Oracle Migration",
       "dataSource": { "networkId": "ACH-NACHA", ... },
       "schedule": { "cronExpression": "0 0 * * *" }
     }'
   ```

2. **Trigger job execution**
   ```bash
   curl -X POST http://localhost:3000/api/jobs/{job_id}/trigger
   ```

3. **Verify data in Oracle**
   ```sql
   SELECT * FROM fact_job_executions
   WHERE job_id = '{job_id}'
   ORDER BY started_at DESC;

   SELECT * FROM fact_banking_transactions
   WHERE job_id = '{job_id}'
   ORDER BY transaction_timestamp DESC;
   ```

4. **Check WebSocket events**
   - Verify real-time updates are working
   - Check job status updates

### Step 5.5: Validate Dimensions

```sql
-- Check SCD Type 2 history for jobs
SELECT job_id, name, effective_from, effective_to, is_current
FROM dim_jobs
WHERE job_id = '{job_id}'
ORDER BY effective_from DESC;

-- Check banking networks
SELECT network_id, network_name, is_active
FROM dim_banking_networks
ORDER BY network_name;

-- Check date dimension
SELECT * FROM dim_date
WHERE date_key BETWEEN SYSDATE - 7 AND SYSDATE;
```

---

## Phase 6: Cutover

### Step 6.1: Pre-Cutover Validation

- [ ] All data validation checks passed
- [ ] Performance tests show acceptable results
- [ ] End-to-end tests successful
- [ ] Rollback plan reviewed and approved
- [ ] Stakeholders notified

### Step 6.2: Execute Cutover

**Option A: Blue-Green Deployment (Zero Downtime)**

```bash
# 1. Deploy new version with Oracle to "green" environment
# 2. Route 10% of traffic to green
# 3. Monitor metrics and errors
# 4. Gradually increase to 50%, then 100%
# 5. Decommission "blue" environment
```

**Option B: Direct Cutover (Brief Maintenance Window)**

```bash
# 1. Announce maintenance window (15 minutes)
# 2. Stop worker processes
pm2 stop extractionWorker schedulerWorker

# 3. Wait for in-flight jobs to complete
# Check: SELECT COUNT(*) FROM fact_job_executions WHERE status = 'running';

# 4. Switch environment variable
export WAREHOUSE_TYPE=oracle-finance

# 5. Restart all services
pm2 restart all

# 6. Verify health checks
curl http://localhost:3000/api/health
```

### Step 6.3: Post-Cutover Monitoring

```bash
# Monitor logs
tail -f logs/application.log | grep -i oracle

# Monitor Oracle performance
# Check AWR reports in Oracle Cloud Console

# Monitor error rates
# Check application metrics dashboard

# Monitor BigQuery costs (should drop to zero)
# Check GCP billing console
```

---

## Rollback Procedure

If issues are detected after cutover, follow this procedure:

### Immediate Rollback (< 15 minutes)

```bash
# 1. Stop services
pm2 stop all

# 2. Revert environment variable
export WAREHOUSE_TYPE=bigquery

# 3. Restart services
pm2 start all

# 4. Verify BigQuery connectivity
curl http://localhost:3000/api/analytics | jq '.system.warehouse'
# Should return: "bigquery"

# 5. Notify stakeholders
```

### Data Reconciliation After Rollback

```bash
# 1. Identify data written to Oracle during cutover period
SELECT execution_id, started_at, completed_at
FROM fact_job_executions
WHERE started_at >= '{cutover_timestamp}'
  AND completed_at IS NOT NULL;

# 2. Export Oracle data from cutover period
npx tsx server/database/export-oracle-data.ts \
  --start="{cutover_timestamp}" \
  --output=./rollback-data

# 3. Import to BigQuery
npx tsx server/database/import-to-bigquery.ts \
  --source=./rollback-data
```

---

## Post-Migration Tasks

### Step 1: Decommission BigQuery Resources

**Wait Period**: 30 days minimum

```bash
# 1. Stop dual-write mode (if enabled)
# 2. Archive BigQuery dataset
bq mk --transfer_config \
  --project_id=your-project \
  --data_source=scheduled_query \
  --target_dataset=rpa_warehouse_archive

# 3. Delete BigQuery dataset (after verification)
bq rm -r -f -d rpa_warehouse

# 4. Revoke service account permissions
gcloud projects remove-iam-policy-binding your-project \
  --member=serviceAccount:rpa-bigquery@... \
  --role=roles/bigquery.dataEditor
```

### Step 2: Update Documentation

- [ ] Update architecture diagrams
- [ ] Update deployment guides
- [ ] Update API documentation
- [ ] Update runbooks
- [ ] Update disaster recovery plans

### Step 3: Optimize Oracle Performance

```sql
-- Analyze statistics for query optimization
BEGIN
  DBMS_STATS.GATHER_SCHEMA_STATS(
    ownname => 'RPA_WAREHOUSE_USER',
    cascade => TRUE
  );
END;

-- Check index usage
SELECT index_name, table_name, last_used
FROM user_object_usage
WHERE object_type = 'INDEX'
ORDER BY last_used DESC NULLS LAST;

-- Review materialized view refresh performance
SELECT mview_name, refresh_mode, last_refresh_date, staleness
FROM user_mviews;
```

### Step 4: Set Up Monitoring & Alerts

```bash
# Configure Oracle Enterprise Manager alerts
# Set thresholds for:
# - CPU usage > 80%
# - Storage usage > 85%
# - Query response time > 5s
# - Failed batch inserts

# Configure application alerts
# - Oracle connection failures
# - Batch insert errors
# - Query timeouts
```

---

## Troubleshooting

### Issue: Connection Timeout

**Symptoms**: `ORA-12170: TNS:Connect timeout occurred`

**Solutions**:
```bash
# 1. Check network connectivity
ping oracle-host.oraclecloud.com

# 2. Verify firewall rules allow port 1521
telnet oracle-host.oraclecloud.com 1521

# 3. Check Oracle listener status
lsnrctl status

# 4. Increase timeout in connection config
ORACLE_CONNECTION_TIMEOUT=60000
```

### Issue: Wallet Authentication Failed

**Symptoms**: `ORA-28759: failure to open file`

**Solutions**:
```bash
# 1. Verify wallet files exist
ls -la ./credentials/oracle-wallet/
# Should contain: cwallet.sso, ewallet.p12, tnsnames.ora, sqlnet.ora

# 2. Check file permissions
chmod 600 ./credentials/oracle-wallet/*

# 3. Verify sqlnet.ora configuration
cat ./credentials/oracle-wallet/sqlnet.ora
# Should contain: WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="...")))

# 4. Set TNS_ADMIN environment variable
export TNS_ADMIN=./credentials/oracle-wallet
```

### Issue: Slow Batch Inserts

**Symptoms**: Insert performance < 500 rows/sec

**Solutions**:
```bash
# 1. Increase batch size
ORACLE_BATCH_SIZE=5000

# 2. Increase connection pool
ORACLE_CONNECTION_POOL_MAX=20

# 3. Use array binding (already implemented in OracleFinanceClient)

# 4. Check Oracle AWR report for bottlenecks
# Oracle Cloud Console → Performance Hub → AWR Report

# 5. Consider partitioning strategy
# Ensure partitions are properly distributed
```

### Issue: Query Performance Degraded

**Symptoms**: Queries slower than BigQuery

**Solutions**:
```sql
-- 1. Update table statistics
BEGIN
  DBMS_STATS.GATHER_TABLE_STATS('RPA_WAREHOUSE_USER', 'FACT_BANKING_TRANSACTIONS');
END;

-- 2. Check index usage
SELECT index_name, NUM_ROWS, LAST_ANALYZED
FROM user_indexes
WHERE table_name = 'FACT_BANKING_TRANSACTIONS';

-- 3. Use execution plan
EXPLAIN PLAN FOR
SELECT * FROM fact_banking_transactions
WHERE transaction_date >= SYSDATE - 30;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);

-- 4. Consider materialized views for frequent queries
CREATE MATERIALIZED VIEW mv_recent_transactions
REFRESH FAST ON COMMIT AS
SELECT * FROM fact_banking_transactions
WHERE transaction_date >= SYSDATE - 30;
```

### Issue: Data Type Mismatch

**Symptoms**: `ORA-01722: invalid number`

**Solutions**:
- Check `OracleSchemaMapper` boolean conversion (true/false → 1/0)
- Verify JSON serialization for CLOB columns
- Check date format conversion (ISO 8601 → Oracle TIMESTAMP)

```typescript
// Debug data transformation
const mapper = new OracleSchemaMapper();
const oracleRow = mapper.toOracleSchema('fact_transactions', bigqueryRow);
console.log('Transformed row:', oracleRow);
```

---

## Migration Checklist

### Pre-Migration

- [ ] Oracle Cloud instance provisioned
- [ ] Database user created with privileges
- [ ] Oracle Wallet downloaded and configured
- [ ] Dependencies installed (oracledb, @oracle/oci-sdk)
- [ ] Environment variables configured
- [ ] Backup of current system completed

### Schema Deployment

- [ ] Oracle schema deployed successfully
- [ ] Fact tables created with partitions
- [ ] Dimension tables created
- [ ] Indexes created
- [ ] Materialized views created
- [ ] Partition purge job scheduled
- [ ] Date dimension populated

### Code Integration

- [ ] Latest code pulled and built
- [ ] Type checks passed
- [ ] Linter checks passed
- [ ] Unit tests passed
- [ ] Integration tests passed

### Data Migration

- [ ] Historical data exported from BigQuery
- [ ] Data migrated to Oracle
- [ ] Row counts validated
- [ ] Sample data spot-checked
- [ ] Dimension tables synchronized

### Testing

- [ ] Data insertion test passed
- [ ] Data querying test passed
- [ ] Analytics API test passed
- [ ] End-to-end job execution test passed
- [ ] Performance benchmarks acceptable

### Cutover

- [ ] Cutover plan reviewed
- [ ] Rollback plan prepared
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled
- [ ] Services switched to Oracle
- [ ] Health checks passed
- [ ] Monitoring configured

### Post-Migration

- [ ] 7-day stability period completed
- [ ] 30-day observation period completed
- [ ] BigQuery resources decommissioned
- [ ] Documentation updated
- [ ] Lessons learned documented

---

## Support & Resources

### Documentation
- Oracle Documentation: https://docs.oracle.com/en/database/
- node-oracledb: https://oracle.github.io/node-oracledb/
- Oracle Cloud: https://docs.cloud.oracle.com/

### Internal Resources
- Implementation Plan: `docs/ORACLE_FINANCE_IMPLEMENTATION_PLAN.md`
- Architecture Diagram: `docs/BIGQUERY_ARCHITECTURE_DIAGRAM.md`
- CLAUDE.md: Project-specific guidance for Claude Code

### Escalation
- Database Team: database-team@company.com
- DevOps Team: devops@company.com
- Oracle Support: https://support.oracle.com/

---

**Migration Version**: 1.0
**Last Updated**: 2026-01-07
**Owner**: RPA Engineering Team
