import { SQS } from 'aws-sdk';

export const sqs = new SQS();

export const config = {
  maxRetries: process.env.MAX_RETRIES ? parseInt(process.env.MAX_RETRIES, 10) : 2,
  taskQueueUrl: process.env.TASK_QUEUE_URL!,
  failureRate: 0.3 // 30% failure rate for simulation
};