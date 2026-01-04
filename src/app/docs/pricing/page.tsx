/**
 * Pricing & Budget Options Page
 * All pricing tiers in USD
 */

export const metadata = {
  title: 'Pricing & Budget Options | RPA Platform',
  description: 'Complete pricing guide with 4 deployment tiers (all prices in USD)',
};

export default function PricingPage() {
  const tiers = [
    {
      name: 'Starter',
      price: '$105',
      setup: '$12',
      best: 'Small banks, credit unions',
      networks: '1-3',
      txPerDay: '10K',
      users: '5',
      support: 'Community',
      features: [
        'Internal automation only',
        'PostgreSQL analytics',
        'Basic dashboards',
        '99% uptime SLA',
        '90-day data retention',
      ],
      roi: '28,700% annual ROI',
      payback: '1.2 days',
    },
    {
      name: 'Professional',
      price: '$1,167',
      setup: '$10,100',
      best: 'Mid-market banks, processors',
      networks: '5-10',
      txPerDay: '100K',
      users: '25',
      support: '8x5 Email',
      features: [
        'Robocorp Cloud (10K runs)',
        'BigQuery warehouse (1TB)',
        'Power BI Pro (5 users)',
        '99.5% uptime SLA',
        '1-year data retention',
        'SOC 2 compliance tracking',
      ],
      roi: '510% annual ROI',
      payback: '1.7 months',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$12,950',
      setup: '$125,000',
      best: 'Large banks, clearinghouses',
      networks: '20+',
      txPerDay: '1M+',
      users: '500',
      support: '24/7 Priority',
      features: [
        'UiPath (5 robots) + Robocorp (50K)',
        'BigQuery Enterprise (10TB)',
        'Power BI Premium',
        '99.9% uptime SLA',
        'Unlimited data retention',
        'SOC 2 + PCI-DSS + ISO 27001',
        'Multi-region deployment',
        'Disaster recovery',
      ],
      roi: '670% annual ROI',
      payback: '1.4 months',
    },
    {
      name: 'Enterprise Plus',
      price: '$69,575',
      setup: '$650,000',
      best: 'Multi-tenant SaaS providers',
      networks: 'Unlimited',
      txPerDay: '10M+',
      users: '10,000+',
      support: '24/7 NOC + Custom Dev',
      features: [
        'UiPath (25 robots) + Robocorp (500K)',
        'Multi-tenant architecture',
        'White-label capabilities',
        'BigQuery Enterprise (100TB)',
        'Power BI Embedded + Looker',
        '99.99% uptime (active-active)',
        'Custom development (40 hrs/month)',
        'Executive sponsor',
      ],
      roi: '72% gross margin',
      payback: '3.6 months (50 clients)',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Pricing & Budget Options
          </h1>
          <p className="text-gray-300 text-xl mb-2">
            4 deployment tiers to fit your needs and budget
          </p>
          <p className="text-yellow-400 font-semibold text-lg">
            💵 All prices in USD (United States Dollars)
          </p>
        </div>

        {/* Clearinghouse Warning */}
        <div className="card-glass border-2 border-yellow-500 bg-yellow-500/10 p-6 mb-12">
          <h2 className="text-xl font-bold text-yellow-500 mb-2">
            ⚠️ Important: Clearinghouse Networks NOT Included
          </h2>
          <p className="text-gray-200 mb-3">
            ACH/NACHA, SWIFT, FedWire, and CHIPS clearinghouses are <strong>RESERVED</strong> for the Banking Network Project
            and are <strong>NOT included</strong> in any pricing tier.
          </p>
          <p className="text-gray-300 text-sm">
            <strong>For ACH/Wire capabilities:</strong> Use FIS Global, Fiserv, or Jack Henry (Professional+ tiers)
            for API access to ACH and wire transfers without direct clearinghouse integration.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`card-glass p-6 relative ${
                tier.popular ? 'border-2 border-blue-500 scale-105' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="badge-primary px-4 py-1">Most Popular</span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
              <div className="mb-4">
                <div className="text-4xl font-bold text-blue-400">{tier.price}</div>
                <div className="text-gray-400 text-sm">per month (USD)</div>
                <div className="text-gray-400 text-xs mt-1">Setup: {tier.setup}</div>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <div className="text-gray-400 text-xs">Best For</div>
                  <div className="text-white text-sm font-semibold">{tier.best}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-gray-400">Networks</div>
                    <div className="text-white font-semibold">{tier.networks}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">TX/Day</div>
                    <div className="text-white font-semibold">{tier.txPerDay}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Users</div>
                    <div className="text-white font-semibold">{tier.users}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Support</div>
                    <div className="text-white font-semibold">{tier.support}</div>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="text-gray-300 text-xs flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-600 pt-4">
                <div className="text-green-400 font-semibold text-sm">{tier.roi}</div>
                <div className="text-gray-400 text-xs">Payback: {tier.payback}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Feature Comparison</h2>
          <div className="card-glass overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-4 text-white">Feature</th>
                  <th className="p-4 text-white">Starter</th>
                  <th className="p-4 text-white">Professional</th>
                  <th className="p-4 text-white">Enterprise</th>
                  <th className="p-4 text-white">Enterprise Plus</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700">
                  <td className="p-4 font-semibold">Monthly Cost (USD)</td>
                  <td className="p-4 text-center">$105</td>
                  <td className="p-4 text-center">$1,167</td>
                  <td className="p-4 text-center">$12,950</td>
                  <td className="p-4 text-center">$69,575</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 font-semibold">Banking Networks</td>
                  <td className="p-4 text-center">3</td>
                  <td className="p-4 text-center">10</td>
                  <td className="p-4 text-center">20+</td>
                  <td className="p-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 font-semibold">UiPath Robots</td>
                  <td className="p-4 text-center text-red-400">✗</td>
                  <td className="p-4 text-center text-red-400">✗</td>
                  <td className="p-4 text-center text-green-400">5</td>
                  <td className="p-4 text-center text-green-400">25</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 font-semibold">Robocorp Runs</td>
                  <td className="p-4 text-center text-red-400">✗</td>
                  <td className="p-4 text-center text-green-400">10K/month</td>
                  <td className="p-4 text-center text-green-400">50K/month</td>
                  <td className="p-4 text-center text-green-400">500K/month</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 font-semibold">BigQuery</td>
                  <td className="p-4 text-center text-red-400">✗</td>
                  <td className="p-4 text-center text-green-400">1TB queries</td>
                  <td className="p-4 text-center text-green-400">10TB queries</td>
                  <td className="p-4 text-center text-green-400">100TB queries</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 font-semibold">Power BI</td>
                  <td className="p-4 text-center text-red-400">✗</td>
                  <td className="p-4 text-center text-green-400">Pro (5 users)</td>
                  <td className="p-4 text-center text-green-400">Premium</td>
                  <td className="p-4 text-center text-green-400">Embedded</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 font-semibold">Uptime SLA</td>
                  <td className="p-4 text-center">99%</td>
                  <td className="p-4 text-center">99.5%</td>
                  <td className="p-4 text-center">99.9%</td>
                  <td className="p-4 text-center">99.99%</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Support</td>
                  <td className="p-4 text-center">Community</td>
                  <td className="p-4 text-center">8x5 Email</td>
                  <td className="p-4 text-center">24/7 Priority</td>
                  <td className="p-4 text-center">24/7 NOC</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ROI Examples */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">ROI Examples (USD)</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-glass p-6">
              <h3 className="text-xl font-bold text-white mb-4">Starter Tier</h3>
              <p className="text-gray-300 text-sm mb-4">Small credit union processing ACH transactions</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Saved:</span>
                  <span className="text-white">3.5 hours/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Labor Savings:</span>
                  <span className="text-green-400 font-semibold">$2,520/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform Cost:</span>
                  <span className="text-white">$105/month</span>
                </div>
                <div className="border-t border-gray-600 pt-2 flex justify-between">
                  <span className="text-gray-300 font-semibold">Net Savings:</span>
                  <span className="text-green-400 font-bold">$2,415/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Annual ROI:</span>
                  <span className="text-green-400 font-bold">28,700%</span>
                </div>
              </div>
            </div>

            <div className="card-glass p-6">
              <h3 className="text-xl font-bold text-white mb-4">Enterprise Tier</h3>
              <p className="text-gray-300 text-sm mb-4">National bank processing multiple clearinghouses</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Saved:</span>
                  <span className="text-white">190 hours/week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Savings:</span>
                  <span className="text-green-400 font-semibold">$99,667/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform Cost:</span>
                  <span className="text-white">$12,950/month</span>
                </div>
                <div className="border-t border-gray-600 pt-2 flex justify-between">
                  <span className="text-gray-300 font-semibold">Net Savings:</span>
                  <span className="text-green-400 font-bold">$86,717/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Annual ROI:</span>
                  <span className="text-green-400 font-bold">670%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Financing Options */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Financing Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-glass p-6">
              <h3 className="text-white font-bold mb-3">Annual Prepayment</h3>
              <div className="text-3xl font-bold text-green-400 mb-2">10% OFF</div>
              <p className="text-gray-300 text-sm">Pay annually and save 10% on monthly fees</p>
            </div>
            <div className="card-glass p-6">
              <h3 className="text-white font-bold mb-3">2-Year Contract</h3>
              <div className="text-3xl font-bold text-green-400 mb-2">18% OFF</div>
              <p className="text-gray-300 text-sm">Commit for 2 years with monthly billing option</p>
            </div>
            <div className="card-glass p-6">
              <h3 className="text-white font-bold mb-3">3-Year Contract</h3>
              <div className="text-3xl font-bold text-green-400 mb-2">25% OFF</div>
              <p className="text-gray-300 text-sm">Maximum savings with 3-year commitment</p>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="/docs/networks" className="card-glass p-6 hover:border-blue-500 transition-colors">
              <h3 className="text-white font-bold mb-2">🌐 Banking Networks</h3>
              <p className="text-gray-300 text-sm">See supported networks and availability</p>
            </a>
            <a href="/docs/setup" className="card-glass p-6 hover:border-blue-500 transition-colors">
              <h3 className="text-white font-bold mb-2">🔧 Setup Guide</h3>
              <p className="text-gray-300 text-sm">BigQuery & Power BI integration</p>
            </a>
            <a href="/docs/integrations" className="card-glass p-6 hover:border-blue-500 transition-colors">
              <h3 className="text-white font-bold mb-2">🤖 RPA Options</h3>
              <p className="text-gray-300 text-sm">UiPath and Robocorp integration</p>
            </a>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center card-glass p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-6">
            Start with a 30-day free trial of the Starter tier (no credit card required)
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/" className="btn-primary px-8 py-3">Start Free Trial</a>
            <a href="mailto:sales@rpa-platform.com" className="btn-secondary px-8 py-3">
              Contact Sales
            </a>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <a href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
