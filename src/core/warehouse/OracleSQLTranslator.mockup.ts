/**
 * Oracle SQL Translator (MOCKUP)
 *
 * Translates BigQuery SQL syntax to Oracle SQL syntax.
 * Allows writing queries once in BigQuery format and automatically
 * converting them to Oracle-compatible SQL.
 *
 * Key Transformations:
 * - Date functions (CURRENT_DATE, DATE_SUB, DATE_ADD)
 * - Conditional aggregates (COUNTIF, SUMIF)
 * - JSON functions (JSON_EXTRACT → JSON_VALUE)
 * - Pagination (LIMIT/OFFSET → FETCH FIRST/OFFSET)
 * - String functions
 * - Type casting
 */

export class OracleSQLTranslator {
  /**
   * Translate BigQuery SQL to Oracle SQL
   *
   * @param bigQuerySQL - SQL in BigQuery syntax
   * @returns SQL in Oracle syntax
   */
  translateQuery(bigQuerySQL: string): string {
    let oracleSQL = bigQuerySQL;

    // Apply transformations in order
    oracleSQL = this.translateDateFunctions(oracleSQL);
    oracleSQL = this.translateConditionalAggregates(oracleSQL);
    oracleSQL = this.translateJSONFunctions(oracleSQL);
    oracleSQL = this.translatePagination(oracleSQL);
    oracleSQL = this.translateStringFunctions(oracleSQL);
    oracleSQL = this.translateTypeCasting(oracleSQL);
    oracleSQL = this.translateTableDecorators(oracleSQL);
    oracleSQL = this.translateBooleanLogic(oracleSQL);

    return oracleSQL;
  }

  // ============================================================================
  // Date Functions
  // ============================================================================

  private translateDateFunctions(sql: string): string {
    // CURRENT_DATE() → TRUNC(SYSDATE)
    sql = sql.replace(/CURRENT_DATE\(\)/gi, 'TRUNC(SYSDATE)');

    // CURRENT_TIMESTAMP() → SYSTIMESTAMP
    sql = sql.replace(/CURRENT_TIMESTAMP\(\)/gi, 'SYSTIMESTAMP');

    // CURRENT_TIME() → TO_CHAR(SYSTIMESTAMP, 'HH24:MI:SS')
    sql = sql.replace(/CURRENT_TIME\(\)/gi, "TO_CHAR(SYSTIMESTAMP, 'HH24:MI:SS')");

    // DATE_SUB(CURRENT_DATE(), INTERVAL n DAY) → SYSDATE - n
    sql = sql.replace(
      /DATE_SUB\s*\(\s*CURRENT_DATE\(\)\s*,\s*INTERVAL\s+(\d+)\s+DAY\s*\)/gi,
      'SYSDATE - $1'
    );

    // DATE_ADD(CURRENT_DATE(), INTERVAL n DAY) → SYSDATE + n
    sql = sql.replace(
      /DATE_ADD\s*\(\s*CURRENT_DATE\(\)\s*,\s*INTERVAL\s+(\d+)\s+DAY\s*\)/gi,
      'SYSDATE + $1'
    );

    // DATE_DIFF(date1, date2, DAY) → (date1 - date2)
    sql = sql.replace(
      /DATE_DIFF\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*DAY\s*\)/gi,
      '($1 - $2)'
    );

    // EXTRACT(YEAR FROM date) → EXTRACT(YEAR FROM date) (same)
    // EXTRACT(MONTH FROM date) → EXTRACT(MONTH FROM date) (same)
    // No change needed

    // FORMAT_DATE('%Y-%m-%d', date) → TO_CHAR(date, 'YYYY-MM-DD')
    sql = sql.replace(
      /FORMAT_DATE\s*\(\s*'([^']+)'\s*,\s*([^)]+)\s*\)/gi,
      (_, format, dateExpr) => {
        const oracleFormat = this.convertDateFormat(format);
        return `TO_CHAR(${dateExpr}, '${oracleFormat}')`;
      }
    );

    return sql;
  }

  // ============================================================================
  // Conditional Aggregates
  // ============================================================================

  private translateConditionalAggregates(sql: string): string {
    // COUNTIF(condition) → COUNT(CASE WHEN condition THEN 1 END)
    sql = sql.replace(
      /COUNTIF\s*\(\s*([^)]+)\s*\)/gi,
      'COUNT(CASE WHEN $1 THEN 1 END)'
    );

    // SUMIF(condition, value) → SUM(CASE WHEN condition THEN value END)
    sql = sql.replace(
      /SUMIF\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
      'SUM(CASE WHEN $1 THEN $2 END)'
    );

    // AVGIF(condition, value) → AVG(CASE WHEN condition THEN value END)
    sql = sql.replace(
      /AVGIF\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
      'AVG(CASE WHEN $1 THEN $2 END)'
    );

    return sql;
  }

  // ============================================================================
  // JSON Functions
  // ============================================================================

  private translateJSONFunctions(sql: string): string {
    // JSON_EXTRACT(json, '$.path') → JSON_VALUE(json, '$.path')
    sql = sql.replace(
      /JSON_EXTRACT\s*\(\s*([^,]+)\s*,\s*'([^']+)'\s*\)/gi,
      "JSON_VALUE($1, '$2')"
    );

    // JSON_EXTRACT_SCALAR → JSON_VALUE (alias)
    sql = sql.replace(
      /JSON_EXTRACT_SCALAR\s*\(\s*([^,]+)\s*,\s*'([^']+)'\s*\)/gi,
      "JSON_VALUE($1, '$2')"
    );

    // JSON_EXTRACT_ARRAY → JSON_QUERY (for arrays)
    sql = sql.replace(
      /JSON_EXTRACT_ARRAY\s*\(\s*([^,]+)\s*,\s*'([^']+)'\s*\)/gi,
      "JSON_QUERY($1, '$2')"
    );

    return sql;
  }

  // ============================================================================
  // Pagination
  // ============================================================================

  private translatePagination(sql: string): string {
    // LIMIT n OFFSET m → OFFSET m ROWS FETCH FIRST n ROWS ONLY
    const limitOffsetMatch = sql.match(/LIMIT\s+(\d+)\s+OFFSET\s+(\d+)/i);
    if (limitOffsetMatch) {
      const limit = limitOffsetMatch[1];
      const offset = limitOffsetMatch[2];
      sql = sql.replace(
        /LIMIT\s+\d+\s+OFFSET\s+\d+/i,
        `OFFSET ${offset} ROWS FETCH FIRST ${limit} ROWS ONLY`
      );
    } else {
      // LIMIT n → FETCH FIRST n ROWS ONLY
      sql = sql.replace(/LIMIT\s+(\d+)/gi, 'FETCH FIRST $1 ROWS ONLY');

      // OFFSET n → OFFSET n ROWS
      sql = sql.replace(/OFFSET\s+(\d+)/gi, 'OFFSET $1 ROWS');
    }

    return sql;
  }

  // ============================================================================
  // String Functions
  // ============================================================================

  private translateStringFunctions(sql: string): string {
    // CONCAT(str1, str2, str3) → str1 || str2 || str3
    // Oracle's CONCAT only takes 2 arguments, use || for multiple
    sql = sql.replace(
      /CONCAT\s*\(\s*([^)]+)\s*\)/gi,
      (_, args) => {
        const argList = this.splitArguments(args);
        return argList.join(' || ');
      }
    );

    // LENGTH(str) → LENGTH(str) (same)
    // LOWER(str) → LOWER(str) (same)
    // UPPER(str) → UPPER(str) (same)
    // No change needed

    // SUBSTR(str, pos, len) → SUBSTR(str, pos, len) (same, but Oracle is 1-indexed)
    // No change needed (BigQuery is also 1-indexed for SUBSTR)

    // REGEXP_CONTAINS(str, pattern) → REGEXP_LIKE(str, pattern)
    sql = sql.replace(
      /REGEXP_CONTAINS\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
      'REGEXP_LIKE($1, $2)'
    );

    return sql;
  }

  // ============================================================================
  // Type Casting
  // ============================================================================

  private translateTypeCasting(sql: string): string {
    // CAST(expr AS STRING) → TO_CHAR(expr)
    sql = sql.replace(/CAST\s*\(\s*([^)]+)\s+AS\s+STRING\s*\)/gi, 'TO_CHAR($1)');

    // CAST(expr AS INT64) → TO_NUMBER(expr)
    sql = sql.replace(/CAST\s*\(\s*([^)]+)\s+AS\s+INT64\s*\)/gi, 'TO_NUMBER($1)');

    // CAST(expr AS FLOAT64) → TO_NUMBER(expr)
    sql = sql.replace(/CAST\s*\(\s*([^)]+)\s+AS\s+FLOAT64\s*\)/gi, 'TO_NUMBER($1)');

    // CAST(expr AS DATE) → TO_DATE(expr)
    sql = sql.replace(/CAST\s*\(\s*([^)]+)\s+AS\s+DATE\s*\)/gi, 'TO_DATE($1)');

    // CAST(expr AS TIMESTAMP) → TO_TIMESTAMP(expr)
    sql = sql.replace(/CAST\s*\(\s*([^)]+)\s+AS\s+TIMESTAMP\s*\)/gi, 'TO_TIMESTAMP($1)');

    return sql;
  }

  // ============================================================================
  // Table Decorators & Identifiers
  // ============================================================================

  private translateTableDecorators(sql: string): string {
    // Remove backticks (BigQuery identifier quotes) → Oracle doesn't use them
    sql = sql.replace(/`([^`]+)`/g, '$1');

    // Remove dataset prefixes (project.dataset.table → table)
    sql = sql.replace(/\w+\.\w+\.(\w+)/g, '$1');

    return sql;
  }

  // ============================================================================
  // Boolean Logic
  // ============================================================================

  private translateBooleanLogic(sql: string): string {
    // BigQuery: WHERE is_active = TRUE
    // Oracle: WHERE is_active = 1
    sql = sql.replace(/=\s*TRUE\b/gi, '= 1');
    sql = sql.replace(/=\s*FALSE\b/gi, '= 0');
    sql = sql.replace(/IS\s+TRUE\b/gi, '= 1');
    sql = sql.replace(/IS\s+FALSE\b/gi, '= 0');

    return sql;
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Convert BigQuery date format to Oracle date format
   */
  private convertDateFormat(bigQueryFormat: string): string {
    // BigQuery uses %Y, %m, %d
    // Oracle uses YYYY, MM, DD
    const formatMap: Record<string, string> = {
      '%Y': 'YYYY',
      '%y': 'YY',
      '%m': 'MM',
      '%d': 'DD',
      '%H': 'HH24',
      '%I': 'HH12',
      '%M': 'MI',
      '%S': 'SS',
      '%p': 'AM',
      '%A': 'DAY',
      '%a': 'DY',
      '%B': 'MONTH',
      '%b': 'MON',
    };

    let oracleFormat = bigQueryFormat;
    for (const [bq, oracle] of Object.entries(formatMap)) {
      oracleFormat = oracleFormat.replace(new RegExp(bq, 'g'), oracle);
    }

    return oracleFormat;
  }

  /**
   * Split function arguments (handling nested parentheses)
   */
  private splitArguments(argsString: string): string[] {
    const args: string[] = [];
    let current = '';
    let depth = 0;

    for (const char of argsString) {
      if (char === '(') {
        depth++;
        current += char;
      } else if (char === ')') {
        depth--;
        current += char;
      } else if (char === ',' && depth === 0) {
        args.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      args.push(current.trim());
    }

    return args;
  }

  /**
   * Check if a query is already in Oracle syntax (to avoid double-translation)
   */
  isOracleSQL(sql: string): boolean {
    // Simple heuristic: check for Oracle-specific keywords
    const oracleKeywords = [
      'SYSDATE',
      'SYSTIMESTAMP',
      'DUAL',
      'ROWNUM',
      'FETCH FIRST',
      'CONNECT BY',
    ];

    return oracleKeywords.some(keyword => sql.toUpperCase().includes(keyword));
  }
}

// ============================================================================
// Export Singleton (Optional)
// ============================================================================

let translatorInstance: OracleSQLTranslator | null = null;

export function getOracleSQLTranslator(): OracleSQLTranslator {
  if (!translatorInstance) {
    translatorInstance = new OracleSQLTranslator();
  }
  return translatorInstance;
}

// ============================================================================
// Usage Examples
// ============================================================================

/*
// Example 1: Date functions
const bigQuery = `
  SELECT COUNT(*) as total
  FROM fact_job_executions
  WHERE execution_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
`;

const translator = new OracleSQLTranslator();
const oracle = translator.translateQuery(bigQuery);
// Result:
// SELECT COUNT(*) as total
// FROM fact_job_executions
// WHERE execution_date >= SYSDATE - 30

// Example 2: Conditional aggregates
const bigQuery2 = `
  SELECT
    COUNT(DISTINCT job_id) as total_jobs,
    COUNTIF(status = 'success') as completed_jobs,
    COUNTIF(status = 'failed') as failed_jobs
  FROM fact_job_executions
`;

const oracle2 = translator.translateQuery(bigQuery2);
// Result:
// SELECT
//   COUNT(DISTINCT job_id) as total_jobs,
//   COUNT(CASE WHEN status = 'success' THEN 1 END) as completed_jobs,
//   COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_jobs
// FROM fact_job_executions

// Example 3: JSON extraction
const bigQuery3 = `
  SELECT
    transaction_id,
    JSON_EXTRACT(metadata, '$.source') as source
  FROM fact_banking_transactions
`;

const oracle3 = translator.translateQuery(bigQuery3);
// Result:
// SELECT
//   transaction_id,
//   JSON_VALUE(metadata, '$.source') as source
// FROM fact_banking_transactions

// Example 4: Pagination
const bigQuery4 = `
  SELECT * FROM fact_transactions
  ORDER BY transaction_date DESC
  LIMIT 100 OFFSET 50
`;

const oracle4 = translator.translateQuery(bigQuery4);
// Result:
// SELECT * FROM fact_transactions
// ORDER BY transaction_date DESC
// OFFSET 50 ROWS FETCH FIRST 100 ROWS ONLY
*/
