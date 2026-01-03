import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import { QueueJob, WorkerConfig } from '@/types/rpa.types';

/**
 * Queue Manager for Banking Network Data Processing
 * Handles distributed job processing using Redis and BullMQ
 */
export class QueueManager {
  private queues: Map<string, Queue>;
  private workers: Map<string, Worker>;
  private queueEvents: Map<string, QueueEvents>;
  private redisConnection: Redis;

  constructor() {
    this.queues = new Map();
    this.workers = new Map();
    this.queueEvents = new Map();

    // Initialize Redis connection
    this.redisConnection = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null,
    });
  }

  /**
   * Create a new queue for job processing
   */
  createQueue(queueName: string): Queue {
    if (this.queues.has(queueName)) {
      return this.queues.get(queueName)!;
    }

    const queue = new Queue(queueName, {
      connection: this.redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: {
          age: 86400, // 24 hours
          count: 1000,
        },
        removeOnFail: {
          age: 604800, // 7 days
        },
      },
    });

    this.queues.set(queueName, queue);

    // Set up queue events
    const events = new QueueEvents(queueName, {
      connection: this.redisConnection,
    });

    this.queueEvents.set(queueName, events);
    this.setupEventListeners(events, queueName);

    return queue;
  }

  /**
   * Add a job to the queue
   */
  async addJob<T = any>(
    queueName: string,
    jobName: string,
    data: T,
    options?: any
  ): Promise<Job> {
    let queue = this.queues.get(queueName);

    if (!queue) {
      queue = this.createQueue(queueName);
    }

    const job = await queue.add(jobName, data, options);
    return job;
  }

  /**
   * Create a worker to process jobs
   */
  createWorker(
    queueName: string,
    processor: (job: Job) => Promise<any>,
    config?: WorkerConfig
  ): Worker {
    if (this.workers.has(queueName)) {
      return this.workers.get(queueName)!;
    }

    const worker = new Worker(queueName, processor, {
      connection: this.redisConnection,
      concurrency: config?.concurrency || 5,
      limiter: {
        max: config?.maxJobsPerWorker || 10,
        duration: 1000,
      },
      lockDuration: config?.lockDuration || 30000,
      stalledInterval: config?.stalledInterval || 30000,
    });

    this.workers.set(queueName, worker);
    this.setupWorkerEventListeners(worker, queueName);

    return worker;
  }

  /**
   * Set up event listeners for queue monitoring
   */
  private setupEventListeners(events: QueueEvents, queueName: string): void {
    events.on('completed', ({ jobId, returnvalue }) => {
      console.log(`[${queueName}] Job ${jobId} completed with result:`, returnvalue);
    });

    events.on('failed', ({ jobId, failedReason }) => {
      console.error(`[${queueName}] Job ${jobId} failed:`, failedReason);
    });

    events.on('progress', ({ jobId, data }) => {
      console.log(`[${queueName}] Job ${jobId} progress:`, data);
    });

    events.on('stalled', ({ jobId }) => {
      console.warn(`[${queueName}] Job ${jobId} has stalled`);
    });
  }

  /**
   * Set up event listeners for worker monitoring
   */
  private setupWorkerEventListeners(worker: Worker, queueName: string): void {
    worker.on('completed', (job) => {
      console.log(`[${queueName}] Worker completed job ${job.id}`);
    });

    worker.on('failed', (job, err) => {
      console.error(`[${queueName}] Worker failed job ${job?.id}:`, err);
    });

    worker.on('error', (err) => {
      console.error(`[${queueName}] Worker error:`, err);
    });
  }

  /**
   * Get job status and details
   */
  async getJobStatus(jobId: string): Promise<any> {
    for (const [queueName, queue] of this.queues) {
      const job = await queue.getJob(jobId);
      if (job) {
        const state = await job.getState();
        return {
          id: job.id,
          name: job.name,
          data: job.data,
          state,
          attemptsMade: job.attemptsMade,
          progress: job.progress,
          timestamp: job.timestamp,
          processedOn: job.processedOn,
          finishedOn: job.finishedOn,
          failedReason: job.failedReason,
        };
      }
    }
    return null;
  }

  /**
   * Cancel a job
   */
  async cancelJob(jobId: string): Promise<void> {
    for (const queue of this.queues.values()) {
      const job = await queue.getJob(jobId);
      if (job) {
        await job.remove();
        return;
      }
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(queueName: string): Promise<any> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      queueName,
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  }

  /**
   * Pause a queue
   */
  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (queue) {
      await queue.pause();
    }
  }

  /**
   * Resume a paused queue
   */
  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (queue) {
      await queue.resume();
    }
  }

  /**
   * Clean old jobs from queue
   */
  async cleanQueue(queueName: string, grace: number = 86400000): Promise<void> {
    const queue = this.queues.get(queueName);
    if (queue) {
      await queue.clean(grace, 1000, 'completed');
      await queue.clean(grace * 7, 1000, 'failed');
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    // Close all workers
    for (const worker of this.workers.values()) {
      await worker.close();
    }

    // Close all queue events
    for (const events of this.queueEvents.values()) {
      await events.close();
    }

    // Close all queues
    for (const queue of this.queues.values()) {
      await queue.close();
    }

    // Disconnect Redis
    await this.redisConnection.quit();

    this.workers.clear();
    this.queueEvents.clear();
    this.queues.clear();
  }
}
