import { Task } from "../types/task";
import { sqs, config } from "../config/aws";

export class TaskService {
  static async queueTask(task: Task): Promise<void> {
    await sqs
      .sendMessage({
        QueueUrl: config.taskQueueUrl,
        MessageBody: JSON.stringify(task),
        MessageAttributes: {
          taskId: {
            DataType: "String",
            StringValue: task.taskId,
          },
        },
      })
      .promise();
  }

  static async processTask(task: Task): Promise<void> {
    if (task.taskId.endsWith("3")) {
      throw new Error("Simulated permanent failure for task ID ending with 3");
    }

    if (Math.random() < config.failureRate) {
      throw new Error("Simulated random task processing failure");
    }
  }
}
