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

    logger.info("Task exceeded maximum retry attempts", {
      taskId: task.taskId,
      action: LogAction.TASK_DLQ,
      messageId: record.messageId,
      originalMessage: record.body,
    });
  }
};
