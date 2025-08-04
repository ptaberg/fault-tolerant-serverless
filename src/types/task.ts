export interface Task {
  taskId: string;
  payload: Record<string, any>;
  retryCount?: number;
}