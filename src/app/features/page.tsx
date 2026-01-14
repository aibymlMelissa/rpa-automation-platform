export default function FeaturesPage() {
  return (
    <>
      {/* Page Title */}
      <div className="card-glass mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Platform Features</h1>
        <p className="text-gray-600 text-lg">
          Comprehensive RPA capabilities for enterprise banking operations
        </p>
      </div>

      {/* Core Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Data Extraction */}
        <div className="feature-card">
          <div className="feature-icon">🔌</div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">Data Extraction</h3>
          <p className="text-gray-600 text-sm mb-4">
            Multi-protocol support for web automation and API integration
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Web automation with Puppeteer/Playwright</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>REST API with OAuth 2.0, JWT authentication</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>SOAP/XML and FIX Protocol support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Email/SMS file download automation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>OCR for hardcopy document processing</span>
            </li>
          </ul>
        </div>

        {/* Computer Vision AI */}
        <div className="feature-card">
          <div className="feature-icon">👁️</div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">Computer Vision AI (TensorFlow.js)</h3>
          <p className="text-gray-600 text-sm mb-4">
            Local AI-powered computer vision for fast, zero-latency data extraction
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Layout analysis and visual pattern recognition</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>OCR (Optical Character Recognition) for text extraction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Table structure detection and data extraction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>CAPTCHA solving with ML models</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Local processing - no external API calls</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Available in all tiers</span>
            </li>
          </ul>
        </div>

        {/* Generative AI */}
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">Generative AI (Professional+ Tiers)</h3>
          <p className="text-gray-600 text-sm mb-4">
            Advanced LLM-powered automation with GPT-4, Gemini, DeepSeek, or local models
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-600">⚡</span>
              <span>Adaptive selector recovery when portals change</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">⚡</span>
              <span>Smart data normalization for inconsistent formats</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">⚡</span>
              <span>Error interpretation and auto-recovery suggestions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">⚡</span>
              <span>Document understanding (PDFs, invoices, statements)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">⚡</span>
              <span>Natural language job creation interface</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">⚡</span>
              <span>Context-aware validation and anomaly detection</span>
            </li>
          </ul>
        </div>

        {/* Job Scheduling & Processing */}
        <div className="feature-card">
          <div className="feature-icon">⚙️</div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">Job Scheduling & Processing</h3>
          <p className="text-gray-600 text-sm mb-4">
            Automated scheduling and ETL pipeline with queue management
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Cron-based scheduling with BullMQ queues</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Automatic retry & error handling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Data validation & transformation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Batch processing with progress tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Load to PostgreSQL & Dynamic SL</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Enterprise Security - Customizable for Client Needs */}
      <div className="card-glass mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🔒 Enterprise Security</h2>
        <p className="text-gray-600 mb-6">
          Bank-grade security framework customizable to your organization's requirements and compliance needs
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Data Protection</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• AES-256-GCM encryption at rest</li>
              <li>• TLS 1.3 encryption in transit</li>
              <li>• Secure credential vaulting</li>
              <li>• PBKDF2 key derivation (100K+ iterations)</li>
              <li>• Automatic credential rotation</li>
            </ul>
          </div>

          <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Authentication & Access</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• OAuth 2.0, JWT, API Keys</li>
              <li>• Certificate-based (X.509, mTLS)</li>
              <li>• Multi-factor authentication (TOTP, SMS, Email)</li>
              <li>• Role-based access control (RBAC)</li>
              <li>• Single Sign-On (SSO) integration</li>
            </ul>
          </div>

          <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-l-4 border-green-500">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Audit & Compliance</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Immutable audit logs</li>
              <li>• Tamper detection & alerts</li>
              <li>• PCI-DSS compliance ready</li>
              <li>• GDPR data protection</li>
              <li>• SOC 2, ISO 27001 frameworks</li>
            </ul>
          </div>

          <div className="p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-l-4 border-yellow-500">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Network Security</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Private VPC deployment</li>
              <li>• IP whitelisting</li>
              <li>• Firewall rules customization</li>
              <li>• DDoS protection</li>
              <li>• Network isolation</li>
            </ul>
          </div>

          <div className="p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-l-4 border-red-500">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Monitoring & Alerts</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Real-time security monitoring</li>
              <li>• Intrusion detection</li>
              <li>• Anomaly detection with AI</li>
              <li>• Automated incident response</li>
              <li>• Security event notifications</li>
            </ul>
          </div>

          <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border-l-4 border-indigo-500">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Enterprise Options</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• On-premise deployment</li>
              <li>• Air-gapped environment support</li>
              <li>• Custom security policies</li>
              <li>• Penetration testing support</li>
              <li>• Dedicated security team</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Security features can be customized based on your organization's specific requirements, compliance obligations, and industry regulations. Contact us to discuss your security needs.
          </p>
        </div>
      </div>

      {/* Real-time Features */}
      <div className="card-glass mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Real-time Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📡</div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">WebSocket Events</h3>
            <p className="text-sm text-gray-600">
              Live updates for job status, extraction progress, and pipeline stages
            </p>
          </div>

          <div className="text-center p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">Progress Tracking</h3>
            <p className="text-sm text-gray-600">
              Processing progress bars and status indicators for all operations
            </p>
          </div>

          <div className="text-center p-6">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">Notifications</h3>
            <p className="text-sm text-gray-600">
              Toast notifications for job completion, errors, and system alerts
            </p>
          </div>
        </div>
      </div>

      {/* Banking Network Support */}
      <div className="card-glass">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Banking Network Coverage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-bold text-gray-800 mb-2">Payment Processors</h3>
            <p className="text-sm text-gray-600 mb-2">Visa, Mastercard, PayPal, Stripe</p>
            <span className="badge-success text-xs">All Tiers</span>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="font-bold text-gray-800 mb-2">Direct Bank Access</h3>
            <p className="text-sm text-gray-600 mb-2">Web automation, Email/SMS download, Manual hardcopy OCR</p>
            <span className="badge-success text-xs">All Tiers</span>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <div className="text-3xl mb-3">🔧</div>
            <h3 className="font-bold text-gray-800 mb-2">Shared Banking Infrastructure</h3>
            <p className="text-sm text-gray-600 mb-2">FIS Global, Fiserv, Jack Henry, Temenos</p>
            <span className="badge-primary text-xs">Professional+ Tiers</span>
          </div>
        </div>
      </div>
    </>
  );
}
