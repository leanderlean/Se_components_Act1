// src/services/TaskAdapter.ts
import type { Task, TimedTask, ChecklistTask } from "../TaskTypes/types";

type ExternalTask = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
};
export class TaskAdapter {
    static adaptExternalTasks(
      externalTasks: ExternalTask[]
    ): (Task | TimedTask | ChecklistTask)[] {
      return externalTasks.map((externalTask) => {
        // Adapt basic task properties
        const baseTask = {
          id: externalTask.id,
          title: externalTask.title,
          completed: externalTask.completed || false,
        };
  
        // Check if it's a timed task
        if (externalTask.dueDate) {
          const timedTask: TimedTask = {
            ...baseTask,
            dueDate: new Date(externalTask.dueDate),
          };
          console.log("Adapting timed task:", { externalTask, adaptedTask: timedTask });
          return timedTask;
        }
  
        // Check if it's a checklist task
        if (externalTask.subtasks && externalTask.subtasks.length > 0) {
          const checklistTask: ChecklistTask = {
            ...baseTask,
            subtasks: externalTask.subtasks.map((subtask) => ({
              id: subtask.id,
              title: subtask.title,
              completed: subtask.completed,
            })),
          };
          console.log("Adapting checklist task:", { externalTask, adaptedTask: checklistTask });
          return checklistTask;
        }
  
        console.log("Adapting basic task:", { externalTask, adaptedTask: baseTask });
        return baseTask;
      });
    }
  }