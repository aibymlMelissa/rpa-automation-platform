import * as tf from '@tensorflow/tfjs-node';
import { Page, ElementHandle } from 'puppeteer';

/**
 * AI-powered Dynamic Element Detector for Banking Interfaces
 * Uses TensorFlow.js for intelligent UI element detection
 */
export class AIElementDetector {
  private model: tf.LayersModel | null = null;
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load pre-trained model for UI element detection
      this.model = await tf.loadLayersModel(
        process.env.UI_DETECTOR_MODEL_PATH || 'file://./models/ui-detector/model.json'
      );
      this.initialized = true;
    } catch (error) {
      console.error('Failed to load AI model:', error);
      // Fallback to heuristic-based detection
      this.initialized = false;
    }
  }

  /**
   * Detect login form elements using AI or heuristics
   */
  async detectLoginForm(page: Page): Promise<LoginElements> {
    if (!this.initialized) {
      return await this.detectLoginFormHeuristic(page);
    }

    try {
      // Take screenshot and process with TensorFlow.js
      const screenshot = await page.screenshot({ encoding: 'base64' });
      const image = await this.preprocessImage(screenshot as string);

      // Run inference
      const predictions = (await this.model!.predict(image)) as tf.Tensor;
      const elements = await this.interpretPredictions(predictions, page);

      return {
        username: await this.findElementByPrediction(page, elements.username),
        password: await this.findElementByPrediction(page, elements.password),
        submitButton: await this.findElementByPrediction(page, elements.submit),
      };
    } catch (error) {
      console.error('AI detection failed, falling back to heuristics:', error);
      return await this.detectLoginFormHeuristic(page);
    }
  }

  /**
   * Heuristic-based login form detection (fallback)
   */
  private async detectLoginFormHeuristic(page: Page): Promise<LoginElements> {
    const usernameSelectors = [
      'input[type="text"][name*="user"]',
      'input[type="text"][name*="login"]',
      'input[type="email"]',
      'input[id*="user"]',
      'input[placeholder*="username" i]',
      'input[autocomplete="username"]',
    ];

    const passwordSelectors = [
      'input[type="password"]',
      'input[name*="password"]',
      'input[autocomplete="current-password"]',
    ];

    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      'button[name*="login"]',
    ];

    const username = await this.findFirstMatch(page, usernameSelectors);
    const password = await this.findFirstMatch(page, passwordSelectors);
    const submitButton = await this.findFirstMatch(page, submitSelectors);

    return { username, password, submitButton };
  }

  /**
   * Detect data tables in banking interfaces
   */
  async detectDataTables(page: Page): Promise<ElementHandle[]> {
    const tableSelectors = [
      'table',
      '[role="table"]',
      '[role="grid"]',
      '.data-grid',
      '.transaction-table',
      '.account-table',
      '[class*="table"]',
    ];

    const allTables: ElementHandle[] = [];

    for (const selector of tableSelectors) {
      try {
        const elements = await page.$$(selector);
        allTables.push(...elements);
      } catch (error) {
        continue;
      }
    }

    // Score and filter tables
    const scoredTables = await Promise.all(
      allTables.map(async (table) => ({
        element: table,
        score: await this.calculateTableScore(table, page),
      }))
    );

    // Return high-confidence tables
    return scoredTables
      .filter((t) => t.score > 0.6)
      .sort((a, b) => b.score - a.score)
      .map((t) => t.element);
  }

  /**
   * Calculate confidence score for table detection
   */
  private async calculateTableScore(
    element: ElementHandle,
    page: Page
  ): Promise<number> {
    try {
      const score = await page.evaluate((el) => {
        let points = 0;

        // Has header row
        if (el.querySelector('thead') || el.querySelector('tr:first-child th')) {
          points += 0.3;
        }

        // Multiple rows
        const rows = el.querySelectorAll('tr');
        if (rows.length > 2) points += 0.2;
        if (rows.length > 5) points += 0.1;

        // Banking-specific indicators
        const text = el.textContent?.toLowerCase() || '';
        if (text.includes('transaction')) points += 0.15;
        if (text.includes('amount') || text.includes('balance')) points += 0.15;
        if (text.includes('date')) points += 0.1;
        if (text.includes('account')) points += 0.1;

        // Has cells with numeric data (likely amounts)
        const cells = Array.from(el.querySelectorAll('td'));
        const hasNumericData = cells.some((cell) => {
          const cellText = cell.textContent?.trim() || '';
          return /\$?[\d,]+\.\d{2}/.test(cellText);
        });
        if (hasNumericData) points += 0.2;

        return points;
      }, element);

      return Math.min(score, 1.0);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Preprocess screenshot for model input
   */
  private async preprocessImage(base64Image: string): Promise<tf.Tensor> {
    // Decode base64 to buffer
    const buffer = Buffer.from(base64Image, 'base64');

    // Decode image
    const imageTensor = tf.node.decodeImage(buffer, 3);

    // Resize to model input size (e.g., 224x224)
    const resized = tf.image.resizeBilinear(imageTensor as tf.Tensor3D, [224, 224]);

    // Normalize pixel values
    const normalized = resized.div(255.0);

    // Add batch dimension
    const batched = normalized.expandDims(0);

    return batched;
  }

  /**
   * Interpret model predictions to element coordinates
   */
  private async interpretPredictions(
    predictions: tf.Tensor,
    page: Page
  ): Promise<any> {
    const data = await predictions.data();

    // Convert predictions to element positions
    // This is simplified - actual implementation would map bounding boxes
    return {
      username: { x: data[0], y: data[1] },
      password: { x: data[2], y: data[3] },
      submit: { x: data[4], y: data[5] },
    };
  }

  /**
   * Find element by predicted coordinates
   */
  private async findElementByPrediction(
    page: Page,
    coords: { x: number; y: number }
  ): Promise<string> {
    // Use coordinates to find element at position
    const selector = await page.evaluate((x, y) => {
      const element = document.elementFromPoint(x, y);
      if (!element) return '';

      // Generate unique selector
      if (element.id) return `#${element.id}`;
      if (element.className) {
        const classes = Array.from(element.classList).join('.');
        return `.${classes}`;
      }
      return element.tagName.toLowerCase();
    }, coords.x, coords.y);

    return selector;
  }

  /**
   * Find first matching element from selector list
   */
  private async findFirstMatch(
    page: Page,
    selectors: string[]
  ): Promise<string> {
    for (const selector of selectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          return selector;
        }
      } catch (error) {
        continue;
      }
    }
    return '';
  }

  /**
   * Cleanup resources
   */
  async dispose(): Promise<void> {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}

export interface LoginElements {
  username: string;
  password: string;
  submitButton: string;
}
