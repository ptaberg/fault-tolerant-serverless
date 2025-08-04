import { SQSEvent, SQSHandler, Context } from "aws-lambda";
import { Task } from "../types/task";
import { TaskService } from "../services/taskService";
import { LoggerService, LogAction } from "../services/loggerService";

export const handler: SQSHandler = async (
  event: SQSEvent,
  context: Context
) => {
  const logger = LoggerService.getInstance();
  logger.setDefaultContext(context);
  for (const record of event.Records) {
    const task: Task = JSON.parse(record.body);
    try {
      logger.info("Processing task", {
        taskId: task.taskId,
        action: LogAction.PROCESS_TASK_START,
      });

      await TaskService.processTask(task);

      logger.info("Task processed successfully", {
        taskId: task.taskId,
        action: LogAction.PROCESS_TASK_SUCCESS,
      });
    } catch (error) {
      logger.error("Error processing task", {
        error: error as Error,
        action: LogAction.PROCESS_TASK_ERROR,
        messageId: record.messageId,
        taskId: task.taskId,
        retryCount: task.retryCount,
        payload: task.payload,
      });
      throw error; // Re-throw to trigger SQS retry
    }
  }
};
