'use client';

import { useState } from 'react';

export default function SystemInformation() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card-glass">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left hover:opacity-80 transition-opacity"
      >
        <h2 className="text-2xl font-bold text-gray-800">ℹ️ System Information</h2>
        <span className="text-2xl text-gray-600">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Current Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-800">Next.js Server</span>
                </div>
                <span className="badge-success">Running</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-800">Backend Services</span>
                </div>
                <span className="badge-info">Ready</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-gray-800">WebSocket Server</span>
                </div>
                <span className="badge-warning">Start with npm run websocket</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700 mb-1">Version</div>
                <div className="text-gray-600">2.0.0 (AI-Enhanced)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700 mb-1">Environment</div>
                <div className="text-gray-600">Development</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700 mb-1">Framework</div>
                <div className="text-gray-600">Next.js 14 (App Router)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
