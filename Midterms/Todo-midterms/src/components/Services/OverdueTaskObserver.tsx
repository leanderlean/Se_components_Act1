// src/services/OverdueTaskObserver.ts
import { taskManager } from './TaskManager';
import type { TimedTask } from '../TaskTypes/types';
export class OverdueTaskObserver {
  private static instance: OverdueTaskObserver;
  private overdueTasks: TimedTask[] = [];
  private observers: ((tasks: TimedTask[]) => void)[] = [];

  private constructor() {
    // Check for overdue tasks every minute
    setInterval(() => this.checkOverdueTasks(), 60000);
  }

  public static getInstance(): OverdueTaskObserver {
    if (!OverdueTaskObserver.instance) {
      OverdueTaskObserver.instance = new OverdueTaskObserver();
    }
    return OverdueTaskObserver.instance;
  }

  public subscribe(callback: (tasks: TimedTask[]) => void): void {
    this.observers.push(callback);
  }

  public unsubscribe(callback: (tasks: TimedTask[]) => void): void {
    this.observers = this.observers.filter(observer => observer !== callback);
  }

  private notifyObservers(): void {
    this.observers.forEach(observer => observer(this.overdueTasks));
  }

  public checkOverdueTasks(): TimedTask[] {
    const now = new Date();
    this.overdueTasks = taskManager.getAllTasks().filter(task => {
      return 'dueDate' in task && 
             task.dueDate < now && 
             !task.completed;
    }) as TimedTask[];

    this.notifyObservers();
    return this.overdueTasks;
  }

  public getOverdueTasks(): TimedTask[] {
    return this.overdueTasks;
  }
}

export const overdueTaskObserver = OverdueTaskObserver.getInstance();