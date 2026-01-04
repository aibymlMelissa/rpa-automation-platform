export default function SecurityPage() {
  return (
    <>
      {/* Page Title */}
      <div className="card-glass mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Security & Compliance</h1>
        <p className="text-gray-600 text-lg">
          Bank-grade security with enterprise compliance frameworks
        </p>
      </div>

      {/* Security Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="feature-card border-t-4 border-blue-500">
          <div className="text-4xl mb-4 text-center">🔐</div>
          <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">Encryption</h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            AES-256-GCM with PBKDF2 key derivation
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>256-bit encryption keys</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>100,000 PBKDF2 iterations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Authenticated encryption (GCM mode)</span>
            </li>
          </ul>
        </div>

        <div className="feature-card border-t-4 border-purple-500">
          <div className="text-4xl mb-4 text-center">🔒</div>
          <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">Access Control</h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            Role-based permissions and authentication
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>Role-Based Access Control (RBAC)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>Multi-factor authentication</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>Session management</span>
            </li>
          </ul>
        </div>

        <div className="feature-card border-t-4 border-green-500">
          <div className="text-4xl mb-4 text-center">📋</div>
          <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">Audit Logging</h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            Immutable logs with tamper detection
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              <span>Append-only log files</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              <span>Cryptographic checksums</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              <span>Daily log rotation</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Credential Vault */}
      <div className="card-glass mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">CredentialVault Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Encryption Process</h3>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">1️⃣</span>
                  <h4 className="font-bold text-gray-800">Key Derivation</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Master key derived using PBKDF2 with 100,000 iterations and random salt
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">2️⃣</span>
                  <h4 className="font-bold text-gray-800">Data Encryption</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Credentials encrypted using AES-256-GCM with random initialization vector (IV)
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">3️⃣</span>
                  <h4 className="font-bold text-gray-800">Authentication Tag</h4>
                </div>
                <p className="text-sm text-gray-600">
                  GCM mode generates authentication tag to detect tampering
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">4️⃣</span>
                  <h4 className="font-bold text-gray-800">Secure Storage</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Encrypted data stored with metadata (IV, salt, auth tag, expiration)
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Security Features</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">🔄 Automatic Rotation</h4>
                <p className="text-sm text-gray-600">
                  Credentials automatically rotated before expiration with zero-downtime migration
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">⏱️ Time-Based Expiration</h4>
                <p className="text-sm text-gray-600">
                  Set expiration timestamps for credentials with automatic cleanup
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">🗑️ Secure Deletion</h4>
                <p className="text-sm text-gray-600">
                  Cryptographic shredding ensures deleted credentials are unrecoverable
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">📊 Access Auditing</h4>
                <p className="text-sm text-gray-600">
                  All vault operations logged with timestamps and user context
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">🔍 Tamper Detection</h4>
                <p className="text-sm text-gray-600">
                  Authentication tags prevent unauthorized credential modification
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 code-block">
          <div className="text-sm font-bold text-gray-700 mb-2">Usage Example</div>
          <code className="text-xs">
            {`import { CredentialVault } from '@/core/security/CredentialVault';

const vault = new CredentialVault();

// Store with expiration
await vault.store('bank-api', {
  apiKey: 'sk_live_...',
  apiSecret: 'secret_...'
}, {
  expiresAt: new Date('2025-12-31'),
  metadata: { environment: 'production' }
});

// Retrieve decrypted
const credentials = await vault.retrieve('bank-api');

// Rotate before expiration
await vault.rotate('bank-api');

// Secure delete
await vault.delete('bank-api');`}
          </code>
        </div>
      </div>

      {/* Audit Logging */}
      <div className="card-glass mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Audit Logging System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Log Structure</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• <strong>Timestamp:</strong> ISO 8601 UTC format</li>
              <li>• <strong>Event Type:</strong> Authentication, data access, configuration change</li>
              <li>• <strong>User Context:</strong> User ID, IP address, session</li>
              <li>• <strong>Action:</strong> Operation performed</li>
              <li>• <strong>Resource:</strong> Target entity or data</li>
              <li>• <strong>Result:</strong> Success, failure, or error</li>
              <li>• <strong>Metadata:</strong> Additional context (request ID, etc.)</li>
            </ul>
          </div>

          <div className="p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Security Guarantees</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• <strong>Immutability:</strong> Append-only, no deletions or modifications</li>
              <li>• <strong>Integrity:</strong> Cryptographic checksums detect tampering</li>
              <li>• <strong>Availability:</strong> Daily rotation with archival to S3</li>
              <li>• <strong>Confidentiality:</strong> Sensitive data encrypted in logs</li>
              <li>• <strong>Retention:</strong> Configurable retention policies (1-7 years)</li>
              <li>• <strong>Compliance:</strong> Meets SOC2, PCI-DSS requirements</li>
            </ul>
          </div>
        </div>

        <div className="code-block">
          <div className="text-sm font-bold text-gray-700 mb-2">Audit Log Entry Example (JSONL)</div>
          <code className="text-xs">
            {`{
  "timestamp": "2025-01-03T12:34:56.789Z",
  "eventType": "DATA_ACCESS",
  "userId": "user-123",
  "ipAddress": "192.168.1.100",
  "action": "CREDENTIAL_RETRIEVE",
  "resource": "bank-api-prod",
  "result": "SUCCESS",
  "metadata": {
    "requestId": "req-abc-123",
    "duration": 45,
    "complianceMode": "PCI-DSS"
  },
  "checksum": "sha256:a1b2c3d4..."
}`}
          </code>
        </div>
      </div>

      {/* Compliance Frameworks */}
      <div className="card-glass mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Compliance Frameworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-white rounded-lg border-2 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">💳</div>
              <h3 className="text-xl font-bold text-gray-800">PCI-DSS</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Payment Card Industry Data Security Standard
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Requirement 3: Protect stored cardholder data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Requirement 4: Encrypt transmission of data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Requirement 10: Track and monitor network access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Requirement 11: Test security systems regularly</span>
              </li>
            </ul>
          </div>

          <div className="p-5 bg-white rounded-lg border-2 border-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🇪🇺</div>
              <h3 className="text-xl font-bold text-gray-800">GDPR</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              General Data Protection Regulation
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Article 5: Data protection principles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Article 17: Right to erasure (secure deletion)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Article 25: Data protection by design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Article 32: Security of processing</span>
              </li>
            </ul>
          </div>

          <div className="p-5 bg-white rounded-lg border-2 border-green-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🛡️</div>
              <h3 className="text-xl font-bold text-gray-800">SOC 2</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Service Organization Control 2
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Security: Access controls and encryption</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Availability: System uptime and redundancy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Confidentiality: Data protection measures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Privacy: Personal information handling</span>
              </li>
            </ul>
          </div>

          <div className="p-5 bg-white rounded-lg border-2 border-yellow-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🔐</div>
              <h3 className="text-xl font-bold text-gray-800">ISO 27001</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Information Security Management
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>A.9: Access control policies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>A.10: Cryptographic controls</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>A.12: Operations security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>A.18: Compliance requirements</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="card-glass">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Security Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Recommended Practices
            </h3>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="p-3 bg-green-50 rounded">
                <strong>Always encrypt credentials</strong> - Use CredentialVault for all sensitive data
              </li>
              <li className="p-3 bg-green-50 rounded">
                <strong>Enable audit logging</strong> - Track all operations for compliance
              </li>
              <li className="p-3 bg-green-50 rounded">
                <strong>Rotate credentials regularly</strong> - Implement 90-day rotation policy
              </li>
              <li className="p-3 bg-green-50 rounded">
                <strong>Use environment variables</strong> - Never hardcode secrets in code
              </li>
              <li className="p-3 bg-green-50 rounded">
                <strong>Implement least privilege</strong> - Grant minimum required permissions
              </li>
              <li className="p-3 bg-green-50 rounded">
                <strong>Monitor audit logs</strong> - Set up alerts for suspicious activity
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
              <span className="text-red-600">✗</span>
              Security Anti-Patterns
            </h3>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="p-3 bg-red-50 rounded">
                <strong>Plain text credentials</strong> - Never store unencrypted passwords or keys
              </li>
              <li className="p-3 bg-red-50 rounded">
                <strong>Disabled audit logging</strong> - Always enable for compliance requirements
              </li>
              <li className="p-3 bg-red-50 rounded">
                <strong>Shared credentials</strong> - Each service should have unique credentials
              </li>
              <li className="p-3 bg-red-50 rounded">
                <strong>Weak master keys</strong> - Use cryptographically strong 32-byte keys
              </li>
              <li className="p-3 bg-red-50 rounded">
                <strong>Skipping validation</strong> - Always validate input at system boundaries
              </li>
              <li className="p-3 bg-red-50 rounded">
                <strong>Ignoring expiration</strong> - Monitor and rotate before credentials expire
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
