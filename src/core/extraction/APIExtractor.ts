import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ExtractedData, BankingTransaction } from '@/types/rpa.types';
import { CredentialVault } from '../security/CredentialVault';

/**
 * API Extractor for Banking Network Utilities
 * Supports REST, SOAP, FIX, and ISO20022 protocols
 */
export class APIExtractor {
  private client: AxiosInstance;
  private credentialVault: CredentialVault;

  constructor(private options: APIExtractorOptions = {}) {
    this.credentialVault = new CredentialVault();

    this.client = axios.create({
      timeout: options.timeout || 30000,
      maxRedirects: options.maxRedirects || 5,
      validateStatus: (status) => status < 500,
    });

    // Set up request interceptors
    this.setupInterceptors();
  }

  /**
   * Extract data from banking API endpoint
   */
  async extract(params: APIExtractionParams): Promise<ExtractedData> {
    const startTime = Date.now();

    try {
      // Retrieve credentials from vault
      const credentials = await this.credentialVault.retrieve(
        params.credentialId
      );

      // Prepare request configuration
      const config = await this.prepareRequest(params, credentials);

      // Execute API request
      const response = await this.client.request(config);

      // Parse response based on protocol
      const parsedData = await this.parseResponse(
        response.data,
        params.protocol
      );

      // Extract banking transactions if applicable
      const transactions = this.extractTransactions(parsedData);

      const extractionDuration = Date.now() - startTime;

      // Create checksum
      const crypto = await import('crypto');
      const checksumHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(parsedData))
        .digest('hex');

      return {
        jobId: params.jobId,
        timestamp: new Date(),
        rawData: parsedData,
        metadata: {
          source: params.endpoint,
          extractionDuration,
          recordCount: transactions.length || 1,
          fileFormat: params.protocol.toLowerCase(),
          compressionUsed: false,
          checksumHash,
        },
        validationStatus: {
          isValid: true,
          errors: [],
          warnings: [],
          validatedAt: new Date(),
          validationRules: ['api-response-validation'],
        },
        transactionCount: transactions.length,
        dataSize: JSON.stringify(parsedData).length,
      };
    } catch (error) {
      throw new Error(
        `API extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Prepare API request with authentication
   */
  private async prepareRequest(
    params: APIExtractionParams,
    credentials: any
  ): Promise<AxiosRequestConfig> {
    const config: AxiosRequestConfig = {
      url: params.endpoint,
      method: params.method || 'GET',
      headers: {
        'Content-Type': this.getContentType(params.protocol),
        'User-Agent': 'RPA-Banking-Platform/1.0',
        ...params.headers,
      },
    };

    // Add authentication
    switch (credentials.type) {
      case 'oauth':
        config.headers!['Authorization'] = `Bearer ${credentials.token}`;
        break;
      case 'api-key':
        config.headers![credentials.headerName || 'X-API-Key'] = credentials.key;
        break;
      case 'basic':
        config.auth = {
          username: credentials.username,
          password: credentials.password,
        };
        break;
    }

    // Add request body if POST/PUT
    if (params.method !== 'GET' && params.payload) {
      config.data = this.formatPayload(params.payload, params.protocol);
    }

    return config;
  }

  /**
   * Parse API response based on protocol
   */
  private async parseResponse(data: any, protocol: string): Promise<any> {
    switch (protocol.toUpperCase()) {
      case 'REST':
        return data;

      case 'SOAP':
        return this.parseSOAPResponse(data);

      case 'ISO20022':
        return this.parseISO20022Response(data);

      case 'FIX':
        return this.parseFIXResponse(data);

      default:
        return data;
    }
  }

  /**
   * Parse SOAP XML response
   */
  private parseSOAPResponse(xmlData: string): any {
    // In production, use a proper XML parser like fast-xml-parser
    // This is a simplified implementation
    try {
      const match = xmlData.match(/<.*Body>(.*)<\/.*Body>/s);
      if (match) {
        return { body: match[1] };
      }
      return xmlData;
    } catch (error) {
      return xmlData;
    }
  }

  /**
   * Parse ISO20022 XML response
   */
  private parseISO20022Response(xmlData: string): any {
    // Parse ISO20022 payment message format
    // This would use a proper ISO20022 parser in production
    return { iso20022Data: xmlData };
  }

  /**
   * Parse FIX protocol response
   */
  private parseFIXResponse(fixMessage: string): any {
    // Parse FIX (Financial Information eXchange) protocol messages
    const fields = fixMessage.split('|');
    const parsed: any = {};

    fields.forEach((field) => {
      const [tag, value] = field.split('=');
      if (tag && value) {
        parsed[tag] = value;
      }
    });

    return parsed;
  }

  /**
   * Extract banking transactions from parsed data
   */
  private extractTransactions(data: any): BankingTransaction[] {
    const transactions: BankingTransaction[] = [];

    // Handle array of transactions
    if (Array.isArray(data)) {
      return data.map((item) => this.normalizeTransaction(item));
    }

    // Handle nested transaction data
    if (data.transactions && Array.isArray(data.transactions)) {
      return data.transactions.map((item: any) => this.normalizeTransaction(item));
    }

    // Handle single transaction
    if (data.transactionId || data.amount) {
      return [this.normalizeTransaction(data)];
    }

    return transactions;
  }

  /**
   * Normalize transaction data to standard format
   */
  private normalizeTransaction(data: any): BankingTransaction {
    return {
      transactionId: data.transactionId || data.id || '',
      accountNumber: data.accountNumber || data.account || '',
      amount: parseFloat(data.amount) || 0,
      currency: data.currency || 'USD',
      transactionType: data.type || 'transfer',
      timestamp: new Date(data.timestamp || data.date || Date.now()),
      status: data.status || 'completed',
      sourceBank: data.sourceBank || data.from,
      destinationBank: data.destinationBank || data.to,
      clearinghouseReference: data.clearinghouseRef || data.reference,
    };
  }

  /**
   * Get content type header for protocol
   */
  private getContentType(protocol: string): string {
    switch (protocol.toUpperCase()) {
      case 'REST':
        return 'application/json';
      case 'SOAP':
      case 'ISO20022':
        return 'application/xml';
      case 'FIX':
        return 'text/plain';
      default:
        return 'application/json';
    }
  }

  /**
   * Format payload based on protocol
   */
  private formatPayload(payload: any, protocol: string): any {
    switch (protocol.toUpperCase()) {
      case 'REST':
        return payload;
      case 'SOAP':
        return this.createSOAPEnvelope(payload);
      case 'ISO20022':
        return this.createISO20022Message(payload);
      default:
        return payload;
    }
  }

  /**
   * Create SOAP envelope
   */
  private createSOAPEnvelope(body: any): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    ${JSON.stringify(body)}
  </soap:Body>
</soap:Envelope>`;
  }

  /**
   * Create ISO20022 message
   */
  private createISO20022Message(data: any): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd">
  <FIToFIPmtStsRpt>
    ${JSON.stringify(data)}
  </FIToFIPmtStsRpt>
</Document>`;
  }

  /**
   * Set up request/response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Log request
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log response
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          console.warn(`Rate limited. Retry after ${retryAfter}s`);
        }
        return Promise.reject(error);
      }
    );
  }
}

export interface APIExtractorOptions {
  timeout?: number;
  maxRedirects?: number;
  retryAttempts?: number;
}

export interface APIExtractionParams {
  jobId: string;
  endpoint: string;
  protocol: 'REST' | 'SOAP' | 'FIX' | 'ISO20022';
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  credentialId: string;
  headers?: Record<string, string>;
  payload?: any;
}
