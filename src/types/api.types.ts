/**
 * API Response Types
 * Defines TypeScript types for all API endpoints
 */

import type {
  RPAJob,
  ExtractedData,
  ETLJob,
  AuditLogEntry,
  ValidationResult,
  TransformationRule,
  BankingTransaction,
} from './rpa.types';

/**
 * Generic API Response Wrapper
 */
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
}

/**
 * Job Management API Types
 */
export interface JobListResponse {
  jobs: RPAJob[];
  total: number;
  page: number;
  pageSize: number;
}

export interface JobCreateRequest {
  name: string;
  schedule: {
    expression: string;
    timezone: string;
    preferredHours?: number[];
  };
  source: {
    networkId: string;
    type: 'clearinghouse' | 'payment-processor' | 'shared-infrastructure' | 'direct-bank';
    url?: string;
    apiEndpoint?: string;
    selectors?: WebSelectors;
  };
  credentialId: string;
  extractionMethod: 'web-automation' | 'api';
  retryConfig: {
    maxAttempts: number;
    backoffStrategy: 'linear' | 'exponential' | 'constant';
    initialDelay: number;
    maxDelay: number;
  };
}

export interface WebSelectors {
  loginForm?: string;
  usernameField?: string;
  passwordField?: string;
  submitButton?: string;
  dataTable?: string;
  downloadButton?: string;
  navigationElements?: Record<string, string>;
}

export interface JobUpdateRequest {
  name?: string;
  schedule?: {
    expression?: string;
    timezone?: string;
    preferredHours?: number[];
  };
  retryConfig?: {
    maxAttempts?: number;
    backoffStrategy?: 'linear' | 'exponential' | 'constant';
    initialDelay?: number;
    maxDelay?: number;
  };
}

export interface JobStatusResponse {
  job: RPAJob;
  currentStatus: 'idle' | 'running' | 'completed' | 'failed' | 'paused';
  lastExecution?: {
    startedAt: Date;
    completedAt?: Date;
    status: 'success' | 'failed';
    error?: string;
    recordsExtracted?: number;
  };
  nextExecution?: Date;
  executionHistory: Array<{
    executionId: string;
    startedAt: Date;
    completedAt?: Date;
    status: 'success' | 'failed';
    recordsExtracted?: number;
    error?: string;
  }>;
}

/**
 * Extraction API Types
 */
export interface ExtractionTriggerRequest {
  jobId?: string;
  source: {
    networkId: string;
    type: 'clearinghouse' | 'payment-processor' | 'shared-infrastructure' | 'direct-bank';
    url?: string;
    apiEndpoint?: string;
  };
  credentialId: string;
  extractionMethod: 'web-automation' | 'api';
  selectors?: WebSelectors;
}

export interface ExtractionDataResponse {
  extractedData: ExtractedData;
  transactions?: BankingTransaction[];
  validationResult: ValidationResult;
}

export interface ExtractionPreviewRequest {
  source: {
    networkId: string;
    url?: string;
    selectors?: WebSelectors;
  };
  credentialId: string;
}

export interface ExtractionPreviewResponse {
  preview: {
    detectedElements: Array<{
      type: 'form' | 'table' | 'button' | 'link';
      selector: string;
      text?: string;
      confidence: number;
    }>;
    suggestedSelectors: WebSelectors;
    screenshot?: string; // Base64 encoded
  };
}

/**
 * Credentials API Types
 */
export interface CredentialCreateRequest {
  type: 'oauth' | 'basic' | 'api-key' | 'certificate';
  data: OAuthCredentialData | BasicCredentialData | APIKeyCredentialData | CertificateCredentialData;
  metadata: {
    description: string;
    tags: string[];
  };
  expiresAt?: Date;
  rotationPolicy: 'manual' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

export interface OAuthCredentialData {
  clientId: string;
  clientSecret: string;
  tokenEndpoint: string;
  scope?: string[];
}

export interface BasicCredentialData {
  username: string;
  password: string;
  mfaToken?: string;
  mfaMethod?: 'totp' | 'sms' | 'email' | 'hardware-token';
}

export interface APIKeyCredentialData {
  key: string;
  headerName?: string;
}

export interface CertificateCredentialData {
  certificate: string;
  privateKey: string;
  passphrase?: string;
}

export interface CredentialResponse {
  id: string;
  type: 'oauth' | 'basic' | 'api-key' | 'certificate';
  metadata: {
    description: string;
    tags: string[];
  };
  createdAt: Date;
  expiresAt?: Date;
  rotationPolicy: 'manual' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastRotated: Date;
  daysUntilExpiration?: number;
  needsRotation: boolean;
}

export interface CredentialListResponse {
  credentials: CredentialResponse[];
  total: number;
}

/**
 * Pipeline API Types
 */
export interface PipelineProcessRequest {
  extractedDataId: string;
  transformationRules?: TransformationRule[];
  destination: {
    type: 'warehouse' | 'database' | 'file' | 'api';
    config: WarehouseDestination | DatabaseDestination | FileDestination | APIDestination;
  };
}

export interface WarehouseDestination {
  provider: 'bigquery' | 'snowflake' | 'redshift';
  dataset: string;
  table: string;
  credentials: any;
}

export interface DatabaseDestination {
  type: 'postgresql' | 'mysql' | 'mongodb';
  connectionString: string;
  table: string;
}

export interface FileDestination {
  format: 'json' | 'csv' | 'parquet';
  path: string;
}

export interface APIDestination {
  endpoint: string;
  method: 'POST' | 'PUT';
  headers: Record<string, string>;
  batchSize: number;
}

export interface PipelineStatusResponse {
  job: ETLJob;
  currentStage: 'extract' | 'validate' | 'transform' | 'load';
  progress: {
    stage: string;
    percentage: number;
    recordsProcessed: number;
    totalRecords: number;
  };
  stages: Array<{
    name: 'extract' | 'validate' | 'transform' | 'load';
    status: 'pending' | 'running' | 'completed' | 'failed';
    startedAt?: Date;
    completedAt?: Date;
    recordsProcessed?: number;
    errors?: number;
    warnings?: number;
  }>;
}

export interface PipelineStatisticsResponse {
  totalJobsProcessed: number;
  successRate: number;
  averageProcessingTime: number;
  recordsByStage: {
    extracted: number;
    validated: number;
    transformed: number;
    loaded: number;
  };
  errorsByType: Record<string, number>;
}

/**
 * Audit API Types
 */
export interface AuditLogQueryRequest {
  userId?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
  result?: 'success' | 'failure';
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface AuditLogQueryResponse {
  logs: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuditStatisticsResponse {
  totalEvents: number;
  successCount: number;
  failureCount: number;
  uniqueUsers: number;
  actionBreakdown: Record<string, number>;
  resourceBreakdown: Record<string, number>;
}

/**
 * Analytics API Types
 */
export interface DashboardAnalyticsResponse {
  jobs: {
    total: number;
    active: number;
    completed: number;
    failed: number;
  };
  extraction: {
    totalRecords: number;
    todayRecords: number;
    successRate: number;
    averageTimeMs: number;
  };
  pipeline: {
    processing: number;
    completed: number;
    failed: number;
    throughput: number; // records per hour
  };
  system: {
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;
    version: string;
  };
}

export interface JobAnalyticsResponse {
  successRate: number;
  failureRate: number;
  averageExecutionTime: number;
  executionsByDay: Array<{
    date: string;
    successful: number;
    failed: number;
  }>;
  topFailureReasons: Array<{
    reason: string;
    count: number;
  }>;
}

export interface ExtractionAnalyticsResponse {
  recordsBySource: Array<{
    sourceId: string;
    sourceName: string;
    records: number;
  }>;
  extractionsByMethod: {
    webAutomation: number;
    api: number;
  };
  averageRecordsPerJob: number;
  dataQualityScore: number;
}

export interface PerformanceMetricsResponse {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  queue: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
  responseTime: {
    p50: number;
    p95: number;
    p99: number;
  };
}

/**
 * WebSocket Event Types
 */
export interface WebSocketMessage {
  event: WebSocketEvent;
  data: any;
  timestamp: Date;
}

export type WebSocketEvent =
  | 'job:scheduled'
  | 'job:started'
  | 'job:completed'
  | 'job:failed'
  | 'job:paused'
  | 'job:resumed'
  | 'job:cancelled'
  | 'extraction:started'
  | 'extraction:progress'
  | 'extraction:completed'
  | 'extraction:failed'
  | 'pipeline:started'
  | 'pipeline:stage-change'
  | 'pipeline:batch-progress'
  | 'pipeline:completed'
  | 'pipeline:failed'
  | 'audit:log'
  | 'system:status';

export interface JobScheduledEvent {
  jobId: string;
  config: RPAJob;
}

export interface JobCompletedEvent {
  jobId: string;
  result: ExtractedData;
  executionTime: number;
}

export interface JobFailedEvent {
  jobId: string;
  error: string;
  retryAttempt: number;
  maxAttempts: number;
}

export interface ExtractionProgressEvent {
  jobId: string;
  progress: number;
  currentStep: string;
}

export interface PipelineStageChangeEvent {
  jobId: string;
  stage: 'extract' | 'validate' | 'transform' | 'load';
  progress: number;
  recordsProcessed: number;
  totalRecords: number;
}

export interface PipelineBatchProgressEvent {
  processed: number;
  total: number;
  batchNumber: number;
  totalBatches: number;
}

export interface SystemStatusEvent {
  status: 'healthy' | 'degraded' | 'down';
  services: {
    database: boolean;
    redis: boolean;
    websocket: boolean;
    workers: number;
  };
  timestamp: Date;
}

/**
 * Banking Sources API Types
 */
export interface BankingSourceTestRequest {
  sourceId: string;
  credentialId: string;
}

export interface BankingSourceTestResponse {
  success: boolean;
  responseTime: number;
  connectionStatus: 'connected' | 'failed';
  error?: string;
  capabilities?: {
    realTime: boolean;
    batch: boolean;
    webhooks: boolean;
  };
}

/**
 * Error Types
 */
export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  path?: string;
  validationErrors?: ValidationError[];
}
