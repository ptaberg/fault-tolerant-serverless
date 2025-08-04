import { Context } from 'aws-lambda';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export enum LogAction {
  // Task submission flow
  SUBMIT_TASK = 'SUBMIT_TASK',
  TASK_SUBMITTED = 'TASK_SUBMITTED',
  SUBMIT_TASK_ERROR = 'SUBMIT_TASK_ERROR',

  // Task processing flow
  PROCESS_TASK_START = 'PROCESS_TASK_START',
  PROCESS_TASK_SUCCESS = 'PROCESS_TASK_SUCCESS',
  PROCESS_TASK_ERROR = 'PROCESS_TASK_ERROR',

  // DLQ handling
  TASK_DLQ = 'TASK_DLQ',
  DLQ_PROCESSING_ERROR = 'DLQ_PROCESSING_ERROR',

  // Validation
  TASK_VALIDATION_FAILED = 'TASK_VALIDATION_FAILED'
}

export interface LogContext {
  requestId?: string;
  taskId?: string;
  action?: LogAction;
  error?: Error;
  [key: string]: any;
}

export class LoggerService {
  private static instance: LoggerService;
  private defaultContext: Partial<LogContext> = {};

  private constructor() {}

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public setDefaultContext(context: Context): void {
    this.defaultContext = {
      requestId: context.awsRequestId
    };
  }

  private formatMessage(level: LogLevel, message: string, context: LogContext = {}): string {
    const timestamp = new Date().toISOString();
    const logContext = {
      ...this.defaultContext,
      ...context,
      error: context.error ? {
        message: context.error.message,
        stack: context.error.stack,
        name: context.error.name
      } : undefined
    };

    // Structure for easy CloudWatch Log Insights querying
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...logContext
    });
  }

  public info(message: string, context: LogContext = {}): void {
    console.log(this.formatMessage(LogLevel.INFO, message, context));
  }

  public warn(message: string, context: LogContext = {}): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  public error(message: string, context: LogContext = {}): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, context));
  }

  public debug(message: string, context: LogContext = {}): void {
    console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
  }
}