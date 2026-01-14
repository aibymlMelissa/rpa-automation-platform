'use client';

import { useState } from 'react';

export default function DocumentationLinks() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card-glass mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left hover:opacity-80 transition-opacity"
      >
        <h2 className="text-2xl font-bold text-gray-800">📚 Documentation & Resources</h2>
        <span className="text-2xl text-gray-600">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <a href="/docs/networks" className="block p-6 bg-blue-50 hover:bg-blue-100 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all group">
            <div className="text-3xl mb-3">🏦</div>
            <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600">Banking Networks</h3>
            <p className="text-sm text-gray-600">Complete list of supported networks and integration options</p>
          </a>

          <a href="/docs/setup" className="block p-6 bg-green-50 hover:bg-green-100 rounded-lg border-2 border-green-200 hover:border-green-400 transition-all group">
            <div className="text-3xl mb-3">🔧</div>
            <h3 className="font-bold text-gray-800 mb-2 group-hover:text-green-600">Setup Guide</h3>
            <p className="text-sm text-gray-600">BigQuery & Power BI integration instructions</p>
          </a>

          <a href="/docs/pricing" className="block p-6 bg-purple-50 hover:bg-purple-100 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all group">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold text-gray-800 mb-2 group-hover:text-purple-600">Pricing & Budget</h3>
            <p className="text-sm text-gray-600">Deployment tiers and cost estimates</p>
          </a>

          <a href="/docs/integrations" className="block p-6 bg-orange-50 hover:bg-orange-100 rounded-lg border-2 border-orange-200 hover:border-orange-400 transition-all group">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-bold text-gray-800 mb-2 group-hover:text-orange-600">RPA Integrations</h3>
            <p className="text-sm text-gray-600">UiPath & Robocorp software options</p>
          </a>
        </div>
      )}
    </div>
  );
}
