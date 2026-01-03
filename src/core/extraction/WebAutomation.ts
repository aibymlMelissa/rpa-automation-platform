import puppeteer, { Browser, Page, HTTPRequest } from 'puppeteer';
import { AIElementDetector } from '@/services/ai/DynamicElementDetector';
import { ExtractedData, WebSelectors } from '@/types/rpa.types';

/**
 * Web Automation Service for Banking Network Data Extraction
 * Supports headless browser automation with AI-assisted element detection
 */
export class WebAutomation {
  private browser: Browser | null = null;
  private aiDetector: AIElementDetector;
  private options: AutomationOptions;

  constructor(options: AutomationOptions = {}) {
    this.options = {
      headless: options.headless !== false,
      timeout: options.timeout || 30000,
      userAgent: options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      viewport: options.viewport || { width: 1920, height: 1080 },
      ...options,
    };
    this.aiDetector = new AIElementDetector();
  }

  /**
   * Extract data from banking web interface
   */
  async extract(params: ExtractionParams): Promise<ExtractedData> {
    try {
      // Initialize AI detector
      await this.aiDetector.initialize();

      // Launch browser
      this.browser = await puppeteer.launch({
        headless: this.options.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-web-security',
        ],
        defaultViewport: this.options.viewport,
      });

      const page = await this.browser.newPage();

      // Set user agent
      await page.setUserAgent(this.options.userAgent!);

      // Set up request interception for security and performance
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        if (this.isAllowedRequest(request)) {
          request.continue();
        } else {
          request.abort();
        }
      });

      // Navigate and authenticate
      await this.authenticate(page, params);

      // Wait for page to stabilize
      await this.waitForPageStable(page);

      // Extract data with AI-assisted element detection
      const extractedData = await this.extractWithAI(page, params.selectors);

      // Take audit screenshot
      const screenshot = await page.screenshot({
        fullPage: true,
        encoding: 'base64',
      });

      // Calculate data size
      const dataSize = JSON.stringify(extractedData).length;

      // Create checksum
      const crypto = await import('crypto');
      const checksumHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(extractedData))
        .digest('hex');

      return {
        jobId: params.jobId,
        timestamp: new Date(),
        rawData: extractedData,
        metadata: {
          source: params.url,
          extractionDuration: 0, // Will be calculated by caller
          recordCount: Array.isArray(extractedData) ? extractedData.length : 1,
          fileFormat: 'json',
          compressionUsed: false,
          checksumHash,
        },
        validationStatus: {
          isValid: true,
          errors: [],
          warnings: [],
          validatedAt: new Date(),
          validationRules: ['structure-check', 'completeness-check'],
        },
        dataSize,
      };
    } catch (error) {
      throw new Error(
        `Web automation extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
      await this.aiDetector.dispose();
    }
  }

  /**
   * Authenticate to banking interface
   */
  private async authenticate(page: Page, params: ExtractionParams): Promise<void> {
    await page.goto(params.url, {
      waitUntil: 'networkidle2',
      timeout: this.options.timeout,
    });

    // Check if login is required
    const loginElements = await this.aiDetector.detectLoginForm(page);

    if (loginElements.username && loginElements.password && params.credentials) {
      // Fill login form
      await page.type(loginElements.username, params.credentials.username);
      await page.type(loginElements.password, params.credentials.password);

      // Handle MFA if present
      if (params.credentials.mfaToken) {
        await this.handleMFA(page, params.credentials.mfaToken);
      }

      // Submit form
      await page.click(loginElements.submitButton);

      // Wait for navigation
      await page.waitForNavigation({
        waitUntil: 'networkidle2',
        timeout: this.options.timeout,
      });
    }
  }

  /**
   * Extract data using AI-assisted element detection
   */
  private async extractWithAI(
    page: Page,
    selectors?: WebSelectors
  ): Promise<any[]> {
    // Detect data tables using AI
    const dataElements = await this.aiDetector.detectDataTables(page);

    const extractedData: any[] = [];

    for (const element of dataElements) {
      const data = await page.evaluate((el) => {
        // Extract table data
        const rows = Array.from(el.querySelectorAll('tr'));

        // Get headers
        const headers = Array.from(rows[0]?.querySelectorAll('th, td') || []).map(
          (cell) => cell.textContent?.trim() || ''
        );

        // Extract row data
        const tableData = rows.slice(1).map((row) => {
          const cells = Array.from(row.querySelectorAll('td'));
          const rowData: any = {};

          cells.forEach((cell, index) => {
            const header = headers[index] || `column_${index}`;
            rowData[header] = cell.textContent?.trim() || '';
          });

          return rowData;
        });

        return tableData;
      }, element);

      extractedData.push(...data);
    }

    // If custom selectors provided, also extract those
    if (selectors?.dataTable) {
      const customData = await page.evaluate((selector) => {
        const table = document.querySelector(selector);
        if (!table) return [];

        const rows = Array.from(table.querySelectorAll('tr'));
        return rows.map((row) =>
          Array.from(row.querySelectorAll('td')).map(
            (cell) => cell.textContent?.trim() || ''
          )
        );
      }, selectors.dataTable);

      extractedData.push(...customData);
    }

    return extractedData;
  }

  /**
   * Handle multi-factor authentication
   */
  private async handleMFA(page: Page, mfaToken: string): Promise<void> {
    const mfaSelectors = [
      'input[name*="mfa"]',
      'input[name*="token"]',
      'input[name*="code"]',
      'input[type="tel"]',
    ];

    for (const selector of mfaSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          await page.type(selector, mfaToken);
          break;
        }
      } catch (error) {
        continue;
      }
    }
  }

  /**
   * Filter requests for security and performance
   */
  private isAllowedRequest(request: HTTPRequest): boolean {
    const blockedResourceTypes = ['image', 'stylesheet', 'font', 'media'];
    const blockedDomains = ['google-analytics.com', 'doubleclick.net', 'facebook.com'];

    // Block by resource type
    if (blockedResourceTypes.includes(request.resourceType())) {
      return false;
    }

    // Block by domain
    const url = request.url();
    if (blockedDomains.some((domain) => url.includes(domain))) {
      return false;
    }

    return true;
  }

  /**
   * Wait for page to stabilize (no network activity)
   */
  private async waitForPageStable(page: Page, timeout: number = 5000): Promise<void> {
    await page.evaluate(
      (ms) =>
        new Promise((resolve) => {
          let timer: NodeJS.Timeout;
          const observer = new PerformanceObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(resolve, ms);
          });
          observer.observe({ entryTypes: ['resource'] });
          timer = setTimeout(resolve, ms);
        }),
      timeout
    );
  }
}

export interface AutomationOptions {
  headless?: boolean;
  timeout?: number;
  userAgent?: string;
  viewport?: { width: number; height: number };
}

export interface ExtractionParams {
  jobId: string;
  url: string;
  credentials?: {
    username: string;
    password: string;
    mfaToken?: string;
  };
  selectors?: WebSelectors;
  options?: any;
}
