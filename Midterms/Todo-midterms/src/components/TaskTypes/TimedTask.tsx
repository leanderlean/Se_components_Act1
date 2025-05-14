// src/components/tasks/TimedTask.tsx
import React from "react";
import type { TimedTask } from "./types";
import toast, { Toaster } from "react-hot-toast";

interface TimedTaskProps {
  task?: TimedTask;
  onCreate?: (task: TimedTask) => void;
  onUpdate?: (task: TimedTask) => void;
  onDelete?: (id: string) => void;
  showCompletedCheckbox?: boolean;
}

const TimedTask: React.FC<TimedTaskProps> = ({
  task,
  onCreate,
  onUpdate,
  showCompletedCheckbox = false,
  onDelete,
}) => {
  const [title, setTitle] = React.useState(task?.title || "");
  const [completed, setCompleted] = React.useState(task?.completed || false);
  const [dueDate, setDueDate] = React.useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().substr(0, 16) : ""
  );
  const isReadOnly = !!task;

  React.useEffect(() => {
    if (completed) {
      toast.success(`Task: ${title} has been completed`);
    }
  }, [completed, title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: TimedTask = {
      id: task?.id || Math.random().toString(36).substr(2, 9),
      title,
      completed,
      dueDate: new Date(dueDate),
    };

    if (task) {
      onUpdate?.(newTask);
    } else {
      onCreate?.(newTask);
      // Reset form after creation
      setTitle("");
      setCompleted(false);
      setDueDate("");
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm bg-pink-200 max-w-md mx-auto">
      <Toaster />
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className={`w-full p-2 border rounded ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
          value={title}
          onChange={(e) => !isReadOnly && setTitle(e.target.value)}
          placeholder="Task title"
          required
          readOnly={isReadOnly}
        />
        <label className="block">
          <span className="block mb-1">Due Date:</span>
          <input
            type="datetime-local"
            className={`w-full p-2 border rounded ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            value={dueDate}
            onChange={(e) => !isReadOnly && setDueDate(e.target.value)}
            required
            readOnly={isReadOnly}
          />
        </label>
        {showCompletedCheckbox && (
          <label
            className={`flex items-center space-x-2 px-2 py-1 rounded transition-colors w-full ${
              completed ? "bg-pink-400 text-white" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => {
                const newCompleted = e.target.checked;
                setCompleted(newCompleted);
                if (task) {
                  onUpdate?.({
                    ...task,
                    completed: newCompleted,
                    dueDate: new Date(dueDate),
                  });
                }
              }}
            />
            <span>Completed</span>
          </label>
        )}
        <div className="flex justify-between">
          {!isReadOnly && (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Create Timed Task
            </button>
          )}
          {isReadOnly && onDelete && (
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

export default TimedTask;