import DocumentationLinks from '@/components/DocumentationLinks';
import SystemInformation from '@/components/SystemInformation';

export default function HomePage() {
  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="stat-number">Daily</div>
          <div className="stat-label">Bank Business Day End Automation</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">4-Layer</div>
          <div className="stat-label">AI Architecture</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">Hybrid AI</div>
          <div className="stat-label">CV + GenAI</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">Enterprise</div>
          <div className="stat-label">Security</div>
        </div>
      </div>

      {/* Data Flow Diagram */}
      <div className="card-glass mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🔄 Automated Data Flow</h2>
        <div className="flow-diagram">
          <div className="flow-step">Bank Data Source</div>
          <div className="flow-step">Extraction</div>
          <div className="flow-step">Validation</div>
          <div className="flow-step">Transformation</div>
          <div className="flow-step">Load to ERP</div>
          <div className="flow-step">Reporting</div>
        </div>
      </div>

      {/* Core Capabilities */}
      <div className="card-glass mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">💡 Core Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Web Automation</h3>
            <p className="text-gray-600 text-sm mb-4">
              Headless browser automation using Puppeteer/Playwright with intelligent form detection and AI-powered element selection
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Multi-tab session management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Dynamic element detection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Screenshot & PDF capture</span>
              </li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Hybrid AI Integration</h3>
            <p className="text-gray-600 text-sm mb-4">
              Combines TensorFlow.js computer vision with generative AI (GPT-4, Gemini, DeepSeek) for intelligent automation
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Adaptive selector recovery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Smart data normalization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Natural language interface</span>
              </li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Enterprise Security</h3>
            <p className="text-gray-600 text-sm mb-4">
              Bank-grade security with AES-256-GCM encryption, credential vaulting, and comprehensive audit logging
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>End-to-end encryption</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Role-based access control</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Compliance ready (PCI-DSS, GDPR)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Banking Networks Supported */}
      <div className="card-glass mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🏦 Banking Networks Supported</h2>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment Processors & Infrastructure</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl">💳</span>
              <div>
                <div className="font-medium text-gray-800">Payment Processors</div>
                <div className="text-sm text-gray-600">Visa, Mastercard, PayPal, Stripe (All Tiers)</div>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl">🌐</span>
              <div>
                <div className="font-medium text-gray-800">Direct Bank Access</div>
                <div className="text-sm text-gray-600">Web automation, Email/SMS download, Manual hardcopy OCR (All Tiers)</div>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl">🔧</span>
              <div>
                <div className="font-medium text-gray-800">Shared Banking Infrastructure</div>
                <div className="text-sm text-gray-600">FIS Global, Fiserv, Jack Henry, Temenos (Professional+ Tiers)</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Documentation Links */}
      <DocumentationLinks />

      {/* System Information */}
      <SystemInformation />
    </>
  );
}
