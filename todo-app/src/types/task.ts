import { Timestamp } from "firebase/firestore";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  subtasks: SubTask[];
  priority: Priority;
  category?: string;
  createdAt: Timestamp;
  deleted: boolean;
}

// Helpers derivados (no se guardan en Firestore)
export const getTaskStatus = (task: Task): TaskStatus => {
  if (task.subtasks.length === 0) return "pending";
  const done = task.subtasks.filter((s) => s.completed).length;
  if (done === 0) return "pending";
  if (done === task.subtasks.length) return "completed";
  return "in-progress";
};

export const getProgress = (task: Task): number => {
  if (task.subtasks.length === 0) return 0;
  return Math.round(
    (task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100
  );
};