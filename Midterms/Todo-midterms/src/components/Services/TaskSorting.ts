// src/services/TaskSortingStrategy.ts
import type { Task, TimedTask, ChecklistTask } from "../TaskTypes/types";

type TaskType = Task | TimedTask | ChecklistTask;

export class TaskSortingStrategy {
  static sortById(tasks: TaskType[]): TaskType[] {
    return [...tasks].sort((a, b) => a.id.localeCompare(b.id));
  }

  static sortByTitle(tasks: TaskType[]): TaskType[] {
    return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
  }

  static sortByDueDate(tasks: TaskType[]): TaskType[] {
    return [...tasks].sort((a, b) => {
      // Handle tasks without due dates (basic tasks and checklist tasks)
      const aDate = 'dueDate' in a ? a.dueDate : new Date(0); // Default to epoch if no date
      const bDate = 'dueDate' in b ? b.dueDate : new Date(0);
      
      return aDate.getTime() - bDate.getTime();
    });
  }

  static sortByCompletion(tasks: TaskType[]): TaskType[] {
    return [...tasks].sort((a, b) => {
      // Completed tasks come after incomplete ones
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  }
}