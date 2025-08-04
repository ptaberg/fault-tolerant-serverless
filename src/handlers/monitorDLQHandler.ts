import { SQSEvent, SQSHandler, Context } from "aws-lambda";
import { Task } from "../types/task";
import { LoggerService, LogAction } from "../services/loggerService";

export const handler: SQSHandler = async (
  event: SQSEvent,
  context: Context
) => {
  const logger = LoggerService.getInstance();
  logger.setDefaultContext(context);
  for (const record of event.Records) {
    const task: Task = JSON.parse(record.body);
    const dlqError = new Error("Task exceeded maximum retry attempts");

    logger.info("Monitoring DLQ", {
      taskId: task.taskId,
      action: LogAction.TASK_DLQ,
      error: dlqError,
      messageId: record.messageId,
      originalMessage: record.body,
    });
  }
};
