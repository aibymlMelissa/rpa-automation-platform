# Supported Banking Networks

Official list of banking networks supported by the RPA Automation Platform, categorized by deployment tier and availability status.

---

## ⚠️ IMPORTANT: Clearinghouse Network Status

**Clearinghouse networks (ACH/NACHA, SWIFT, FedWire, CHIPS) are RESERVED for future technical development and are NOT currently available as production services.**

These networks are:
- ❌ **NOT included** in any current pricing tier
- ❌ **NOT available** for client deployment
- ❌ **NOT accessible** via the platform API
- 🔒 **Reserved** for Banking Network Project technical integration
- 📅 **Future availability** subject to technical completion

**Primary Services:** Payment processors, shared banking infrastructure, and direct bank integrations.

---

## Primary Banking Networks (Production Ready)

### Payment Processors ✅ AVAILABLE

These are the **primary, production-ready** banking networks available to all clients:

| Network | Type | Real-Time | Batch | Webhooks | Availability |
|---------|------|-----------|-------|----------|--------------|
| **Visa (VisaNet)** | Card Network | ✅ | ✅ | ✅ | All Tiers |
| **Mastercard** | Card Network | ✅ | ✅ | ✅ | All Tiers |
| **PayPal** | Payment Gateway | ✅ | ✅ | ✅ | All Tiers |
| **Stripe** | Payment Gateway | ✅ | ✅ | ✅ | All Tiers |
| **Square** | Payment Gateway | ✅ | ✅ | ✅ | All Tiers |

**Features:**
- REST API integration
- OAuth 2.0 / API Key authentication
- Real-time transaction processing
- Webhook notifications
- Comprehensive API documentation

**Use Cases:**
- Credit/debit card transaction processing
- Online payment collection
- Point-of-sale (POS) integrations
- Recurring billing and subscriptions
- Refund and chargeback management

---

### Shared Banking Infrastructure ✅ AVAILABLE

Multi-institution service platforms serving multiple banks:

| Network | Type | Real-Time | Batch | Webhooks | Availability |
|---------|------|-----------|-------|----------|--------------|
| **FIS Global** | Banking Platform | ✅ | ✅ | ✅ | Professional+ |
| **Fiserv** | Banking Platform | ✅ | ✅ | ✅ | Professional+ |
| **Jack Henry** | Banking Platform | ✅ | ✅ | ✅ | Professional+ |
| **Temenos** | Banking Platform | ✅ | ✅ | ✅ | Professional+ |

**Features:**
- Core banking system integration
- Multi-institution support
- REST/SOAP API protocols
- OAuth 2.0 authentication
- Comprehensive data access

**Use Cases:**
- Account balance retrieval
- Transaction history downloads
- ACH/wire transfer initiation
- Customer account management
- Loan and deposit processing

---

### Direct Bank Integrations ✅ AVAILABLE

Web automation templates for direct bank portals:

| Network | Type | Method | Availability |
|---------|------|--------|--------------|
| **Generic Bank Portal** | Web Automation | Puppeteer | All Tiers |
| **Custom Bank Templates** | Web Automation | Custom selectors | Professional+ |

**Features:**
- Web scraping with Puppeteer
- Username/password + MFA authentication
- Custom selector configuration
- Screenshot capture
- Session management

**Use Cases:**
- Banks without API access
- Legacy banking systems
- Regional/community banks
- Credit unions
- Custom banking portals

---

## Reserved Networks (Not Available)

### Clearinghouses 🔒 RESERVED

**Status:** Reserved for Banking Network Project technical development

| Network | Type | Status | Availability |
|---------|------|--------|--------------|
| **ACH/NACHA** | Clearinghouse | 🔒 Reserved | NOT AVAILABLE |
| **SWIFT** | Clearinghouse | 🔒 Reserved | NOT AVAILABLE |
| **FedWire** | Clearinghouse | 🔒 Reserved | NOT AVAILABLE |
| **CHIPS** | Clearinghouse | 🔒 Reserved | NOT AVAILABLE |

**Why Reserved:**
- Clearinghouse networks require specialized technical integration
- Complex compliance requirements (PCI-DSS Level 1, SOC 2 Type II)
- Certificate-based authentication (x509, mutual TLS)
- ISO20022 and FIX protocol support
- Reserved for dedicated Banking Network Project

**Technical Requirements (Future):**
- ISO20022 message parsing
- FIX protocol implementation
- Certificate management infrastructure
- Real-time settlement processing
- Multi-region failover

**Estimated Availability:**
- Technical development: 6-12 months
- Compliance certification: 3-6 months
- Production deployment: Q3-Q4 2026

**Alternative Solutions:**
- Use **shared banking infrastructure** (FIS, Fiserv, Jack Henry)
- These platforms provide access to ACH and wire transfers
- No direct clearinghouse integration needed for most use cases

---

## Network Availability by Tier

### Starter Tier ($105/month)

**Available Networks:**
- ✅ All 5 payment processors (Visa, Mastercard, PayPal, Stripe, Square)
- ✅ Direct bank web automation (generic template)
- ❌ Shared infrastructure (not included)
- ❌ Clearinghouses (reserved)

**Maximum:** 3 concurrent networks

---

### Professional Tier ($1,167/month)

**Available Networks:**
- ✅ All 5 payment processors
- ✅ All 4 shared infrastructure platforms (FIS, Fiserv, Jack Henry, Temenos)
- ✅ Direct bank web automation (custom templates)
- ❌ Clearinghouses (reserved)

**Maximum:** 10 concurrent networks

---

### Enterprise Tier ($12,950/month)

**Available Networks:**
- ✅ All 5 payment processors
- ✅ All 4 shared infrastructure platforms
- ✅ Direct bank web automation (unlimited custom templates)
- ✅ Custom network integrations (on request)
- ❌ Clearinghouses (reserved)

**Maximum:** 20+ concurrent networks

---

### Enterprise Plus ($69,575/month)

**Available Networks:**
- ✅ All payment processors
- ✅ All shared infrastructure platforms
- ✅ Unlimited direct bank integrations
- ✅ Custom network development included
- ✅ White-label network marketplace
- ❌ Clearinghouses (reserved - requires separate agreement)

**Maximum:** Unlimited networks

---

## Adding Custom Networks

### Custom Payment Processor

**Requirements:**
- REST or SOAP API available
- API documentation provided
- Test credentials for development
- Webhook support (optional)

**Development Time:** 2-4 weeks
**Cost:** $5,000-$15,000 (one-time)
**Availability:** Professional tier and above

### Custom Banking Platform

**Requirements:**
- API access or web portal
- Authentication method documented
- Data format specifications
- Test environment access

**Development Time:** 4-8 weeks
**Cost:** $15,000-$35,000 (one-time)
**Availability:** Enterprise tier and above

### Custom Clearinghouse Integration

**Status:** NOT AVAILABLE - Contact Banking Network Project team

**Requirements:**
- Dedicated technical project agreement
- Compliance certification required
- Minimum contract: $500K+ annually
- 12+ month development timeline

---

## Network Selection Guide

### For Small Banks/Credit Unions (Starter Tier)

**Recommended Networks:**
1. **Stripe** - Easy API integration, excellent documentation
2. **PayPal** - Wide customer adoption, familiar interface
3. **Direct Bank** - Web automation for your core banking system

**Use Case:** Basic payment processing and account data extraction

---

### For Mid-Market Banks (Professional Tier)

**Recommended Networks:**
1. **Visa/Mastercard** - Card processing at scale
2. **FIS Global or Fiserv** - Core banking integration
3. **Stripe** - Online payment collection
4. **PayPal** - Consumer payments
5. **Direct Banks** - Legacy system integration

**Use Case:** Multi-channel payment processing with core banking integration

---

### For Large Banks (Enterprise Tier)

**Recommended Networks:**
1. **All payment processors** - Comprehensive coverage
2. **All shared infrastructure** - Multi-platform support
3. **Custom networks** - Proprietary systems
4. **Direct banks** - Partner bank integrations

**Use Case:** Enterprise-grade multi-network orchestration

---

### For RPA Service Providers (Enterprise Plus)

**Recommended Networks:**
1. **Network marketplace** - Offer multiple options to clients
2. **White-label integrations** - Brand as your own
3. **Custom development** - Build unique connectors
4. **Per-tenant configurations** - Isolate client networks

**Use Case:** Multi-tenant SaaS with diverse client needs

---

## API Protocols Supported

| Protocol | Description | Networks Using |
|----------|-------------|----------------|
| **REST** | RESTful HTTP APIs | Visa, Mastercard, PayPal, Stripe, Square, FIS, Fiserv, Jack Henry, Temenos |
| **SOAP** | SOAP/XML web services | FIS, Fiserv, Temenos |
| **Web Automation** | Puppeteer browser automation | Direct banks |
| **ISO20022** | Financial messaging standard | 🔒 Reserved (SWIFT, FedWire, CHIPS) |
| **FIX** | Financial Information eXchange | 🔒 Reserved (SWIFT) |

---

## Authentication Methods Supported

| Method | Security Level | MFA Support | Networks Using |
|--------|----------------|-------------|----------------|
| **OAuth 2.0** | High | ✅ | Visa, Mastercard, PayPal, Square, FIS, Fiserv, Jack Henry, Temenos |
| **API Key** | Medium | ❌ | Visa, Mastercard, Stripe, Fiserv, Jack Henry, Temenos |
| **Username/Password + MFA** | Medium | ✅ | Direct banks, FIS |
| **Certificate (x509/mTLS)** | Very High | ❌ | 🔒 Reserved (SWIFT, FedWire, CHIPS, ACH) |

---

## Compliance & Certifications

### Payment Processors (PCI-DSS Level 1)

All payment processors are PCI-DSS Level 1 compliant:
- ✅ Visa, Mastercard, PayPal, Stripe, Square

**Platform Compliance:**
- Starter: Basic PCI-DSS controls
- Professional: PCI-DSS tracking with Vanta
- Enterprise: Full PCI-DSS Level 1 compliance
- Enterprise Plus: PCI-DSS Service Provider certification

### Shared Infrastructure

Banking platforms meet various compliance standards:
- ✅ SOC 2 Type II
- ✅ PCI-DSS (where applicable)
- ✅ GLBA (Gramm-Leach-Bliley Act)
- ✅ FFIEC (Federal Financial Institutions Examination Council)

### Clearinghouses (Reserved)

Clearinghouse compliance is managed by Banking Network Project:
- 🔒 PCI-DSS Level 1
- 🔒 SOC 2 Type II
- 🔒 ISO 27001
- 🔒 SWIFT CSP (Customer Security Programme)
- 🔒 Federal Reserve compliance

---

## Data Access Capabilities

### Real-Time Data

Networks supporting real-time data access:
- ✅ Visa, Mastercard, PayPal, Stripe, Square
- ✅ FIS Global, Fiserv, Jack Henry, Temenos
- 🔒 Reserved: SWIFT, FedWire, CHIPS

### Batch Data

Networks supporting batch file downloads:
- ✅ All payment processors
- ✅ All shared infrastructure
- ✅ Direct bank web automation
- 🔒 Reserved: ACH/NACHA (batch-only)

### Webhooks

Networks supporting webhook notifications:
- ✅ Visa, Mastercard, PayPal, Stripe, Square
- ✅ FIS Global, Fiserv, Jack Henry, Temenos
- ❌ Direct bank web automation (polling only)
- 🔒 Reserved: ACH/NACHA only

---

## Frequently Asked Questions

### Q: Why are clearinghouses not available?

**A:** Clearinghouse networks (ACH, SWIFT, FedWire, CHIPS) are reserved for the Banking Network Project technical development. These networks require:
- Specialized ISO20022/FIX protocol implementation
- Certificate-based authentication infrastructure
- Real-time settlement processing
- Complex compliance certifications
- Multi-million dollar integration costs

**Alternative:** Use shared banking infrastructure (FIS, Fiserv, Jack Henry) which provide access to ACH and wire transfers without direct clearinghouse integration.

### Q: Can I request clearinghouse integration for my deployment?

**A:** No, clearinghouses are exclusively reserved for the Banking Network Project. However:
- **Enterprise+ clients** can request custom integration with Banking Network Project team
- Requires separate technical agreement
- Minimum $500K annual commitment
- 12-18 month development timeline

### Q: What's the difference between FIS and ACH/NACHA?

**A:**
- **FIS Global:** Banking platform that provides API access to ACH transactions processed through NACHA
- **ACH/NACHA:** The actual clearinghouse network (reserved, not directly accessible)
- **You get ACH capabilities** through FIS without needing direct NACHA integration

### Q: Can I add a bank that's not listed?

**A:** Yes, for Professional tier and above:
- **Has API:** $5K-$15K custom integration
- **Web portal only:** Use direct bank web automation template
- **Development time:** 2-8 weeks depending on complexity

### Q: How many networks can I connect simultaneously?

**A:**
- **Starter:** 3 networks max
- **Professional:** 10 networks max
- **Enterprise:** 20+ networks
- **Enterprise Plus:** Unlimited

### Q: Are there per-transaction fees for network access?

**A:**
- **Platform fees:** No per-transaction fees
- **Network fees:** Each network has its own fee structure (paid directly to network)
  - Stripe: 2.9% + $0.30 per transaction
  - PayPal: 2.9% + $0.30 per transaction
  - Visa/Mastercard: Varies by merchant agreement
  - Shared infrastructure: Monthly/annual licensing

---

## Support Resources

### Network Integration Help

- **Starter:** Community support (GitHub Discussions)
- **Professional:** Email support (8x5, 24-hour response)
- **Enterprise:** 24/7 priority support (2-hour response)
- **Enterprise Plus:** Dedicated NOC + account manager

### Network Onboarding

Each tier includes network onboarding assistance:
- **Starter:** Documentation only
- **Professional:** 2 hours of setup assistance
- **Enterprise:** Full white-glove onboarding
- **Enterprise Plus:** Dedicated integration team

### Custom Network Development

Contact sales for custom network integration:
- Email: sales@rpa-platform.com
- Typical timeline: 4-12 weeks
- Pricing: $5K-$35K depending on complexity

---

## Roadmap

### Q1 2026 (Current)

**Available:**
- ✅ 5 payment processors
- ✅ 4 shared infrastructure platforms
- ✅ Direct bank web automation

### Q2-Q3 2026 (Planned)

**Additions:**
- American Express integration
- Discover Network integration
- Additional regional banks
- Enhanced web automation templates

### Q4 2026+ (Banking Network Project)

**Reserved for Technical Development:**
- 🔒 ACH/NACHA clearinghouse
- 🔒 SWIFT network
- 🔒 FedWire
- 🔒 CHIPS

**Note:** Clearinghouse availability subject to Banking Network Project completion and separate agreements.

---

**Document Version:** 1.0
**Last Updated:** January 4, 2026
**Status:** Production

---

**For clearinghouse inquiries, contact Banking Network Project team (NOT included in RPA platform pricing).**
