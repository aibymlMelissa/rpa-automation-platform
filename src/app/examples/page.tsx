export default function ExamplesPage() {
  return (
    <>
      {/* Page Title */}
      <div className="card-glass mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Code Examples</h1>
        <p className="text-gray-600 text-lg">
          Practical examples for common RPA automation scenarios
        </p>
      </div>

      {/* Example 1: Web Automation */}
      <div className="card-glass mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Example 1: Bank Portal Web Automation</h2>
        <p className="text-gray-600 mb-4">
          Automate login to a bank portal and extract transaction history using Puppeteer.
        </p>
        <div className="code-block">
          <code className="text-sm">
            {`import { WebAutomation } from '@/core/extraction/WebAutomation';
import { CredentialVault } from '@/core/security/CredentialVault';

const automation = new WebAutomation({
  browser: 'chromium',
  headless: true,
  screenshotOnError: true,
});

const vault = new CredentialVault();

// Retrieve encrypted credentials
const credentials = await vault.retrieve('bank-portal-login');

try {
  // Navigate to bank portal
  await automation.navigate('https://business.bankexample.com/login');

  // Fill login form
  await automation.fillForm({
    username: '#username',
    password: '#password',
  }, credentials);

  // Submit login
  await automation.click('#login-button');

  // Wait for dashboard to load
  await automation.waitForSelector('.dashboard-container');

  // Handle MFA if required
  if (await automation.elementExists('#mfa-code')) {
    const mfaCode = await getMFACode(); // Your MFA provider
    await automation.type('#mfa-code', mfaCode);
    await automation.click('#verify-button');
  }

  // Navigate to transactions page
  await automation.click('a[href="/transactions"]');
  await automation.waitForSelector('.transaction-table');

  // Set date range filter
  await automation.fillForm({
    startDate: '#date-from',
    endDate: '#date-to',
  }, {
    startDate: '2025-01-01',
    endDate: '2025-01-31',
  });

  await automation.click('#apply-filter');
  await automation.waitForNetworkIdle();

  // Extract transaction table
  const transactions = await automation.extractTable('.transaction-table', {
    headers: ['date', 'description', 'amount', 'balance'],
    rowSelector: 'tbody tr',
    cellSelector: 'td',
  });

  // Take screenshot for audit
  await automation.captureScreenshot('transactions-extracted.png');

  console.log(\`Extracted \${transactions.length} transactions\`);

  return transactions;

} catch (error) {
  // Screenshot on error for debugging
  await automation.captureScreenshot('error-screenshot.png');
  throw error;
} finally {
  await automation.close();
}`}
          </code>
        </div>
      </div>

      {/* Example 2: API Extraction */}
      <div className="card-glass mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Example 2: REST API Data Extraction</h2>
        <p className="text-gray-600 mb-4">
          Extract data from a payment processor's REST API with OAuth 2.0 authentication.
        </p>
        <div className="code-block">
          <code className="text-sm">
            {`import { APIExtractor } from '@/core/extraction/APIExtractor';
import { CredentialVault } from '@/core/security/CredentialVault';

const vault = new CredentialVault();
const extractor = new APIExtractor();

// Retrieve OAuth credentials
const oauth = await vault.retrieve('stripe-api-oauth');

// Configure API client
extractor.configure({
  baseURL: 'https://api.stripe.com/v1',
  authentication: {
    method: 'oauth2',
    credentials: oauth,
    tokenEndpoint: 'https://api.stripe.com/oauth/token',
  },
  rateLimit: {
    requestsPerSecond: 10,
    burstAllowance: 20,
  },
});

// Extract paginated data
async function extractAllTransactions(startDate: string, endDate: string) {
  const allTransactions = [];
  let hasMore = true;
  let startingAfter = null;

  while (hasMore) {
    const response = await extractor.get('/charges', {
      params: {
        created: {
          gte: new Date(startDate).getTime() / 1000,
          lte: new Date(endDate).getTime() / 1000,
        },
        limit: 100,
        starting_after: startingAfter,
      },
    });

    allTransactions.push(...response.data);

    hasMore = response.has_more;
    if (hasMore) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return allTransactions;
}

// Execute extraction
const transactions = await extractAllTransactions('2025-01-01', '2025-01-31');
console.log(\`Extracted \${transactions.length} transactions from Stripe\`);

// Transform to standard format
const standardizedTransactions = transactions.map(txn => ({
  id: txn.id,
  date: new Date(txn.created * 1000).toISOString(),
  amount: txn.amount / 100, // Convert from cents
  currency: txn.currency.toUpperCase(),
  status: txn.status,
  description: txn.description,
  customerId: txn.customer,
  metadata: txn.metadata,
}));

return standardizedTransactions;`}
          </code>
        </div>
      </div>

      {/* Example 3: ETL Pipeline */}
      <div className="card-glass mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Example 3: Process Data Through ETL Pipeline</h2>
        <p className="text-gray-600 mb-4">
          Validate, transform, and load extracted banking transactions.
        </p>
        <div className="code-block">
          <code className="text-sm">
            {`import { ETLPipeline } from '@/core/pipeline/ETLPipeline';
import type { BankingTransaction, ExtractedData } from '@/types/rpa.types';

const pipeline = new ETLPipeline();

// Define transaction schema
const transactionSchema = {
  required: ['id', 'date', 'amount', 'currency'],
  properties: {
    id: { type: 'string', minLength: 1 },
    date: { type: 'string', format: 'date-time' },
    amount: { type: 'number', minimum: 0 },
    currency: { type: 'string', pattern: '^[A-Z]{3}$' },
    status: {
      type: 'string',
      enum: ['pending', 'completed', 'failed', 'cancelled']
    },
    description: { type: 'string', maxLength: 500 },
  },
};

// Extracted data from source
const extractedData: ExtractedData = {
  source: 'stripe-api',
  timestamp: new Date(),
  recordCount: 1250,
  data: rawTransactions, // From previous example
  metadata: {
    dateRange: { start: '2025-01-01', end: '2025-01-31' },
    extractionDuration: 4500, // milliseconds
  },
};

// Process through pipeline
const result = await pipeline.process({
  data: extractedData,
  schema: transactionSchema,
  transformations: [
    // Normalize currency codes
    {
      type: 'uppercase',
      fields: ['currency'],
    },
    // Convert dates to ISO 8601
    {
      type: 'dateFormat',
      field: 'date',
      outputFormat: 'ISO8601',
    },
    // Add calculated field for fees
    {
      type: 'calculation',
      target: 'totalWithFees',
      formula: 'amount * 1.029 + 0.30', // 2.9% + $0.30
    },
    // Enrich with bank name from code
    {
      type: 'lookup',
      source: 'bankCode',
      target: 'bankName',
      referenceTable: 'banks',
    },
  ],
  loadTargets: [
    {
      type: 'postgresql',
      table: 'transactions',
      mode: 'upsert',
      conflictKey: 'id',
    },
    {
      type: 's3',
      bucket: 'transaction-archives',
      path: 'stripe/2025/01/',
      format: 'parquet',
    },
  ],
});

// Check results
console.log(\`Pipeline completed:
  - Total records: \${result.totalRecords}
  - Valid records: \${result.validRecords}
  - Invalid records: \${result.invalidRecords}
  - Transformed: \${result.transformedRecords}
  - Loaded: \${result.loadedRecords}
  - Duration: \${result.durationMs}ms
\`);

// Handle validation errors
if (result.invalidRecords > 0) {
  console.error('Validation errors:', result.validationErrors);
  // Move invalid records to quarantine
  await pipeline.quarantine(result.invalidData);
}

return result;`}
          </code>
        </div>
      </div>

      {/* Example 4: Real-time Monitoring */}
      <div className="card-glass mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Example 4: Real-time Job Monitoring with WebSocket</h2>
        <p className="text-gray-600 mb-4">
          Subscribe to WebSocket events to monitor job execution in real-time.
        </p>
        <div className="code-block">
          <code className="text-sm">
            {`'use client';

import { useWebSocket } from '@/hooks/useWebSocket';
import { useState, useEffect } from 'react';
import type { WebSocketMessage } from '@/types/api.types';

export function JobMonitor({ jobId }: { jobId: string }) {
  const { subscribe, isConnected } = useWebSocket();
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Subscribe to job lifecycle events
    const unsubscribeStarted = subscribe('job:started', (data: WebSocketMessage) => {
      if (data.jobId === jobId) {
        setStatus('running');
        setLogs(prev => [...prev, \`Job started at \${new Date(data.timestamp).toLocaleTimeString()}\`]);
      }
    });

    const unsubscribeCompleted = subscribe('job:completed', (data: WebSocketMessage) => {
      if (data.jobId === jobId) {
        setStatus('completed');
        setProgress(100);
        setLogs(prev => [...prev, \`Job completed: \${data.recordsProcessed} records\`]);
      }
    });

    const unsubscribeFailed = subscribe('job:failed', (data: WebSocketMessage) => {
      if (data.jobId === jobId) {
        setStatus('failed');
        setLogs(prev => [...prev, \`Job failed: \${data.error}\`]);
      }
    });

    // Subscribe to extraction progress
    const unsubscribeProgress = subscribe('extraction:progress', (data: WebSocketMessage) => {
      if (data.jobId === jobId) {
        setProgress(data.percentage);
        setLogs(prev => [...prev, \`Progress: \${data.percentage}% (\${data.recordsProcessed}/\${data.totalRecords})\`]);
      }
    });

    // Subscribe to pipeline events
    const unsubscribePipeline = subscribe('pipeline:stage-change', (data: WebSocketMessage) => {
      if (data.jobId === jobId) {
        setLogs(prev => [...prev, \`Pipeline stage: \${data.stage}\`]);
      }
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeStarted();
      unsubscribeCompleted();
      unsubscribeFailed();
      unsubscribeProgress();
      unsubscribePipeline();
    };
  }, [jobId, subscribe]);

  return (
    <div className="card-glass">
      <h3 className="text-xl font-bold mb-4">Job: {jobId}</h3>

      {/* Connection Status */}
      <div className="mb-4">
        <span className={isConnected ? 'badge-success' : 'badge-danger'}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>

      {/* Job Status */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Status</div>
        <span className={\`badge-\${status === 'completed' ? 'success' : status === 'failed' ? 'danger' : 'warning'}\`}>
          {status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Progress: {progress}%</div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: \`\${progress}%\` }}
          />
        </div>
      </div>

      {/* Live Logs */}
      <div>
        <div className="text-sm text-gray-600 mb-2">Live Logs</div>
        <div className="code-block max-h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-xs mb-1">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}`}
          </code>
        </div>
      </div>

      {/* Example 5: Credential Management */}
      <div className="card-glass">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Example 5: Secure Credential Management</h2>
        <p className="text-gray-600 mb-4">
          Store, retrieve, and rotate credentials securely using CredentialVault.
        </p>
        <div className="code-block">
          <code className="text-sm">
            {`import { CredentialVault } from '@/core/security/CredentialVault';

const vault = new CredentialVault();

// Store API credentials with expiration
await vault.store('payment-gateway-api', {
  apiKey: 'pk_live_abc123...',
  apiSecret: 'sk_live_xyz789...',
  webhookSecret: 'whsec_abc123...',
}, {
  expiresAt: new Date('2025-12-31T23:59:59Z'),
  metadata: {
    environment: 'production',
    service: 'payment-gateway',
    owner: 'finance-team',
  },
});

// Store OAuth tokens with auto-refresh
await vault.store('bank-oauth-token', {
  accessToken: 'ya29.a0AfH6...',
  refreshToken: 'refresh_token_abc...',
  tokenType: 'Bearer',
  expiresIn: 3600,
}, {
  expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
  autoRotate: true,
  rotationCallback: async (oldToken) => {
    // Refresh token logic
    const newToken = await refreshOAuthToken(oldToken.refreshToken);
    return newToken;
  },
});

// Retrieve credentials (automatically decrypted)
const credentials = await vault.retrieve('payment-gateway-api');
console.log('API Key:', credentials.apiKey);

// Check expiration
const metadata = await vault.getMetadata('payment-gateway-api');
console.log('Expires:', metadata.expiresAt);
console.log('Days until expiration:',
  Math.floor((metadata.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
);

// Rotate credentials before expiration
if (metadata.daysUntilExpiration < 30) {
  await vault.rotate('payment-gateway-api', async (oldCreds) => {
    // Generate new credentials via API
    const newCreds = await paymentGateway.rotateAPIKey(oldCreds.apiKey);
    return {
      apiKey: newCreds.newApiKey,
      apiSecret: newCreds.newApiSecret,
      webhookSecret: oldCreds.webhookSecret, // Keep same webhook secret
    };
  });

  console.log('Credentials rotated successfully');
}

// List all credentials
const allCredentials = await vault.list();
console.log('Stored credentials:', allCredentials.map(c => ({
  id: c.id,
  expiresAt: c.expiresAt,
  metadata: c.metadata,
})));

// Secure deletion
await vault.delete('old-credentials');
console.log('Credentials securely deleted');`}
          </code>
        </div>
      </div>

      {/* Example 6: AI-Powered Adaptive Automation (NEW in v2.0.0) */}
      <div className="card-glass bg-purple-50 border-2 border-purple-300">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🧠</span>
          <h2 className="text-2xl font-bold text-purple-700">Example 6: AI-Powered Adaptive Automation (Professional+ Tiers)</h2>
        </div>
        <p className="text-gray-700 mb-4">
          Use generative AI to automatically recover from banking portal changes and normalize inconsistent data formats.
        </p>
        <div className="code-block">
          <code className="text-sm">
            {`import { AdaptiveSelectorAI } from '@/services/ai/AdaptiveSelectorAI';
import { DataNormalizerAI } from '@/services/ai/DataNormalizerAI';
import { WebAutomation } from '@/core/extraction/WebAutomation';

// 1. Adaptive Selector Recovery
// When a banking portal changes their UI, AI automatically finds new selectors
const automation = new WebAutomation();

try {
  await automation.click('#login-button');
} catch (error) {
  // Portal changed! AI to the rescue
  console.log('Selector failed, using AI to recover...');

  const newSelector = await AdaptiveSelectorAI.recover({
    pageHTML: await automation.getHTML(),
    originalSelector: '#login-button',
    targetDescription: 'blue login button with white text',
    screenshot: await automation.captureScreenshot(),
  });

  console.log(\`AI suggested new selector: \${newSelector}\`);
  await automation.click(newSelector); // ✅ Recovered automatically!
}

// 2. Smart Data Normalization
// Banking APIs return dates/currencies in different formats
const messyTransactions = [
  { date: 'Jan 15, 2025', amount: '$1,234.56', currency: 'usd' },
  { date: '2025-01-16', amount: '2345.67 USD', currency: 'USD' },
  { date: '17/01/25', amount: '€3,456.78', currency: 'EUR' },
  { date: '1/18/2025', amount: '4567.89', currency: '' }, // Missing currency
];

// AI normalizes to consistent format
const normalized = await DataNormalizerAI.normalize(messyTransactions, {
  schema: {
    date: 'ISO8601',
    amount: 'number',
    currency: 'ISO4217',
  },
  provider: 'deepseek', // Cost-effective for data normalization
});

console.log('Normalized data:', normalized);
// Result:
// [
//   { date: '2025-01-15T00:00:00Z', amount: 1234.56, currency: 'USD' },
//   { date: '2025-01-16T00:00:00Z', amount: 2345.67, currency: 'USD' },
//   { date: '2025-01-17T00:00:00Z', amount: 3456.78, currency: 'EUR' },
//   { date: '2025-01-18T00:00:00Z', amount: 4567.89, currency: 'USD' }, // AI inferred
// ]

// 3. Natural Language Job Creation (Enterprise Tier)
import { NaturalLanguageInterface } from '@/services/ai/NaturalLanguageInterface';

// User types plain English
const command = "Extract all Stripe payments over $10,000 from last month and save to BigQuery";

// AI generates job configuration
const jobConfig = await NaturalLanguageInterface.parse(command, {
  model: 'gpt-4', // Best for complex NL understanding
});

console.log('Generated job config:', jobConfig);
// Result:
// {
//   name: 'Stripe High-Value Payments Extraction',
//   dataSource: { type: 'stripe-api', ... },
//   filters: { amount: { $gt: 10000 }, date: { $gte: '2024-12-01', $lte: '2024-12-31' } },
//   destination: { type: 'bigquery', table: 'high_value_payments' },
//   schedule: 'once'
// }

await rpaEngine.scheduleJob(jobConfig); // ✅ Job created from natural language!

// 4. AI Cost Monitoring (Important!)
import { AIUsageTracker } from '@/services/ai/AIUsageTracker';

const usage = await AIUsageTracker.getMonthlyUsage();
console.log(\`AI calls this month: \${usage.calls}\`);
console.log(\`Estimated cost: $\${usage.estimatedCost}\`);
console.log(\`Remaining quota: \${usage.remainingCalls}\`);

// Set alerts for cost control
await AIUsageTracker.setAlert({
  type: 'monthly_cost',
  threshold: 50, // Alert if > $50/month
  action: 'email',
  recipients: ['admin@example.com'],
});`}
          </code>
        </div>
        <div className="mt-4 bg-yellow-100 p-4 rounded border border-yellow-300">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="text-sm text-gray-800">
              <strong>AI Tips:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Use DeepSeek for cost-effective data normalization (~$0.14/1M tokens)</li>
                <li>• Use Gemini for document/PDF extraction (~$0.075/1M tokens)</li>
                <li>• Use GPT-4 for complex reasoning and NL interface (~$2.50/1M tokens)</li>
                <li>• Enable <code>AI_DATA_MASKING=true</code> for banking compliance</li>
                <li>• Monitor costs with <code>AI_MAX_CALLS_PER_DAY</code> rate limiting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
