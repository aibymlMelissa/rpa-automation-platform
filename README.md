# RPA Automation Platform

Enterprise-grade Robotic Process Automation platform designed for Banking Network Utility operations. This platform provides **AI-powered data extraction**, intelligent automation, and analytics for financial institutions, payment processors, and shared banking infrastructure.

## Overview

The RPA Automation Platform is a comprehensive solution that automates data extraction and processing from various banking networks, including payment processors (Visa, Mastercard, PayPal, Stripe) and shared banking infrastructure (FIS Global, Fiserv, Jack Henry, Temenos). The platform features a modern web interface, real-time monitoring, enterprise-grade security, and **hybrid AI capabilities** combining computer vision with generative AI for maximum efficiency.

## Key Features

### 🤖 Web Automation
- Headless browser automation using Puppeteer/Playwright
- Intelligent form detection and AI-powered element selection
- **Adaptive selector recovery** when banking portals change layouts
- Multi-tab session management with cookie persistence
- Dynamic element detection with fallback strategies
- Screenshot & PDF capture capabilities
- Automatic retry logic with exponential backoff

### 🧠 Advanced AI Integration

The platform employs a **hybrid AI architecture** combining traditional computer vision with generative AI for optimal performance:

#### Computer Vision (TensorFlow.js)
- Real-time layout analysis and visual pattern recognition
- OCR (Optical Character Recognition) for text extraction
- Table structure detection and data extraction
- CAPTCHA solving capabilities
- Anomaly detection for data quality monitoring
- **Local processing** - no external API calls, zero latency

#### Generative AI (Optional - Enterprise Tier)
- **Adaptive Selector Intelligence**: Automatically recovers from banking portal UI changes
- **Smart Data Normalization**: Intelligently handles inconsistent date formats, currencies, and transaction descriptions
- **Error Interpretation**: Parses complex error messages and suggests recovery strategies
- **Document Understanding**: Extracts structured data from PDFs, bank statements, and invoices using multi-modal AI
- **Natural Language Interface**: Create jobs using plain English commands
- **Context-Aware Validation**: Beyond schema checks - detects unusual patterns and anomalies

#### Supported AI Providers
| Provider | Best For | Cost | Privacy | Use Case |
|----------|----------|------|---------|----------|
| **DeepSeek** | Cost-effective reasoning | $0.14/1M tokens | Good | General automation, selector recovery |
| **OpenAI GPT-4** | Reliability, tool use | $2.50/1M tokens | Requires trust | Complex reasoning, NL interface |
| **Google Gemini** | Multimodal (PDFs/images) | $0.075/1M tokens | Requires trust | Document extraction, invoice processing |
| **Local Llama 3** | Banking compliance | Infrastructure only | Best | On-premise, air-gapped deployments |

**Hybrid Approach (Recommended):**
- TensorFlow.js for fast, local computer vision tasks (0ms API latency)
- Generative AI for complex reasoning and adaptation (200-2000ms per call)
- Automatic fallback to heuristics when AI is unavailable
- Data masking for PCI-DSS compliance

### 🔒 Enterprise Security
- Bank-grade security with AES-256-GCM encryption
- Credential vaulting with secure storage
- Comprehensive audit logging (immutable, tamper-proof)
- End-to-end encryption
- Role-based access control (RBAC)
- Compliance ready (PCI-DSS, GDPR, SOC2, ISO27001)
- **AI Privacy**: Optional data masking before sending to LLM providers
- **On-premise AI**: Deploy local models for air-gapped environments

### 📊 Data Processing
- Automated ETL (Extract, Transform, Load) pipeline
- **AI-powered data normalization** for inconsistent formats
- Real-time data validation and transformation
- BigQuery data warehouse integration
- Power BI analytics and reporting
- Real-time WebSocket updates
- Anomaly detection with AI explanations

## Architecture

The platform uses a **4-tier architecture** with AI services layer:

### 1. Frontend Layer (Next.js 14)
- React Server Components with App Router
- Real-time updates via WebSocket
- Modern UI with TailwindCSS
- Responsive design for all devices
- Natural language job creation interface (Enterprise tier)

### 2. AI Services Layer (Optional - Professional+ Tiers)
- **GenerativeAI**: LLM integration for adaptive automation
- **AdaptiveSelectorAI**: Automatic selector recovery when portals change
- **DataNormalizerAI**: Intelligent data cleaning and standardization
- **ErrorAnalyzerAI**: Error interpretation and recovery suggestions
- **DocumentUnderstandingAI**: Multi-modal PDF/invoice extraction
- **DynamicElementDetector**: TensorFlow.js computer vision (all tiers)

### 3. Backend Core Services
- **RPAEngine**: Job orchestration and scheduling
- **CredentialVault**: Secure credential management
- **ETLPipeline**: Data validation, transformation, and loading (AI-enhanced)
- **AuditLogger**: Compliance and audit trail
- **WebAutomation**: Browser-based data extraction (AI-assisted)
- **APIExtractor**: REST, SOAP, FIX, ISO20022 protocol support

### 4. Worker Processes
- Background extraction workers
- Cron-based job scheduling
- Real-time event broadcasting
- Queue management with BullMQ + Redis
- AI task queue for LLM operations

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Node.js, TypeScript
- **Automation**: Puppeteer, Playwright
- **Computer Vision AI**: TensorFlow.js (local, all tiers)
- **Generative AI**: OpenAI GPT-4, Google Gemini, DeepSeek, Local Llama 3 (Professional+ tiers)
- **Queue System**: BullMQ, Redis
- **Database**: PostgreSQL
- **Data Warehouse**: Google BigQuery
- **Analytics**: Power BI
- **Deployment**: Docker, Kubernetes, Google Cloud, On-premise

## AI Capabilities by Tier

### Starter Tier
- ✅ TensorFlow.js computer vision (local)
- ✅ OCR and pattern recognition
- ✅ Basic CAPTCHA solving
- ❌ No generative AI

### Professional Tier
- ✅ All Starter features
- ✅ AI-powered data normalization (1,000 calls/month)
- ✅ Smart validation and anomaly detection
- ✅ Provider: DeepSeek or Gemini (cost-effective)

### Enterprise Tier
- ✅ All Professional features
- ✅ Adaptive selector recovery (unlimited)
- ✅ Error interpretation and auto-recovery
- ✅ Document understanding (PDFs, invoices)
- ✅ Natural language job creation
- ✅ Provider: Your choice (OpenAI, Gemini, DeepSeek, Local)
- ✅ On-premise AI deployment option

### Custom Tier
- ✅ All Enterprise features
- ✅ Custom AI models and fine-tuning
- ✅ Dedicated on-premise AI infrastructure
- ✅ White-label AI capabilities
- ✅ Air-gapped deployments with local LLMs

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
- **AI-assisted selector adaptation** (Enterprise tier)

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
- *Optional*: AI provider API keys (OpenAI, Gemini, or DeepSeek)

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

   **Required:**
   - `ENCRYPTION_MASTER_KEY` - 32-byte hex key for credential encryption
   - `DATABASE_URL` - PostgreSQL connection string
   - `REDIS_HOST`, `REDIS_PORT` - Redis server configuration
   - `AUDIT_LOG_DIR` - Audit log storage path
   - `GCP_PROJECT_ID`, `GCP_KEY_FILE` - Google Cloud credentials
   - `NEXT_PUBLIC_WS_URL` - WebSocket server URL

   **Optional AI Configuration:**
   - `ENABLE_AI_FEATURES` - Enable generative AI capabilities (default: false)
   - `AI_PROVIDER` - Choose: `openai`, `gemini`, `deepseek`, or `local` (default: deepseek)
   - `OPENAI_API_KEY` - OpenAI API key (if using OpenAI)
   - `GEMINI_API_KEY` - Google Gemini API key (if using Gemini)
   - `DEEPSEEK_API_KEY` - DeepSeek API key (if using DeepSeek)
   - `LOCAL_LLM_ENDPOINT` - Local model endpoint (if using local deployment)
   - `AI_DATA_MASKING` - Enable PII masking before AI calls (default: true)
   - `AI_MAX_CALLS_PER_DAY` - Rate limit for AI calls (default: 1000)

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
- **AI**: TensorFlow.js computer vision only (local)
- Setup: $2,000

### 2. Professional ($5,000/month)
- 25 RPA jobs, 25 data sources
- Shared banking infrastructure included
- Business hours support
- Advanced ETL, BigQuery, Power BI
- **AI**: Data normalization + anomaly detection (1,000 AI calls/month via DeepSeek)
- Setup: $10,000

### 3. Enterprise ($15,000/month)
- 100 RPA jobs, 100 data sources
- All integrations + custom connections
- 24/7 priority support
- **AI**: Full generative AI suite (unlimited calls, your choice of provider)
- Adaptive selectors, NL interface, document understanding
- Dedicated cluster
- Setup: $30,000

### 4. Custom (Contact Sales)
- Unlimited jobs and data sources
- Full platform access + white-label
- Dedicated account manager
- **AI**: Custom models, fine-tuning, on-premise deployment
- Air-gapped local LLM infrastructure
- Custom features and SLA
- Setup: Custom pricing

**AI Cost Estimates (Professional+ Tiers):**
- DeepSeek: ~$5-15/month for 1,000 calls
- Gemini: ~$10-30/month for 1,000 calls
- OpenAI GPT-4: ~$50-100/month for 1,000 calls
- Local LLM: Infrastructure costs only (no per-call fees)

## RPA Integration Options

The platform supports three integration approaches:

### 1. Internal Automation (Built-in)
- Puppeteer + Playwright browser automation
- **AI-enhanced** selector detection and recovery
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
- Simple web tasks: Internal automation (AI-assisted)
- Complex workflows: UiPath or Robocorp
- Cost-effective and flexible

## Data Flow with AI Enhancement

```
Banking Networks → RPA Engine (AI-Assisted) → ETL Pipeline (AI Normalization) → BigQuery
     (Sources)          (Extract)                    (Transform)                   (Load)
                                                                                      ↓
                             AI Services Layer                              Power BI Dashboards
                    (Adaptive Selectors, Error Recovery,
                     Data Normalization, Document Understanding)
```

## Security & Compliance

### Encryption & Access Control
- **Encryption**: AES-256-GCM for all credentials
- **Audit Logging**: Immutable append-only logs in JSONL format
- **Access Control**: Role-based permissions (RBAC)
- **Compliance**: PCI-DSS, GDPR, SOC2, ISO27001 modes
- **Secure Storage**: PBKDF2 key derivation with 100,000 iterations

### AI Privacy & Compliance

**For Banking Data:**
1. **Data Masking**: Automatically strip PII before sending to LLM providers
2. **On-Premise Option**: Deploy Llama 3, Mistral, or DeepSeek locally for air-gapped environments
3. **Compliance Modes**:
   - PCI-DSS: Mask card numbers, CVV, account numbers
   - GDPR: Strip personal identifiers before AI processing
   - SOC2: Audit trail of all AI operations
4. **Provider Security**:
   - OpenAI: SOC2 Type 2, GDPR compliant (verify for your use case)
   - Google Gemini: ISO 27001, SOC 2/3 (verify for your use case)
   - DeepSeek: Good privacy practices (verify for your use case)
   - Local LLM: Complete control, no external data transfer

**Recommendation**: For highly sensitive banking operations, use on-premise local LLMs or data masking with external providers.

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
- **AI Calls** (Professional tier - DeepSeek): $5-15
- **Total: ~$235-245/month** (Professional tier analytics + AI)

## AI Use Case Examples

### 1. Adaptive Selector Recovery
```typescript
import { AdaptiveSelectorAI } from '@/services/ai/AdaptiveSelectorAI';

// Banking portal changed their login button selector
try {
  await automation.click('#login-button');
} catch (error) {
  // AI analyzes page and suggests new selector
  const newSelector = await AdaptiveSelectorAI.recover({
    pageHTML: await automation.getHTML(),
    originalSelector: '#login-button',
    description: 'blue login button with white text',
  });

  await automation.click(newSelector); // ✅ Automatically recovered
}
```

### 2. Intelligent Data Normalization
```typescript
import { DataNormalizerAI } from '@/services/ai/DataNormalizerAI';

// Banking APIs return dates in different formats
const messyData = [
  { date: 'Jan 15, 2025', amount: '$1,234.56' },
  { date: '2025-01-16', amount: '2345.67 USD' },
  { date: '17/01/25', amount: '3456.78' },
];

// AI normalizes to consistent format
const normalized = await DataNormalizerAI.normalize(messyData);
// Result: ISO dates, numeric amounts, standardized currency
```

### 3. Natural Language Job Creation
```typescript
import { NaturalLanguageInterface } from '@/services/ai/NaturalLanguageInterface';

// User enters plain English command
const command = "Extract all Stripe transactions over $10,000 from last month";

// AI generates job configuration
const jobConfig = await NaturalLanguageInterface.parse(command);
await rpaEngine.scheduleJob(jobConfig);
```

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
│   ├── services/              # AI and utility services
│   │   └── ai/                # AI services layer
│   │       ├── GenerativeAI.ts           # LLM provider integration
│   │       ├── AdaptiveSelectorAI.ts     # Selector recovery
│   │       ├── DataNormalizerAI.ts       # Data cleaning
│   │       ├── ErrorAnalyzerAI.ts        # Error interpretation
│   │       ├── DocumentUnderstandingAI.ts # PDF/invoice extraction
│   │       ├── NaturalLanguageInterface.ts # NL command parsing
│   │       └── DynamicElementDetector.ts  # TensorFlow.js vision
│   ├── components/            # React components
│   ├── types/                 # TypeScript type definitions
│   └── config/                # Configuration files
├── server/
│   ├── workers/               # Background workers
│   ├── websocket/             # WebSocket server
│   └── database/              # Database scripts
├── docs/                      # Project markdown documentation
└── public/                    # Static assets
```

## AI Integration Best Practices

### ✅ DO
- Use TensorFlow.js for fast, local computer vision tasks
- Enable data masking for PCI-DSS compliance
- Implement fallback to traditional logic when AI fails
- Monitor AI costs with rate limiting
- Cache AI responses for repeated patterns
- Use DeepSeek for cost-effective operations
- Deploy local LLMs for air-gapped environments

### ❌ DON'T
- Send raw banking credentials to external AI providers
- Rely solely on AI without fallback mechanisms
- Skip data validation after AI normalization
- Use AI for every operation (use selectively for high-value tasks)
- Ignore AI cost monitoring (can escalate quickly)
- Disable audit logging for AI operations

## Support

For questions, issues, or feature requests:
- Review the [documentation pages](http://localhost:3001/docs/networks)
- Check the project's issue tracker
- Contact your account manager (Enterprise tier)
- AI integration support: Enterprise and Custom tiers only

## License

Copyright © 2024-2025. All rights reserved.

---

**Built with**: Next.js 14, React, TypeScript, TailwindCSS, Puppeteer, TensorFlow.js, OpenAI GPT-4, Google Gemini, DeepSeek, BullMQ, Redis, PostgreSQL, BigQuery, Power BI

**Version**: 2.0.0 (AI-Enhanced)
