/**
 * RPA Software Integrations Page
 * UiPath and Robocorp integration options
 */

export const metadata = {
  title: 'RPA Software Integrations | RPA Platform',
  description: 'UiPath and Robocorp integration options with hybrid architecture',
};

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">
          RPA Software Integration Options
        </h1>
        <p className="text-gray-800 text-lg mb-8">
          Choose between internal automation, UiPath, or Robocorp - or use a hybrid approach for optimal cost and performance
        </p>

        {/* Hybrid Architecture Overview */}
        <div className="bg-blue-50 shadow-lg rounded-lg p-6 mb-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Hybrid Architecture (Recommended)</h2>
          <p className="text-gray-700 mb-4">
            The platform intelligently routes jobs to the best automation engine based on complexity scoring (0-10 scale):
          </p>
          <div className="flow-diagram mb-6">
            <div className="flow-step bg-blue-100 border-blue-400">
              <div className="text-orange-600 font-bold">Incoming Job</div>
              <div className="text-red-600 text-sm">Analyze complexity</div>
            </div>
            <div className="text-gray-700 text-2xl">↓</div>
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="flow-step bg-green-100 border-green-400">
                <div className="text-orange-600 font-bold">Simple (0-3)</div>
                <div className="text-red-600 text-sm">Internal Engine</div>
                <div className="text-green-600 text-xs">80% of jobs</div>
              </div>
              <div className="flow-step bg-yellow-100 border-yellow-400">
                <div className="text-orange-600 font-bold">Medium (4-6)</div>
                <div className="text-red-600 text-sm">Robocorp Cloud</div>
                <div className="text-yellow-700 text-xs">15% of jobs</div>
              </div>
              <div className="flow-step bg-red-100 border-red-400">
                <div className="text-orange-600 font-bold">Complex (7-10)</div>
                <div className="text-red-600 text-sm">UiPath Orchestrator</div>
                <div className="text-red-700 text-xs">5% of jobs</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 p-4 rounded border border-blue-300">
            <h3 className="text-red-600 font-semibold mb-2">Complexity Scoring Factors:</h3>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• <strong>+2 points:</strong> CAPTCHA challenges</li>
              <li>• <strong>+2 points:</strong> Document AI processing (OCR, extraction)</li>
              <li>• <strong>+1 point:</strong> Multi-step MFA (hardware tokens, SMS codes)</li>
              <li>• <strong>+1 point:</strong> Certificate-based authentication (x509, mTLS)</li>
              <li>• <strong>+1 point:</strong> Multi-page navigation (5+ pages)</li>
              <li>• <strong>+1 point:</strong> JavaScript-heavy SPAs</li>
              <li>• <strong>+1 point:</strong> File upload requirements</li>
              <li>• <strong>+1 point:</strong> Custom protocol handling (FIX, ISO20022)</li>
            </ul>
          </div>
        </div>

        {/* Option 1: UiPath */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
            <span className="text-purple-600">🤖</span> Option 1: UiPath Orchestrator
            <span className="badge-primary text-sm ml-2">Enterprise-Grade</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 shadow-lg rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-orange-600 mb-3">Overview</h3>
              <p className="text-gray-700 mb-4">
                Industry-leading enterprise RPA platform with advanced AI capabilities, perfect for complex automation scenarios.
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="text-red-600 font-semibold mb-2">Best For:</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Complex multi-step workflows</li>
                    <li>• CAPTCHA and bot detection bypass</li>
                    <li>• Document AI (intelligent OCR)</li>
                    <li>• Legacy system integration</li>
                    <li>• High-security environments</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-600 font-semibold mb-2">Key Features:</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Computer Vision AI for element detection</li>
                    <li>• Certificate-based authentication (x509, mTLS)</li>
                    <li>• ISO20022 and FIX protocol parsers</li>
                    <li>• Enterprise-grade orchestration</li>
                    <li>• Built-in compliance controls</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 shadow-lg rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-orange-600 mb-3">Pricing (USD/month)</h3>
              <div className="space-y-4">
                <div className="bg-purple-100 p-4 rounded border border-purple-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">UiPath Studio Pro</span>
                    <span className="text-gray-800 font-bold">$420/month</span>
                  </div>
                  <div className="text-red-600 text-xs">Per developer license</div>
                </div>
                <div className="bg-purple-100 p-4 rounded border border-purple-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">UiPath Orchestrator</span>
                    <span className="text-gray-800 font-bold">$1,500/month</span>
                  </div>
                  <div className="text-red-600 text-xs">Standard tier (10 robots)</div>
                </div>
                <div className="bg-purple-100 p-4 rounded border border-purple-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">UiPath AI Center</span>
                    <span className="text-gray-800 font-bold">$2,000/month</span>
                  </div>
                  <div className="text-red-600 text-xs">Document AI + ML models</div>
                </div>
                <div className="bg-purple-100 p-4 rounded border border-purple-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Additional Robots</span>
                    <span className="text-gray-800 font-bold">$280/month</span>
                  </div>
                  <div className="text-red-600 text-xs">Per unattended robot</div>
                </div>
                <div className="border-t border-purple-500 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-bold text-lg">Total (Basic Setup)</span>
                    <span className="text-purple-600 font-bold text-2xl">$4,200/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Option 2: Robocorp */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
            <span className="text-blue-600">🐍</span> Option 2: Robocorp Cloud
            <span className="badge-success text-sm ml-2">Cloud-Native</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 shadow-lg rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-orange-600 mb-3">Overview</h3>
              <p className="text-gray-700 mb-4">
                Modern Python-based RPA platform with cloud-native architecture, ideal for API-heavy and cost-sensitive projects.
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="text-red-600 font-semibold mb-2">Best For:</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• API-first automation</li>
                    <li>• Python-heavy workflows</li>
                    <li>• Cloud-native deployments</li>
                    <li>• DevOps integration (CI/CD)</li>
                    <li>• Cost-sensitive projects</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-600 font-semibold mb-2">Key Features:</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Python Robot Framework</li>
                    <li>• REST API-first architecture</li>
                    <li>• Real-time webhook notifications</li>
                    <li>• Git-based version control</li>
                    <li>• Serverless execution (pay-per-use)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 shadow-lg rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-orange-600 mb-3">Pricing (USD/month)</h3>
              <div className="space-y-4">
                <div className="bg-blue-100 p-4 rounded border border-blue-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Robocorp Cloud Starter</span>
                    <span className="text-gray-800 font-bold">$0/month</span>
                  </div>
                  <div className="text-red-600 text-xs">5,000 run minutes/month included</div>
                </div>
                <div className="bg-blue-100 p-4 rounded border border-blue-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Robocorp Cloud Pro</span>
                    <span className="text-gray-800 font-bold">$99/month</span>
                  </div>
                  <div className="text-red-600 text-xs">50,000 run minutes/month</div>
                </div>
                <div className="bg-blue-100 p-4 rounded border border-blue-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Additional Minutes</span>
                    <span className="text-gray-800 font-bold">$0.002/min</span>
                  </div>
                  <div className="text-red-600 text-xs">Pay-as-you-go pricing</div>
                </div>
                <div className="bg-blue-100 p-4 rounded border border-blue-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Premium Support</span>
                    <span className="text-gray-800 font-bold">$99/month</span>
                  </div>
                  <div className="text-red-600 text-xs">Priority support + SLA</div>
                </div>
                <div className="border-t border-blue-500 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-bold text-lg">Total (Typical Usage)</span>
                    <span className="text-blue-600 font-bold text-2xl">$198/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Comparison */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Cost Comparison (USD/month)</h2>
          <div className="bg-blue-50 shadow-lg rounded-lg p-6 border-2 border-blue-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-3 px-4 text-orange-600 font-semibold">Strategy</th>
                    <th className="py-3 px-4 text-orange-600 font-semibold">Monthly Cost (USD)</th>
                    <th className="py-3 px-4 text-orange-600 font-semibold">Job Distribution</th>
                    <th className="py-3 px-4 text-orange-600 font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-orange-600">Internal Only</span>
                      <div className="text-xs text-red-600">Platform built-in</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 font-bold">$0</span>
                      <div className="text-xs text-red-600">Included in platform</div>
                    </td>
                    <td className="py-3 px-4">100% internal automation</td>
                    <td className="py-3 px-4">Simple API calls, basic web scraping</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-orange-600">Robocorp Only</span>
                      <div className="text-xs text-red-600">Cloud-native</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-blue-600 font-bold">$198</span>
                      <div className="text-xs text-red-600">Pro plan + support</div>
                    </td>
                    <td className="py-3 px-4">100% Robocorp</td>
                    <td className="py-3 px-4">API-first, Python workflows, medium complexity</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-orange-600">Hybrid (Recommended)</span>
                      <div className="text-xs text-red-600">Intelligent routing</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-yellow-700 font-bold">$700</span>
                      <div className="text-xs text-red-600">Robocorp Pro + minimal UiPath</div>
                    </td>
                    <td className="py-3 px-4">80% internal, 15% Robocorp, 5% UiPath</td>
                    <td className="py-3 px-4">Optimal cost/performance balance</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-orange-600">UiPath Only</span>
                      <div className="text-xs text-red-600">Enterprise-grade</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-red-700 font-bold">$4,200</span>
                      <div className="text-xs text-red-600">Studio + Orchestrator + AI</div>
                    </td>
                    <td className="py-3 px-4">100% UiPath</td>
                    <td className="py-3 px-4">Maximum automation capability, high complexity</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-green-100 p-4 rounded text-center border border-green-300">
                <div className="text-2xl font-bold text-green-600">83% savings</div>
                <div className="text-gray-700 text-sm">Hybrid vs UiPath-only</div>
              </div>
              <div className="bg-blue-100 p-4 rounded text-center border border-blue-300">
                <div className="text-2xl font-bold text-blue-600">15x ROI</div>
                <div className="text-gray-700 text-sm">First-year returns (typical)</div>
              </div>
              <div className="bg-purple-100 p-4 rounded text-center border border-purple-300">
                <div className="text-2xl font-bold text-purple-600">2-4 weeks</div>
                <div className="text-gray-700 text-sm">Implementation time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Code Examples */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Integration Setup</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 shadow-lg rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-red-600 font-semibold mb-3">Environment Variables</h3>
              <div className="code-block">
                <code className="text-green-700 text-xs">
{`# UiPath Orchestrator
UIPATH_ORCHESTRATOR_URL=https://cloud.uipath.com
UIPATH_TENANT_NAME=Default
UIPATH_CLIENT_ID=your-client-id
UIPATH_CLIENT_SECRET=your-client-secret

# Robocorp Cloud
ROBOCORP_API_URL=https://api.eu1.robocorp.com
ROBOCORP_WORKSPACE_ID=your-workspace-id
ROBOCORP_API_KEY=your-api-key`}
                </code>
              </div>
            </div>

            <div className="bg-blue-50 shadow-lg rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-red-600 font-semibold mb-3">Automatic Job Routing</h3>
              <div className="code-block">
                <code className="text-green-700 text-xs">
{`// Platform automatically routes based on complexity
await rpaEngine.extractData({
  sourceId: 'bank-portal',
  dataType: 'transactions',
  extractionConfig: {
    authMethod: 'username-password-mfa',
    hasCaptcha: true,  // +2 points → UiPath
    requiresDocumentAI: true  // +2 points
  }
});
// Score: 5 → Routes to Robocorp
// Score: 7+ → Routes to UiPath`}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Technical Architecture</h2>
          <div className="bg-blue-50 shadow-lg rounded-lg p-6 border-2 border-blue-200">
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────┐
│                         RPA Platform                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              RPAEngine (Intelligent Router)              │  │
│  │                                                           │  │
│  │  calculateComplexityScore() → decideDelegation()        │  │
│  └──────────────┬───────────────┬───────────────┬───────────┘  │
│                 │               │               │              │
│        Score 0-3│      Score 4-6│      Score 7-10             │
│                 ▼               ▼               ▼              │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │   Internal   │  │ Robocorp   │  │  UiPath Orchestrator │  │
│  │  Automation  │  │  Connector │  │     Connector        │  │
│  │              │  │            │  │                      │  │
│  │ • Puppeteer  │  │ • REST API │  │ • Certificate Auth   │  │
│  │ • API calls  │  │ • Webhooks │  │ • Computer Vision    │  │
│  │ • Redis      │  │ • Python   │  │ • Document AI        │  │
│  └──────────────┘  └────────────┘  └──────────────────────┘  │
│         │                │                    │                │
│         └────────────────┴────────────────────┘                │
│                          │                                     │
│                          ▼                                     │
│              ┌────────────────────────┐                        │
│              │    Banking Networks    │                        │
│              │ • Payment Processors   │                        │
│              │ • Shared Infrastructure│                        │
│              │ • Direct Bank Portals  │                        │
│              └────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </section>

        {/* Implementation Timeline */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Implementation Timeline</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-50 shadow-lg rounded-lg p-4 border-2 border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">Week 1</div>
              <h3 className="text-orange-600 font-semibold mb-2">Setup</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Configure API credentials</li>
                <li>• Test connectivity</li>
                <li>• Deploy connectors</li>
              </ul>
            </div>
            <div className="bg-blue-50 shadow-lg rounded-lg p-4 border-2 border-blue-200">
              <div className="text-3xl font-bold text-green-600 mb-2">Week 2</div>
              <h3 className="text-orange-600 font-semibold mb-2">Integration</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Build automation workflows</li>
                <li>• Configure routing logic</li>
                <li>• Test complexity scoring</li>
              </ul>
            </div>
            <div className="bg-blue-50 shadow-lg rounded-lg p-4 border-2 border-blue-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">Week 3</div>
              <h3 className="text-orange-600 font-semibold mb-2">Testing</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• End-to-end testing</li>
                <li>• Performance tuning</li>
                <li>• Error handling</li>
              </ul>
            </div>
            <div className="bg-blue-50 shadow-lg rounded-lg p-4 border-2 border-blue-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">Week 4</div>
              <h3 className="text-orange-600 font-semibold mb-2">Production</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Go-live preparation</li>
                <li>• Monitoring setup</li>
                <li>• Team training</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Documentation Links */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="/docs/networks" className="bg-blue-50 shadow-lg rounded-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <h3 className="text-orange-600 font-bold mb-2">🌐 Banking Networks</h3>
              <p className="text-gray-700 text-sm">Supported payment processors and banking platforms</p>
            </a>
            <a href="/docs/setup" className="bg-blue-50 shadow-lg rounded-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <h3 className="text-orange-600 font-bold mb-2">🔧 BigQuery & Power BI Setup</h3>
              <p className="text-gray-700 text-sm">Analytics and reporting integration guide</p>
            </a>
            <a href="/docs/pricing" className="bg-blue-50 shadow-lg rounded-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <h3 className="text-orange-600 font-bold mb-2">💰 Pricing & Budget</h3>
              <p className="text-gray-700 text-sm">Complete deployment tier pricing (all in USD)</p>
            </a>
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
