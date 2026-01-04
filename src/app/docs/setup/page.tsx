/**
 * BigQuery & Power BI Setup Page
 * Instructions for connecting analytics and reporting
 */

export const metadata = {
  title: 'BigQuery & Power BI Setup | RPA Platform',
  description: 'Complete guide for connecting Power BI to BigQuery data warehouse',
};

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">
          BigQuery & Power BI Setup
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Connect Power BI to your BigQuery data warehouse for real-time analytics
        </p>

        {/* Quick Start */}
        <div className="card-glass p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Start (3 Steps)</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-500/20 p-4 rounded">
              <div className="text-3xl font-bold text-blue-400 mb-2">1</div>
              <h3 className="text-white font-semibold mb-2">Setup BigQuery</h3>
              <p className="text-gray-300 text-sm">Create dataset and tables</p>
              <code className="block mt-2 text-xs bg-black/50 p-2 rounded text-green-400">
                tsx server/database/bigquery-setup.ts
              </code>
            </div>
            <div className="bg-blue-500/20 p-4 rounded">
              <div className="text-3xl font-bold text-blue-400 mb-2">2</div>
              <h3 className="text-white font-semibold mb-2">Migrate Data</h3>
              <p className="text-gray-300 text-sm">Load historical data</p>
              <code className="block mt-2 text-xs bg-black/50 p-2 rounded text-green-400">
                tsx server/database/migrate-to-warehouse.ts
              </code>
            </div>
            <div className="bg-blue-500/20 p-4 rounded">
              <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
              <h3 className="text-white font-semibold mb-2">Connect Power BI</h3>
              <p className="text-gray-300 text-sm">Use BigQuery connector</p>
              <code className="block mt-2 text-xs bg-black/50 p-2 rounded text-green-400">
                DirectQuery mode
              </code>
            </div>
          </div>
        </div>

        {/* Architecture */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Architecture Overview</h2>
          <div className="card-glass p-6">
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`Banking Networks → RPA Engine → ETL Pipeline → BigQuery
                                                    ↓
                                           Power BI Dashboards`}
            </pre>
          </div>
        </section>

        {/* Prerequisites */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Prerequisites</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-glass p-4">
              <h3 className="text-white font-bold mb-2">✅ Required</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• GCP account with billing enabled</li>
                <li>• BigQuery API enabled</li>
                <li>• Service account with dataViewer + jobUser roles</li>
                <li>• Power BI Desktop or Pro license</li>
                <li>• Environment variables configured</li>
              </ul>
            </div>
            <div className="card-glass p-4">
              <h3 className="text-white font-bold mb-2">📝 Environment Variables</h3>
              <code className="block text-xs bg-black/50 p-3 rounded text-green-400">
                {`GCP_PROJECT_ID=your-project\nGCP_KEY_FILE=./credentials/gcp.json\nBQ_DATASET=rpa_warehouse\nBQ_LOCATION=US`}
              </code>
            </div>
          </div>
        </section>

        {/* BigQuery Setup */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Step 1: BigQuery Setup</h2>
          <div className="card-glass p-6">
            <h3 className="text-white font-semibold mb-3">Create Data Warehouse Schema</h3>
            <div className="bg-black/50 p-4 rounded mb-4">
              <code className="text-green-400 text-sm">
                $ tsx server/database/bigquery-setup.ts
              </code>
            </div>
            <p className="text-gray-300 mb-4">This creates:</p>
            <ul className="text-gray-300 space-y-2 ml-4">
              <li>• <strong>Fact Tables:</strong> fact_banking_transactions, fact_job_executions, fact_audit_logs, fact_etl_pipeline_jobs</li>
              <li>• <strong>Dimensions:</strong> dim_jobs, dim_banking_networks, dim_users, dim_date</li>
              <li>• <strong>Materialized Views:</strong> Daily summaries, job performance, network metrics</li>
              <li>• <strong>Partitioning:</strong> By date for cost optimization</li>
              <li>• <strong>Clustering:</strong> By frequently queried fields</li>
            </ul>
          </div>
        </section>

        {/* Data Migration */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Step 2: Migrate Historical Data</h2>
          <div className="card-glass p-6">
            <h3 className="text-white font-semibold mb-3">Load Existing Data</h3>
            <div className="bg-black/50 p-4 rounded mb-4">
              <code className="text-green-400 text-sm">
                $ tsx server/database/migrate-to-warehouse.ts
              </code>
            </div>
            <p className="text-gray-300 mb-4">This migrates:</p>
            <ul className="text-gray-300 space-y-1 ml-4 text-sm">
              <li>• Audit logs from JSONL files (last 90 days)</li>
              <li>• Job execution history from Redis</li>
              <li>• Banking network metadata</li>
              <li>• Date dimension (2020-2030)</li>
            </ul>
          </div>
        </section>

        {/* Power BI Connection */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Step 3: Connect Power BI</h2>
          <div className="card-glass p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Connection Steps:</h3>
                <ol className="text-gray-300 space-y-2 text-sm list-decimal ml-4">
                  <li>Open Power BI Desktop</li>
                  <li>Get Data → More → Google BigQuery</li>
                  <li>Select "Service Account" authentication</li>
                  <li>Upload your GCP service account JSON key</li>
                  <li>Select dataset: rpa_warehouse</li>
                  <li>Choose DirectQuery mode (real-time)</li>
                  <li>Select tables and create relationships</li>
                </ol>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Recommended Settings:</h3>
                <div className="bg-blue-500/20 p-4 rounded space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Storage Mode:</span>
                    <span className="text-white font-semibold">DirectQuery</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Refresh Rate:</span>
                    <span className="text-white font-semibold">Real-time</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Date Filter:</span>
                    <span className="text-white font-semibold">Last 30 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Query Timeout:</span>
                    <span className="text-white font-semibold">600 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pre-Built Dashboards */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Pre-Built Dashboards</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Executive Overview', metrics: 'TX volume, success rates, network performance', icon: '📊' },
              { name: 'Operational Monitoring', metrics: 'Real-time jobs, active queues, error distribution', icon: '⚡' },
              { name: 'Compliance & Audit', metrics: 'Audit events, failed operations, compliance scores', icon: '🔒' },
              { name: 'Network Performance', metrics: 'Latency, uptime, peak hours, throughput', icon: '🌐' },
            ].map((dashboard) => (
              <div key={dashboard.name} className="card-glass p-4">
                <div className="text-3xl mb-2">{dashboard.icon}</div>
                <h3 className="text-white font-bold mb-2">{dashboard.name}</h3>
                <p className="text-gray-300 text-sm">{dashboard.metrics}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cost Estimate */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Cost Estimate (USD/month)</h2>
          <div className="card-glass p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">$10</div>
                <div className="text-gray-300 text-sm">Storage (500GB)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">$10</div>
                <div className="text-gray-300 text-sm">Queries (2TB)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">$150</div>
                <div className="text-gray-300 text-sm">Streaming (3TB)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">$50</div>
                <div className="text-gray-300 text-sm">Power BI Pro (5 users)</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-600 text-center">
              <div className="text-3xl font-bold text-white">~$220/month</div>
              <div className="text-gray-400 text-sm">(Professional tier analytics)</div>
            </div>
          </div>
        </section>

        {/* Documentation Links */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Detailed Documentation</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-glass p-4">
              <h3 className="text-white font-bold mb-2">📚 Complete Guides</h3>
              <ul className="space-y-2">
                <li><a href="/docs/POWER_BI_SETUP.md" className="text-blue-400 hover:text-blue-300 text-sm">Power BI Setup Guide</a></li>
                <li><a href="/docs/POWER_BI_DASHBOARDS.md" className="text-blue-400 hover:text-blue-300 text-sm">Dashboard Templates</a></li>
                <li><a href="/docs/PHASE_3_IMPLEMENTATION.md" className="text-blue-400 hover:text-blue-300 text-sm">Phase 3 Features</a></li>
                <li><a href="/docs/BIGQUERY_ARCHITECTURE_DIAGRAM.md" className="text-blue-400 hover:text-blue-300 text-sm">Architecture Diagram</a></li>
              </ul>
            </div>
            <div className="card-glass p-4">
              <h3 className="text-white font-bold mb-2">🔗 Related Pages</h3>
              <ul className="space-y-2">
                <li><a href="/docs/networks" className="text-blue-400 hover:text-blue-300 text-sm">Banking Networks</a></li>
                <li><a href="/docs/pricing" className="text-blue-400 hover:text-blue-300 text-sm">Pricing & Budget</a></li>
                <li><a href="/docs/integrations" className="text-blue-400 hover:text-blue-300 text-sm">RPA Software Options</a></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Back Button */}
        <div className="text-center">
          <a href="/" className="btn-primary inline-block px-8 py-3">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
