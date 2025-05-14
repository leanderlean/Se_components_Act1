// src/components/tasks/BasicTask.tsx
import React from "react";
import type { Task } from "./types";
import toast, { Toaster } from "react-hot-toast";

interface BasicTaskProps {
  task?: Task;
  onCreate?: (task: Task) => void;
  onUpdate?: (task: Task) => void;
  onDelete?: (id: string) => void;
  showCompletedCheckbox?: boolean;
}

const BasicTask: React.FC<BasicTaskProps> = ({
  task,
  onCreate,
  onUpdate,
  showCompletedCheckbox = false,
  onDelete,
}) => {
  const [title, setTitle] = React.useState(task?.title || "");
  const [completed, setCompleted] = React.useState(task?.completed || false);
  const isReadOnly = !!task;

  React.useEffect(() => {
    if (completed) {
      toast.success(`Task: ${title} has been completed`);
    }
  }, [completed, title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: task?.id || Math.random().toString(36).substr(2, 9),
      title,
      completed,
    };
    task ? onUpdate?.(newTask) : onCreate?.(newTask);

    // Clear the input field if it's a new task being created
    if (!task) {
      setTitle("");
      setCompleted(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm bg-blue-200 max-w-md mx-auto">
      <Toaster />
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full p-2 border rounded outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
          readOnly={isReadOnly}
        />
        {showCompletedCheckbox && (
          <label
            className={`flex items-center space-x-2 px-2 py-1 rounded transition-colors w-full ${
              completed ? "bg-blue-900 text-white" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <span>Completed</span>
          </label>
        )}
        <div className="flex justify-between">
          {!task && (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Create Task
            </button>
          )}
          {task && onDelete && (
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              onClick={() => onDelete(task.id)}
            >
              Delete Task
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BasicTask;