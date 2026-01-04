# RPA Automation Platform

Enterprise-grade Robotic Process Automation platform designed for Banking Network Utility operations. This platform provides AI-powered data extraction, automation, and analytics for financial institutions, payment processors, and shared banking infrastructure.

## Overview

The RPA Automation Platform is a comprehensive solution that automates data extraction and processing from various banking networks, including payment processors (Visa, Mastercard, PayPal, Stripe) and shared banking infrastructure (FIS Global, Fiserv, Jack Henry, Temenos). The platform features a modern web interface, real-time monitoring, and enterprise-grade security.

## Key Features

### 🤖 Web Automation
- Headless browser automation using Puppeteer/Playwright
- Intelligent form detection and AI-powered element selection
- Multi-tab session management
- Dynamic element detection
- Screenshot & PDF capture capabilities

### 🧠 AI Integration
- TensorFlow.js powered computer vision for layout analysis
- Pattern recognition and adaptive element detection
- OCR & text extraction
- Pattern learning & adaptation
- CAPTCHA solving capabilities

### 🔒 Enterprise Security
- Bank-grade security with AES-256-GCM encryption
- Credential vaulting with secure storage
- Comprehensive audit logging
- End-to-end encryption
- Role-based access control (RBAC)
- Compliance ready (PCI-DSS, GDPR, SOC2, ISO27001)

### 📊 Data Processing
- Automated ETL (Extract, Transform, Load) pipeline
- Real-time data validation and transformation
- BigQuery data warehouse integration
- Power BI analytics and reporting
- Real-time WebSocket updates

## Architecture

The platform uses a **3-tier architecture**:

### 1. Frontend Layer (Next.js 14)
- React Server Components with App Router
- Real-time updates via WebSocket
- Modern UI with TailwindCSS
- Responsive design for all devices

### 2. Backend Core Services
- RPAEngine: Job orchestration and scheduling
- CredentialVault: Secure credential management
- ETLPipeline: Data validation, transformation, and loading
- AuditLogger: Compliance and audit trail
- WebAutomation: Browser-based data extraction
- APIExtractor: REST, SOAP, FIX, ISO20022 protocol support

### 3. Worker Processes
- Background extraction workers
- Cron-based job scheduling
- Real-time event broadcasting
- Queue management with BullMQ + Redis

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Node.js, TypeScript
- **Automation**: Puppeteer, Playwright
- **AI/ML**: TensorFlow.js
- **Queue System**: BullMQ, Redis
- **Database**: PostgreSQL
- **Data Warehouse**: Google BigQuery
- **Analytics**: Power BI
- **Deployment**: Docker, Kubernetes, Google Cloud

## Supported Banking Networks

### ✅ Available Services

#### Payment Processors (All Tiers)
- Visa & Mastercard
- PayPal & Stripe
- Square
- American Express
- Discover

#### Shared Banking Infrastructure (Professional+ Tiers)
- FIS Global
- Fiserv
- Jack Henry & Associates
- Temenos

#### Direct Bank Web Automation (All Tiers)
- Generic bank portal templates
- Custom CSS selector configuration
- Multi-page navigation support
- MFA authentication handling

### 🔒 Reserved Networks (NOT Included)
The following clearinghouse networks are reserved for the Banking Network Project and require separate agreements:
- ACH/NACHA Clearinghouse
- SWIFT Network
- FedWire Funds Service
- CHIPS

**Alternative**: Use FIS Global, Fiserv, or Jack Henry (Professional+ tiers) for API access to ACH and wire transfers.

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database
- Redis server
- Google Cloud account (for BigQuery integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rpa-automation-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   - `ENCRYPTION_MASTER_KEY` - 32-byte hex key for credential encryption
   - `DATABASE_URL` - PostgreSQL connection string
   - `REDIS_HOST`, `REDIS_PORT` - Redis server configuration
   - `AUDIT_LOG_DIR` - Audit log storage path
   - `GCP_PROJECT_ID`, `GCP_KEY_FILE` - Google Cloud credentials
   - `NEXT_PUBLIC_WS_URL` - WebSocket server URL

4. **Initialize database**
   ```bash
   npm run db:migrate
   ```

### Development

Start all services for development:

```bash
# Start Next.js development server (port 3000 or 3001)
npm run dev

# In separate terminals:
npm run worker       # Start extraction worker
npm run scheduler    # Start scheduler worker
npm run websocket    # Start WebSocket server (port 3001)
```

Or use concurrently to run all services:
```bash
concurrently "npm run dev" "npm run worker" "npm run scheduler" "npm run websocket"
```

### Production Build

```bash
npm run build      # Build for production
npm run start      # Start production server
```

### Testing

```bash
npm run lint           # Run ESLint
npm run type-check     # TypeScript type checking
npm test              # Run Jest tests
npm run test:watch    # Watch mode for tests
```

## Documentation

The platform includes comprehensive documentation accessible through the web interface:

### 📚 Available Documentation Pages

- **[Banking Networks](/docs/networks)** - Complete list of supported networks and integration options
- **[Setup Guide](/docs/setup)** - BigQuery & Power BI integration instructions
- **[Pricing & Budget](/docs/pricing)** - Deployment tiers and cost estimates
- **[RPA Integrations](/docs/integrations)** - UiPath & Robocorp software options

### Quick Links
- Access the dashboard: `http://localhost:3001`
- View all documentation: `http://localhost:3001/docs/networks`

## Pricing Tiers

The platform offers 4 deployment tiers (all prices in USD):

### 1. Starter ($1,500/month)
- 5 RPA jobs, 5 data sources
- Payment processors included
- Community support
- Basic features
- Setup: $2,000

### 2. Professional ($5,000/month)
- 25 RPA jobs, 25 data sources
- Shared banking infrastructure included
- Business hours support
- Advanced ETL, BigQuery, Power BI
- Setup: $10,000

### 3. Enterprise ($15,000/month)
- 100 RPA jobs, 100 data sources
- All integrations + custom connections
- 24/7 priority support
- AI extraction, dedicated cluster
- Setup: $30,000

### 4. Custom (Contact Sales)
- Unlimited jobs and data sources
- Full platform access + white-label
- Dedicated account manager
- Custom features and SLA
- Setup: Custom pricing

## RPA Integration Options

The platform supports three integration approaches:

### 1. Internal Automation (Built-in)
- Puppeteer + Playwright browser automation
- Best for web-based banking portals
- No additional licensing costs

### 2. UiPath Integration
- Enterprise RPA software integration
- Attended/Unattended robots
- Desktop application automation
- License required: ~$8,000/year per robot

### 3. Robocorp Integration
- Modern Python-based RPA framework
- Open-source with cloud orchestration
- Free tier available, paid plans from $900/month

### Hybrid Architecture (Recommended)
Combine multiple approaches based on task complexity:
- Simple web tasks: Internal automation
- Complex workflows: UiPath or Robocorp
- Cost-effective and flexible

## Data Flow

```
Banking Networks → RPA Engine → ETL Pipeline → BigQuery
     (Sources)      (Extract)    (Transform)    (Load)
                                                   ↓
                                          Power BI Dashboards
```

## Security & Compliance

- **Encryption**: AES-256-GCM for all credentials
- **Audit Logging**: Immutable append-only logs in JSONL format
- **Access Control**: Role-based permissions (RBAC)
- **Compliance**: PCI-DSS, GDPR, SOC2, ISO27001 modes
- **Secure Storage**: PBKDF2 key derivation with 100,000 iterations

## BigQuery & Power BI Setup

### Quick Start (3 Steps)

1. **Setup BigQuery**
   ```bash
   tsx server/database/bigquery-setup.ts
   ```

2. **Migrate Historical Data**
   ```bash
   tsx server/database/migrate-to-warehouse.ts
   ```

3. **Connect Power BI**
   - Open Power BI Desktop
   - Get Data → Google BigQuery
   - Use Service Account authentication
   - Select dataset: `rpa_warehouse`
   - Choose DirectQuery mode for real-time data

### Cost Estimate (USD/month)
- Storage (500GB): $10
- Queries (2TB): $10
- Streaming (3TB): $150
- Power BI Pro (5 users): $50
- **Total: ~$220/month** (Professional tier analytics)

## Project Structure

```
rpa-automation-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── docs/              # Documentation pages
│   │   │   ├── networks/      # Banking networks
│   │   │   ├── setup/         # Setup guide
│   │   │   ├── pricing/       # Pricing tiers
│   │   │   └── integrations/  # RPA integrations
│   │   └── api/               # API routes
│   ├── core/                  # Backend core services (DO NOT MODIFY)
│   │   ├── engine/            # RPAEngine, JobScheduler, QueueManager
│   │   ├── extraction/        # WebAutomation, APIExtractor
│   │   ├── security/          # CredentialVault, Encryption, AuditLogger
│   │   └── pipeline/          # ETLPipeline, DataValidator, Transformer
│   ├── components/            # React components
│   ├── types/                 # TypeScript type definitions
│   ├── services/              # AI and utility services
│   └── config/                # Configuration files
├── server/
│   ├── workers/               # Background workers
│   ├── websocket/             # WebSocket server
│   └── database/              # Database scripts
├── docs/                      # Project markdown documentation
└── public/                    # Static assets
```

## Support

For questions, issues, or feature requests:
- Review the [documentation pages](http://localhost:3001/docs/networks)
- Check the project's issue tracker
- Contact your account manager (Enterprise tier)

## License

Copyright © 2024. All rights reserved.

---

**Built with**: Next.js 14, React, TypeScript, TailwindCSS, Puppeteer, TensorFlow.js, BullMQ, Redis, PostgreSQL, BigQuery, Power BI

**Version**: 1.0.0
