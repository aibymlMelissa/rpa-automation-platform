/**
 * Oracle Finance Data Warehouse Setup Script (MOCKUP)
 *
 * Creates all tables, indexes, materialized views, and partition management
 * jobs in Oracle Finance database.
 *
 * IMPORTANT: This is a mockup for planning purposes.
 * To use in production:
 * 1. Install dependencies: npm install oracledb
 * 2. Configure Oracle credentials in .env
 * 3. Remove .mockup extension
 * 4. Run: npx tsx server/database/oracle-setup.ts
 */

// Mock oracledb import (install in production)
// import oracledb from 'oracledb';

import { ALL_ORACLE_DDL } from '../../src/core/warehouse/schemas/oracleTables.mockup';

interface OracleConfig {
  user: string;
  password: string;
  connectionString: string;
}

/**
 * Main setup function
 */
async function setupOracleWarehouse() {
  console.log('='.repeat(80));
  console.log('Oracle Finance Data Warehouse Setup');
  console.log('='.repeat(80));
  console.log();

  // Load configuration
  const config = loadConfig();

  // MOCKUP: In production, create actual connection
  console.log('[Setup] Connecting to Oracle...');
  console.log(`  Host: ${config.connectionString}`);
  console.log(`  User: ${config.user}`);
  console.log();

  /*
  const connection = await oracledb.getConnection({
    user: config.user,
    password: config.password,
    connectionString: config.connectionString,
  });

  console.log('[Setup] Connected successfully!\n');
  */

  try {
    // Step 1: Create Fact Tables
    await createFactTables(/* connection */);

    // Step 2: Create Dimension Tables
    await createDimensionTables(/* connection */);

    // Step 3: Create Indexes
    await createIndexes(/* connection */);

    // Step 4: Create Materialized Views
    await createMaterializedViews(/* connection */);

    // Step 5: Create Foreign Key Constraints (optional)
    await createConstraints(/* connection */);

    // Step 6: Create Partition Purge Job
    await createPartitionPurgeJob(/* connection */);

    // Step 7: Populate Date Dimension
    await populateDateDimension(/* connection */);

    /*
    await connection.commit();
    console.log('\n[Setup] All changes committed successfully!');
    */

    console.log('\n' + '='.repeat(80));
    console.log('✓ Oracle Finance Data Warehouse Setup Complete!');
    console.log('='.repeat(80));
    console.log();
    console.log('Next Steps:');
    console.log('1. Run dimension sync: npx tsx server/database/sync-dimensions.ts');
    console.log('2. Migrate data (if needed): npx tsx server/database/migrate-bigquery-to-oracle.ts');
    console.log('3. Configure application: WAREHOUSE_TYPE=oracle-finance');
    console.log('4. Start services: npm run dev');
    console.log();
  } catch (error: any) {
    console.error('\n[ERROR] Setup failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    /*
    await connection.close();
    console.log('[Setup] Connection closed');
    */
  }
}

/**
 * Load Oracle configuration from environment
 */
function loadConfig(): OracleConfig {
  const required = ['ORACLE_HOST', 'ORACLE_USERNAME', 'ORACLE_PASSWORD', 'ORACLE_SERVICE_NAME'];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  const port = process.env.ORACLE_PORT || '1521';
  const host = process.env.ORACLE_HOST;
  const serviceName = process.env.ORACLE_SERVICE_NAME;

  return {
    user: process.env.ORACLE_USERNAME!,
    password: process.env.ORACLE_PASSWORD!,
    connectionString: `${host}:${port}/${serviceName}`,
  };
}

/**
 * Create Fact Tables
 */
async function createFactTables(/* connection: oracledb.Connection */) {
  console.log('[1/7] Creating Fact Tables...');

  const tables = Object.entries(ALL_ORACLE_DDL.factTables);

  for (const [name, ddl] of tables) {
    console.log(`  → Creating ${name}...`);

    // MOCKUP: In production, execute DDL
    /*
    try {
      await connection.execute(ddl);
      console.log(`    ✓ ${name} created`);
    } catch (error: any) {
      if (error.errorNum === 955) { // ORA-00955: name is already used by an existing object
        console.log(`    ⚠ ${name} already exists, skipping`);
      } else {
        throw error;
      }
    }
    */
    console.log(`    ✓ ${name} created (mockup)`);
  }

  console.log(`  ✓ ${tables.length} fact tables created\n`);
}

/**
 * Create Dimension Tables
 */
async function createDimensionTables(/* connection: oracledb.Connection */) {
  console.log('[2/7] Creating Dimension Tables...');

  const tables = Object.entries(ALL_ORACLE_DDL.dimTables);

  for (const [name, ddl] of tables) {
    console.log(`  → Creating ${name}...`);

    /*
    try {
      await connection.execute(ddl);
      console.log(`    ✓ ${name} created`);
    } catch (error: any) {
      if (error.errorNum === 955) {
        console.log(`    ⚠ ${name} already exists, skipping`);
      } else {
        throw error;
      }
    }
    */
    console.log(`    ✓ ${name} created (mockup)`);
  }

  console.log(`  ✓ ${tables.length} dimension tables created\n`);
}

/**
 * Create Indexes
 */
async function createIndexes(/* connection: oracledb.Connection */) {
  console.log('[3/7] Creating Indexes...');

  const indexes = Object.entries(ALL_ORACLE_DDL.indexes);

  for (const [name, ddl] of indexes) {
    console.log(`  → Creating ${name}...`);

    /*
    try {
      await connection.execute(ddl);
      console.log(`    ✓ ${name} created`);
    } catch (error: any) {
      if (error.errorNum === 955) {
        console.log(`    ⚠ ${name} already exists, skipping`);
      } else {
        throw error;
      }
    }
    */
    console.log(`    ✓ ${name} created (mockup)`);
  }

  console.log(`  ✓ ${indexes.length} indexes created\n`);
}

/**
 * Create Materialized Views
 */
async function createMaterializedViews(/* connection: oracledb.Connection */) {
  console.log('[4/7] Creating Materialized Views...');

  const mvs = Object.entries(ALL_ORACLE_DDL.materializedViews);

  for (const [name, ddl] of mvs) {
    console.log(`  → Creating ${name}...`);

    /*
    try {
      await connection.execute(ddl);
      console.log(`    ✓ ${name} created`);
    } catch (error: any) {
      if (error.errorNum === 955) {
        console.log(`    ⚠ ${name} already exists, skipping`);
      } else {
        throw error;
      }
    }
    */
    console.log(`    ✓ ${name} created (mockup)`);
  }

  console.log(`  ✓ ${mvs.length} materialized views created\n`);
}

/**
 * Create Foreign Key Constraints (Optional)
 */
async function createConstraints(/* connection: oracledb.Connection */) {
  console.log('[5/7] Creating Foreign Key Constraints...');

  const constraints = Object.entries(ALL_ORACLE_DDL.constraints);

  for (const [name, ddl] of constraints) {
    console.log(`  → Creating ${name}...`);

    /*
    try {
      await connection.execute(ddl);
      console.log(`    ✓ ${name} created`);
    } catch (error: any) {
      if (error.errorNum === 2275) { // ORA-02275: such a referential constraint already exists
        console.log(`    ⚠ ${name} already exists, skipping`);
      } else {
        console.warn(`    ⚠ ${name} failed: ${error.message} (continuing...)`);
      }
    }
    */
    console.log(`    ✓ ${name} created (mockup)`);
  }

  console.log(`  ✓ ${constraints.length} constraints created\n`);
}

/**
 * Create Partition Purge Job
 */
async function createPartitionPurgeJob(/* connection: oracledb.Connection */) {
  console.log('[6/7] Creating Partition Purge Job...');

  console.log('  → Creating automated partition purge job...');

  /*
  try {
    await connection.execute(ALL_ORACLE_DDL.partitionPurgeJob);
    console.log('    ✓ PURGE_OLD_PARTITIONS job created');
  } catch (error: any) {
    if (error.errorNum === 27477) { // ORA-27477: job already exists
      console.log('    ⚠ Job already exists, skipping');
    } else {
      throw error;
    }
  }
  */
  console.log('    ✓ PURGE_OLD_PARTITIONS job created (mockup)');

  console.log('  ✓ Partition management configured\n');
}

/**
 * Populate Date Dimension (2020-2030)
 */
async function populateDateDimension(/* connection: oracledb.Connection */) {
  console.log('[7/7] Populating Date Dimension...');

  const startYear = 2020;
  const endYear = 2030;

  console.log(`  → Generating dates from ${startYear} to ${endYear}...`);

  /*
  // Check if already populated
  const result = await connection.execute<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM dim_date'
  );

  if (result.rows && result.rows[0].cnt > 0) {
    console.log(`    ⚠ Date dimension already populated (${result.rows[0].cnt} rows), skipping`);
    return;
  }

  // Generate dates
  const dates: any[] = [];
  const startDate = new Date(startYear, 0, 1);
  const endDate = new Date(endYear, 11, 31);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = date.getDay();

    dates.push({
      date_key: date,
      year,
      quarter: Math.floor((month - 1) / 3) + 1,
      month,
      week: getWeekNumber(date),
      day,
      day_of_week: dayOfWeek,
      day_name: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      month_name: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month - 1],
      is_weekend: dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0,
      is_holiday: 0, // TODO: Load holidays from external source
      fiscal_year: month >= 4 ? year : year - 1, // Assuming fiscal year starts in April
      fiscal_quarter: Math.floor(((month + 8) % 12) / 3) + 1,
      iso_week: getISOWeekNumber(date),
    });
  }

  // Batch insert dates
  const sql = `
    INSERT INTO dim_date (
      date_key, year, quarter, month, week, day, day_of_week, day_name, month_name,
      is_weekend, is_holiday, fiscal_year, fiscal_quarter, iso_week
    ) VALUES (
      :date_key, :year, :quarter, :month, :week, :day, :day_of_week, :day_name, :month_name,
      :is_weekend, :is_holiday, :fiscal_year, :fiscal_quarter, :iso_week
    )
  `;

  await connection.executeMany(sql, dates, { autoCommit: true });
  console.log(`    ✓ ${dates.length} dates inserted`);
  */

  console.log(`    ✓ Date dimension populated with ~${(endYear - startYear + 1) * 365} rows (mockup)`);
  console.log('  ✓ Date dimension ready\n');
}

/**
 * Get ISO week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Get ISO week number (alternative implementation)
 */
function getISOWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

// ============================================================================
// Run Setup
// ============================================================================

if (require.main === module) {
  // Load environment variables
  require('dotenv').config();

  setupOracleWarehouse()
    .then(() => {
      console.log('Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

export { setupOracleWarehouse };
