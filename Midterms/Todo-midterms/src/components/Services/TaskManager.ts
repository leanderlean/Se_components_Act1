// src/services/TaskManager.ts
import type { Task, TimedTask, ChecklistTask } from "../TaskTypes/types";

type TaskType = Task | TimedTask | ChecklistTask;

class TaskManager {
  private static instance: TaskManager;
  private tasks: TaskType[] = [];

  private constructor() {}

  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }

  // Initialize with existing tasks (optional)
  public init(tasks: TaskType[]): void {
    this.tasks = [...tasks];
  }

  // Get all tasks
  public getAllTasks(): TaskType[] {
    return [...this.tasks];
  }

  // Add a new task
  public addTask(newTask: TaskType): void {
    this.tasks = [...this.tasks, newTask];
  }

  // Update an existing task
  public updateTask(updatedTask: TaskType): void {
    this.tasks = this.tasks.map((task) => 
      task.id === updatedTask.id ? updatedTask : task
    );
  }

  // Remove a task by ID
  public removeTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  // Search tasks by title
  public searchTasks(query: string): TaskType[] {
    return this.tasks.filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Get task by ID
  public getTaskById(id: string): TaskType | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  // Clear all tasks
  public clearAllTasks(): void {
    this.tasks = [];
  }
}

// Export a single instance of the TaskManager
export const taskManager = TaskManager.getInstance();

const testSingleton = () => {
    const manager1 = TaskManager.getInstance();
    const manager2 = TaskManager.getInstance();
    console.log("Singleton test:", manager1 === manager2); // true
  };
  testSingleton();