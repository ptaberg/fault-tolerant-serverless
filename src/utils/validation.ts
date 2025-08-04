import { Task } from '../types/task';

export class ValidationUtils {
  static validateTask(task: Task): string | null {
    if (!task.taskId) {
      return 'taskId is required';
    }
    if (!task.payload) {
      return 'payload is required';
    }
    return null;
  }

  static parseAndValidateTask(body: string | null): { task?: Task; error?: string } {
    if (!body) {
      return { error: 'Request body is required' };
    }

    try {
      const task = JSON.parse(body) as Task;
      const validationError = this.validateTask(task);
      if (validationError) {
        return { error: validationError };
      }
      return { task };
    } catch (error) {
      return { error: 'Invalid JSON in request body' };
    }
  }
}