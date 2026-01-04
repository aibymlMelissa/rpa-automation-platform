/**
 * Banking Networks Supported Page
 * Shows available banking networks with clearinghouse warning
 */

import { getAllBankingNetworks, BANKING_NETWORKS } from '@/config/bankingNetworks';

export const metadata = {
  title: 'Supported Banking Networks | RPA Platform',
  description: 'Complete list of supported banking networks and integration options',
};

export default function BankingNetworksPage() {
  const availableNetworks = getAllBankingNetworks();
  const { paymentProcessors, sharedInfrastructure, directBanks } = BANKING_NETWORKS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Supported Banking Networks
          </h1>
          <p className="text-gray-300 text-lg">
            Complete list of banking networks available for RPA automation
          </p>
        </div>

        {/* Clearinghouse Warning */}
        <div className="card-glass border-2 border-yellow-500 bg-yellow-500/10 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-yellow-500 text-3xl">⚠️</div>
            <div>
              <h2 className="text-2xl font-bold text-yellow-500 mb-2">
                IMPORTANT: Clearinghouse Networks Reserved
              </h2>
              <p className="text-gray-200 mb-4">
                Clearinghouse networks (ACH/NACHA, SWIFT, FedWire, CHIPS) are <strong>RESERVED</strong> for
                the Banking Network Project and are <strong>NOT included</strong> in any pricing tier.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">✅ Available Services:</h3>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Payment Processors (Visa, Mastercard, PayPal, Stripe, Square)</li>
                    <li>• Shared Banking Infrastructure (FIS, Fiserv, Jack Henry, Temenos)</li>
                    <li>• Direct Bank Web Automation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">❌ NOT Included:</h3>
                  <ul className="text-gray-300 space-y-1">
                    <li>• ACH/NACHA Clearinghouse (reserved)</li>
                    <li>• SWIFT Network (reserved)</li>
                    <li>• FedWire (reserved)</li>
                    <li>• CHIPS (reserved)</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-300 mt-4 bg-blue-500/20 p-3 rounded">
                <strong>Alternative:</strong> Use FIS Global, Fiserv, or Jack Henry (Professional+ tiers)
                for API access to ACH and wire transfers without direct clearinghouse integration.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card bg-green-500/20 border-green-500">
            <div className="text-3xl font-bold text-green-400">{availableNetworks.length}</div>
            <div className="text-gray-300">Available Networks</div>
          </div>
          <div className="stat-card bg-blue-500/20 border-blue-500">
            <div className="text-3xl font-bold text-blue-400">{paymentProcessors.length}</div>
            <div className="text-gray-300">Payment Processors</div>
          </div>
          <div className="stat-card bg-purple-500/20 border-purple-500">
            <div className="text-3xl font-bold text-purple-400">{sharedInfrastructure.length}</div>
            <div className="text-gray-300">Banking Platforms</div>
          </div>
          <div className="stat-card bg-red-500/20 border-red-500">
            <div className="text-3xl font-bold text-red-400">4</div>
            <div className="text-gray-300">Reserved (Clearinghouses)</div>
          </div>
        </div>

        {/* Payment Processors */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-green-400">✅</span> Payment Processors
            <span className="badge-success text-sm ml-2">AVAILABLE - All Tiers</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {paymentProcessors.map((network) => (
              <div key={network.id} className="card-glass p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white">{network.name}</h3>
                  <span className="badge-success text-xs">{network.category}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-gray-400">Auth:</span>
                    {network.authMethods.map((method) => (
                      <span key={method} className="badge-primary text-xs">
                        {method}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-gray-400">Protocols:</span>
                    {network.protocols.map((protocol) => (
                      <span key={protocol} className="badge-secondary text-xs">
                        {protocol}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-gray-300 mt-3">
                    {network.capabilities.realTime && <span>⚡ Real-Time</span>}
                    {network.capabilities.batch && <span>📦 Batch</span>}
                    {network.capabilities.webhooks && <span>🔔 Webhooks</span>}
                  </div>
                  {network.documentationUrl && (
                    <a
                      href={network.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm inline-block mt-2"
                    >
                      📚 Documentation →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shared Infrastructure */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-green-400">✅</span> Shared Banking Infrastructure
            <span className="badge-primary text-sm ml-2">Professional+ Tiers</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sharedInfrastructure.map((network) => (
              <div key={network.id} className="card-glass p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white">{network.name}</h3>
                  <span className="badge-primary text-xs">{network.category}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-gray-400">Auth:</span>
                    {network.authMethods.map((method) => (
                      <span key={method} className="badge-primary text-xs">
                        {method}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-gray-400">Protocols:</span>
                    {network.protocols.map((protocol) => (
                      <span key={protocol} className="badge-secondary text-xs">
                        {protocol}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-gray-300 mt-3">
                    {network.capabilities.realTime && <span>⚡ Real-Time</span>}
                    {network.capabilities.batch && <span>📦 Batch</span>}
                    {network.capabilities.webhooks && <span>🔔 Webhooks</span>}
                  </div>
                  {network.documentationUrl && (
                    <a
                      href={network.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm inline-block mt-2"
                    >
                      📚 Documentation →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Direct Bank Automation */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-green-400">✅</span> Direct Bank Web Automation
            <span className="badge-success text-sm ml-2">AVAILABLE - All Tiers</span>
          </h2>
          <div className="card-glass p-6">
            <h3 className="text-xl font-bold text-white mb-3">Generic Bank Portal Template</h3>
            <p className="text-gray-300 mb-4">
              Web scraping automation for banks without API access using Puppeteer browser automation.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Features:</h4>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Username/Password + MFA authentication</li>
                  <li>• Custom CSS selector configuration</li>
                  <li>• Screenshot capture for debugging</li>
                  <li>• Session management and cookies</li>
                  <li>• Multi-page navigation support</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Best For:</h4>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Regional and community banks</li>
                  <li>• Credit unions without APIs</li>
                  <li>• Legacy banking systems</li>
                  <li>• Custom banking portals</li>
                  <li>• Partner bank integrations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Reserved Networks */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-red-400">🔒</span> Reserved Networks
            <span className="badge-danger text-sm ml-2">NOT AVAILABLE</span>
          </h2>
          <div className="card-glass border-2 border-red-500 bg-red-500/10 p-6">
            <p className="text-gray-200 mb-4">
              The following clearinghouse networks are reserved for the Banking Network Project
              technical development and require separate agreements:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {['ACH/NACHA', 'SWIFT Network', 'FedWire Funds Service', 'CHIPS'].map((name) => (
                <div key={name} className="bg-black/30 p-4 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 text-xl">🔒</span>
                    <span className="text-white font-semibold">{name}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Reserved for future technical integration</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-blue-500/20 p-4 rounded">
              <p className="text-gray-200 text-sm">
                <strong>For clearinghouse inquiries:</strong> Contact Banking Network Project team
                (separate from RPA platform pricing). Requires $500K+ annual commitment and 12-18 month development timeline.
              </p>
            </div>
          </div>
        </section>

        {/* Documentation Links */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="/docs/pricing" className="card-glass p-6 hover:border-blue-500 transition-colors">
              <h3 className="text-white font-bold mb-2">💰 Pricing & Budget</h3>
              <p className="text-gray-300 text-sm">View deployment tiers and pricing options (all in USD)</p>
            </a>
            <a href="/docs/setup" className="card-glass p-6 hover:border-blue-500 transition-colors">
              <h3 className="text-white font-bold mb-2">🔧 BigQuery & Power BI Setup</h3>
              <p className="text-gray-300 text-sm">Integration guide for analytics and reporting</p>
            </a>
            <a href="/docs/integrations" className="card-glass p-6 hover:border-blue-500 transition-colors">
              <h3 className="text-white font-bold mb-2">🤖 RPA Software Options</h3>
              <p className="text-gray-300 text-sm">UiPath and Robocorp integration details</p>
            </a>
          </div>
        </section>

        {/* Back Button */}
        <div className="text-center">
          <a
            href="/"
            className="btn-primary inline-block px-8 py-3"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
