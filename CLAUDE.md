# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **RPA Automation Platform** for Banking Network Utility operations. It provides enterprise-grade robotic process automation with AI-powered data extraction for financial institutions, clearing houses, payment processors, and shared banking infrastructure.

**Tech Stack:** Next.js 14 (App Router), TypeScript, React, Node.js, TailwindCSS, BullMQ (Redis queues), PostgreSQL, Puppeteer/Playwright, TensorFlow.js

## Architecture

### Three-Tier System Architecture

1. **Frontend (Next.js 14 App Router)**
   - Pages in `src/app/` with React Server Components
   - API routes in `src/app/api/` connect to backend core services
   - Real-time updates via WebSocket provider (`src/providers/WebSocketProvider.tsx`)
   - UI components use Tailwind CSS utility classes from `src/app/globals.css`

2. **Backend Core Services (DO NOT MODIFY)**
   - `src/core/engine/` - RPAEngine, JobScheduler, QueueManager
   - `src/core/extraction/` - WebAutomation (Puppeteer), APIExtractor (REST/SOAP/FIX/ISO20022)
   - `src/core/security/` - CredentialVault (AES-256-GCM), Encryption, AuditLogger
   - `src/core/pipeline/` - ETLPipeline, DataValidator, Transformer, StorageManager
   - `src/services/ai/` - DynamicElementDetector (TensorFlow.js)

3. **Worker Processes**
   - `server/workers/extractionWorker.ts` - Background extraction jobs
   - `server/workers/schedulerWorker.ts` - Cron-based job scheduling
   - `server/websocket/websocketServer.ts` - Real-time event broadcasting

### Data Flow

```
User Request (Frontend)
    ↓
Next.js API Routes (/api/*)
    ↓
Backend Core Services (RPAEngine, CredentialVault, etc.)
    ↓
Queue System (BullMQ + Redis)
    ↓
Worker Processes (extraction, scheduling)
    ↓
Banking Network Sources (clearinghouses, processors, banks)
    ↓
ETL Pipeline (validate → transform → load)
    ↓
Data Storage (PostgreSQL, Data Warehouse)
    ↓
WebSocket Events (real-time updates to frontend)
```

### Key Concepts

**Banking Network Types:**
- **Clearinghouses**: ACH-NACHA, SWIFT, FedWire, CHIPS (defined in `config/bankingNetworks.ts`)
- **Payment Processors**: Visa, Mastercard, PayPal, Stripe
- **Shared Infrastructure**: FIS Global, Fiserv, Jack Henry, Temenos
- **Direct Banks**: Web automation templates for bank portals

**Authentication Methods:**
- OAuth 2.0 (token-based)
- Username/Password + MFA (TOTP, SMS, email, hardware token)
- API Keys (custom headers)
- Certificate-based (x509, mutual TLS)

**Job Lifecycle:**
1. User creates job via API (`POST /api/jobs`)
2. RPAEngine schedules job with cron expression
3. JobScheduler triggers execution at scheduled time
4. QueueManager adds job to Redis queue
5. Worker picks up job, executes extraction
6. ETL Pipeline processes data (validate → transform → load)
7. AuditLogger records all operations
8. WebSocket broadcasts real-time updates to frontend

## Development Commands

### Setup
```bash
npm install                    # Install dependencies
cp .env.example .env          # Configure environment variables
npm run db:migrate            # Initialize database schema
```

### Development
```bash
npm run dev                   # Start Next.js dev server (port 3000)
npm run worker                # Start extraction worker
npm run scheduler             # Start scheduler worker
npm run websocket             # Start WebSocket server (port 3001)

# Run all in development (requires concurrently):
concurrently "npm run dev" "npm run worker" "npm run scheduler" "npm run websocket"
```

### Building & Testing
```bash
npm run build                 # Production build
npm run start                 # Start production server
npm run lint                  # Run ESLint
npm run type-check            # TypeScript type checking
npm test                      # Run Jest tests
npm run test:watch            # Watch mode for tests
```

## Critical Path Imports

**ALWAYS import from these TypeScript path aliases:**
```typescript
import { RPAEngine } from '@/core/engine/RPAEngine';
import { CredentialVault } from '@/core/security/CredentialVault';
import { ETLPipeline } from '@/core/pipeline/ETLPipeline';
import { useWebSocket } from '@/hooks/useWebSocket';
import { cn } from '@/lib/utils';
import type { RPAJob, BankingTransaction } from '@/types/rpa.types';
import type { APIResponse, JobCreateRequest } from '@/types/api.types';
```

**Path aliases configured in `tsconfig.json`:**
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/core/*` → `./src/core/*`
- `@/types/*` → `./src/types/*`
- `@/lib/*` → `./src/lib/*`
- `@/services/*` → `./src/services/*`

## Type System

**ALWAYS use existing types from `src/types/rpa.types.ts`:**
- `RPAJob` - Job configuration
- `DataSource` - Banking network source configuration
- `BankingTransaction` - Standardized transaction format
- `ExtractedData` - Extraction results
- `ValidationResult` - Data validation output
- `ETLJob` - Pipeline job tracking
- `AuditLogEntry` - Audit log structure

**API types in `src/types/api.types.ts`:**
- `APIResponse<T>` - Wrapper for all API responses
- `JobCreateRequest`, `JobListResponse` - Jobs API
- `CredentialCreateRequest`, `CredentialResponse` - Credentials API
- `WebSocketMessage`, `WebSocketEvent` - Real-time events

## API Route Pattern

**All API routes follow this structure:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { RPAEngine } from '@/core/engine/RPAEngine';
import type { APIResponse } from '@/types/api.types';

// Singleton pattern for core services
let rpaEngine: RPAEngine;
function getRPAEngine(): RPAEngine {
  if (!rpaEngine) {
    rpaEngine = new RPAEngine();
  }
  return rpaEngine;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const engine = getRPAEngine();
    const data = await engine.someMethod();

    const response: APIResponse<SomeType> = {
      success: true,
      data,
      timestamp: new Date(),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    const response: APIResponse<never> = {
      success: false,
      error: {
        code: 'ERROR_CODE',
        message: error.message || 'Failed',
      },
      timestamp: new Date(),
    };

    return NextResponse.json(response, { status: 500 });
  }
}
```

## WebSocket Integration

**Events emitted by backend core services:**
- `job:scheduled`, `job:started`, `job:completed`, `job:failed`
- `extraction:started`, `extraction:progress`, `extraction:completed`, `extraction:failed`
- `pipeline:started`, `pipeline:stage-change`, `pipeline:batch-progress`, `pipeline:completed`
- `audit:log` - Real-time audit events

**Client-side usage:**
```typescript
'use client';

import { useWebSocket } from '@/hooks/useWebSocket';

export function Component() {
  const { subscribe, isConnected } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe('job:completed', (data) => {
      console.log('Job completed:', data);
    });
    return unsubscribe;
  }, [subscribe]);
}
```

## Styling Conventions

**Use Tailwind utility classes from `src/app/globals.css`:**
- `card-glass` - Glass morphism card
- `card-gradient` - Gradient background card
- `btn-primary`, `btn-secondary`, `btn-danger` - Button variants
- `stat-card` - Dashboard stat cards
- `feature-card` - Feature display cards
- `code-block` - Code syntax blocks
- `badge-success`, `badge-warning`, `badge-danger` - Status badges
- `flow-diagram`, `flow-step` - Process flow visualization

**Merge classes with utility:**
```typescript
import { cn } from '@/lib/utils';

<div className={cn('card-glass', 'p-6', isActive && 'border-primary')} />
```

## Security & Compliance

**Encryption:**
- All credentials encrypted with AES-256-GCM via CredentialVault
- Master key from `ENCRYPTION_MASTER_KEY` environment variable
- PBKDF2 key derivation with 100,000 iterations

**Audit Logging:**
- All operations logged to `AUDIT_LOG_DIR` in JSONL format
- Immutable append-only logs with daily rotation
- Query via AuditLogger.query()

**Compliance Modes:**
- PCI-DSS, GDPR, SOC2, ISO27001 (configured via `COMPLIANCE_MODE`)

## Environment Variables

**Required:**
- `ENCRYPTION_MASTER_KEY` - 32-byte hex key for credential encryption
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_HOST`, `REDIS_PORT` - Redis for queue management
- `AUDIT_LOG_DIR` - Audit log storage path

**Optional:**
- `NEXT_PUBLIC_WS_URL` - WebSocket server URL (default: ws://localhost:3001)
- `ENABLE_AI_DETECTION` - Enable TensorFlow.js UI element detection
- `COMPLIANCE_MODE` - Compliance framework (PCI-DSS, GDPR, SOC2, ISO27001)

## Banking Network Configuration

**File:** `config/bankingNetworks.ts`

All supported banking networks are centrally configured with:
- Authentication methods supported
- Protocols (REST, SOAP, FIX, ISO20022, web-automation)
- API endpoints and documentation URLs
- Capabilities (real-time, batch, webhooks)

**Helper functions:**
```typescript
import { getAllBankingNetworks, getBankingNetworkById } from '@/config/bankingNetworks';
```

## Core Service Patterns

**RPAEngine** (orchestrator):
```typescript
const engine = new RPAEngine();
await engine.scheduleJob(jobConfig);      // Schedule new job
await engine.getJobStatus(jobId);         // Get job status
await engine.extractData(params);         // Trigger extraction
await engine.cancelJob(jobId);            // Cancel job
```

**CredentialVault** (secure storage):
```typescript
const vault = new CredentialVault();
await vault.store(id, data, options);     // Store encrypted
await vault.retrieve(id);                 // Retrieve decrypted
await vault.rotate(id);                   // Rotate credential
await vault.delete(id);                   // Secure deletion
```

**ETLPipeline** (data processing):
```typescript
const pipeline = new ETLPipeline();
const result = await pipeline.process(extractedData);
// Automatically: validate → transform → load
```

## DO NOT Modify

**Never modify these backend core services:**
- `src/core/engine/*` - RPAEngine, JobScheduler, QueueManager
- `src/core/extraction/*` - WebAutomation, APIExtractor
- `src/core/security/*` - CredentialVault, Encryption, AuditLogger
- `src/core/pipeline/*` - ETLPipeline, DataValidator, Transformer, StorageManager
- `src/services/ai/*` - DynamicElementDetector

These are fully implemented and tested. Only call their public methods from API routes.

## Webpack Configuration

**Important:** Next.js config includes fallbacks for server-side modules:
- Puppeteer, TensorFlow.js require `fs`, `net`, `tls`, `crypto` fallbacks disabled for client-side builds
- These modules only run server-side in API routes and worker processes

## Node Version

Requires **Node.js >=18.0.0** and **npm >=9.0.0** (see `package.json` engines)
