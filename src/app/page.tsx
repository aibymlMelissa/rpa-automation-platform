import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="container-custom py-20">
        <header className="card-glass mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4 text-gradient">
            🤖 RPA Automation Platform
          </h1>
          <p className="subtitle text-xl">
            Enterprise-Grade Robotic Process Automation with AI-Powered Data Extraction
          </p>
          <p className="text-gray-600 mt-2">
            Banking Network Utility Operations
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Automation</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">3-Layer</div>
            <div className="stat-label">Architecture</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">AI-Powered</div>
            <div className="stat-label">Extraction</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">Enterprise</div>
            <div className="stat-label">Security</div>
          </div>
        </div>

        <div className="card-glass">
          <h2 className="text-2xl font-bold mb-6">System Status</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Next.js Server</span>
              </div>
              <span className="badge-success">Running</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Backend Core Services</span>
              </div>
              <span className="badge-info">Ready</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">WebSocket Server</span>
              </div>
              <span className="badge-warning">Not Started</span>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-3">🚀 Implementation Status</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Foundation Setup (Config, Types, Styles, Utils)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>WebSocket Infrastructure (Hook & Provider)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Jobs API Routes (Create, List, Get, Update, Delete)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Credentials API Routes (Create, List, Get, Update, Delete)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-600">⏳</span>
                <span>Extraction & Pipeline API Routes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-600">⏳</span>
                <span>WebSocket Server Implementation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-600">⏳</span>
                <span>UI Components & Pages</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">📋 API Endpoints Available</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>GET /api/jobs - List all jobs</li>
                <li>POST /api/jobs - Create new job</li>
                <li>GET /api/jobs/[id] - Get job details</li>
                <li>GET /api/credentials - List credentials</li>
                <li>POST /api/credentials - Create credential</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">🏦 Banking Networks Supported</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>Clearing Houses: ACH, SWIFT, FedWire, CHIPS</li>
                <li>Payment Processors: Visa, Mastercard, PayPal</li>
                <li>Shared Infrastructure: FIS, Fiserv, Jack Henry</li>
                <li>Direct Bank Web Automation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card-glass mt-8">
          <h2 className="text-2xl font-bold mb-4">🔒 Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Encryption</h4>
              <p className="text-sm text-gray-600">AES-256-GCM with PBKDF2 key derivation</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Audit Logging</h4>
              <p className="text-sm text-gray-600">Immutable JSONL logs with daily rotation</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Compliance</h4>
              <p className="text-sm text-gray-600">PCI-DSS, GDPR, SOC2, ISO27001</p>
            </div>
          </div>
        </div>

        <div className="card-glass mt-8 text-center">
          <p className="text-gray-600">
            Built with Next.js 14, TypeScript, React, TailwindCSS, and enterprise-grade security
          </p>
          <p className="text-sm text-gray-500 mt-2">
            For Banking Network Utility Operations
          </p>
        </div>
      </div>
    </div>
  );
}
