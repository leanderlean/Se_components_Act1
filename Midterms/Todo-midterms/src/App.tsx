import React, { useState, useEffect } from "react";
import TaskFactory from "./components/TaskTypes/TaskFactory";
import { taskManager } from "./components/Services/TaskManager";
import { TaskAdapter } from "./components/Services/TaskAdapter";
import { fetchExternalTasks } from "./components/Services/MockAPI";
import { TaskSortingStrategy } from "./components/Services/TaskSorting";
import { overdueTaskObserver } from "./components/Services/OverdueTaskObserver";
import TaskList from "./components/TaskList";
import type {
  Task,
  TimedTask,
  ChecklistTask,
} from "./components/TaskTypes/types";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<(Task | TimedTask | ChecklistTask)[]>([]);
  const [taskType, setTaskType] = useState<"basic" | "timed" | "checklist">(
    "basic"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState<
    "id" | "title" | "dueDate" | "completion"
  >("id");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        // 1. Fetch from external API
        const externalTasks = await fetchExternalTasks();
        // 2. Adapt to our internal format
        const adaptedTasks = TaskAdapter.adaptExternalTasks(externalTasks);
        // 3. Initialize TaskManager with adapted tasks
        taskManager.init(adaptedTasks);
        // 4. Update state
        setTasks(taskManager.getAllTasks());
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
    // Initialize overdue task checker
    overdueTaskObserver.checkOverdueTasks();
  }, []);

  const handleCreateTask = (newTask: Task | TimedTask | ChecklistTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task | TimedTask | ChecklistTask) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getSortedTasks = () => {
    const tasksList = tasks;
    switch (sortMethod) {
      case "id":
        return TaskSortingStrategy.sortById(tasksList);
      case "title":
        return TaskSortingStrategy.sortByTitle(tasksList);
      case "dueDate":
        return TaskSortingStrategy.sortByDueDate(tasksList);
      case "completion":
        return TaskSortingStrategy.sortByCompletion(tasksList);
      default:
        return tasksList;
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading tasks...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Task Type:</label>
        <div className="flex space-x-4">
          {(["basic", "timed", "checklist"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={`px-4 py-2 rounded ${
                taskType === type ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setTaskType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} Task
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Sort By:</label>
        <div className="flex space-x-2">
          {["id", "title", "dueDate", "completion"].map((method) => (
            <button
              key={method}
              type="button"
              className={`px-3 py-1 rounded ${
                sortMethod === method
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setSortMethod(method as any)}
            >
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        <TaskFactory type={taskType} onCreate={handleCreateTask} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        <TaskList
          tasks={getSortedTasks()}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
};

export default App;
