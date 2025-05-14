// src/components/tasks/types.ts

// Define the base task interface
export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

// Timed Task extends the base Task with due date
export interface TimedTask extends Task {
  dueDate: Date;
}

// Checklist Task extends the base Task with subtasks
export interface ChecklistTask extends Task {
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface TaskFactoryProps {
  type: "basic" | "timed" | "checklist";
  // For creation: only onCreate is required
  // For update: both task and onUpdate are required
  task?: Task | TimedTask | ChecklistTask;
  onCreate?: (task: Task | TimedTask | ChecklistTask) => void;
  onUpdate?: (task: Task | TimedTask | ChecklistTask) => void;
}
