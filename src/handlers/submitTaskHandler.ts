import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";
import { ValidationUtils } from "../utils/validation";
import { TaskService } from "../services/taskService";
import { LoggerService, LogAction } from "../services/loggerService";

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> => {
  const logger = LoggerService.getInstance();
  logger.setDefaultContext(context);
  try {
    const { task, error } = ValidationUtils.parseAndValidateTask(
      event.body || null
    );

    if (error) {
      logger.warn("Task validation failed", { error: new Error(error) });
      return {
        statusCode: 400,
        body: JSON.stringify({ error }),
      };
    }

    logger.info("Queueing task", {
      taskId: task!.taskId,
      action: LogAction.SUBMIT_TASK,
    });
    await TaskService.queueTask(task!);

    logger.info("Task submitted successfully", {
      taskId: task!.taskId,
      action: LogAction.TASK_SUBMITTED,
    });
    return {
      statusCode: 202,
      body: JSON.stringify({
        message: "Task submitted successfully",
        taskId: task!.taskId,
      }),
    };
  } catch (error) {
    logger.error("Error submitting task", {
      error: error as Error,
      action: LogAction.SUBMIT_TASK_ERROR,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
