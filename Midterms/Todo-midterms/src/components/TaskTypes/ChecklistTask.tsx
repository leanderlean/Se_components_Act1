// src/components/tasks/ChecklistTask.tsx
import React from "react";
import type { ChecklistTask } from "./types";
import toast, { Toaster } from "react-hot-toast";

interface ChecklistTaskProps {
  task?: ChecklistTask;
  onCreate?: (task: ChecklistTask) => void;
  onUpdate?: (task: ChecklistTask) => void;
  showCompletedCheckbox?: boolean;
  onDelete?: (id: string) => void;
}

const ChecklistTask: React.FC<ChecklistTaskProps> = ({
  task,
  onCreate,
  onUpdate,
  showCompletedCheckbox = false,
  onDelete,
}) => {
  const [title, setTitle] = React.useState(task?.title || "");
  const [completed, setCompleted] = React.useState(task?.completed || false);
  const [subtasks, setSubtasks] = React.useState(
    task?.subtasks || [
      {
        id: Math.random().toString(36).substr(2, 9),
        title: "",
        completed: false,
      },
    ]
  );

  const isExistingTask = !!task;

  React.useEffect(() => {
    if (completed) {
      toast.success(`Task: ${title} has been completed.`);
    }
  }, [completed, title]);

  const handleSubtaskChange = (
    id: string,
    field: "title" | "completed",
    value: string | boolean
  ) => {
    const updatedSubtasks = subtasks.map((subtask) =>
      subtask.id === id ? { ...subtask, [field]: value } : subtask
    );
    setSubtasks(updatedSubtasks);

    // Auto-save if it's an existing task
    if (isExistingTask) {
      const updatedTask: ChecklistTask = {
        id: task.id,
        title,
        completed,
        subtasks: updatedSubtasks,
      };
      onUpdate?.(updatedTask);
    }
  };

  const addSubtask = () => {
    if (isExistingTask) return;
    setSubtasks([
      ...subtasks,
      {
        id: Math.random().toString(36).substr(2, 9),
        title: "",
        completed: false,
      },
    ]);
  };

  const removeSubtask = (id: string) => {
    if (isExistingTask) return;
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: ChecklistTask = {
      id: task?.id || Math.random().toString(36).substr(2, 9),
      title,
      completed,
      subtasks: subtasks.filter((subtask) => subtask.title.trim() !== ""),
    };

    if (task) {
      onUpdate?.(newTask);
    } else {
      onCreate?.(newTask);
      // Clear form after creation
      setTitle("");
      setCompleted(false);
      setSubtasks([
        {
          id: Math.random().toString(36).substr(2, 9),
          title: "",
          completed: false,
        },
      ]);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm bg-violet-200 max-w-md mx-auto">
      <Toaster />
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className={`w-full p-2 border rounded ${
            isExistingTask ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          value={title}
          onChange={(e) => !isExistingTask && setTitle(e.target.value)}
          placeholder="Task title"
          required
          readOnly={isExistingTask}
        />
        {showCompletedCheckbox && (
          <label
            className={`flex items-center space-x-2 px-2 py-1 rounded transition-colors w-full ${
              completed ? "bg-violet-400 text-white" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => {
                const newCompleted = e.target.checked;
                setCompleted(newCompleted);
                if (isExistingTask) {
                  onUpdate?.({
                    ...task,
                    completed: newCompleted,
                    subtasks,
                  });
                }
              }}
            />
            <span>Completed</span>
          </label>
        )}

        <div className="space-y-2">
          <label className="block font-medium">Subtasks:</label>
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className={`flex items-center space-x-2 ${
                subtask.completed ? "bg-green-100" : ""
              } p-1 rounded`}
            >
              <input
                type="text"
                className={`flex-1 p-2 border rounded ${
                  isExistingTask ? "bg-gray-100" : ""
                } ${
                  subtask.completed
                    ? "line-through text-gray-400 bg-green-50"
                    : ""
                }`}
                value={subtask.title}
                onChange={(e) =>
                  handleSubtaskChange(subtask.id, "title", e.target.value)
                }
                placeholder="Subtask title"
                readOnly={isExistingTask}
              />
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={(e) =>
                  handleSubtaskChange(subtask.id, "completed", e.target.checked)
                }
              />
              {!isExistingTask && (
                <button
                  type="button"
                  onClick={() => removeSubtask(subtask.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {!isExistingTask && (
            <button
              type="button"
              onClick={addSubtask}
              className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              + Add Subtask
            </button>
          )}
        </div>

        <div className="flex justify-between">
          {!isExistingTask && (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Create Checklist Task
            </button>
          )}
          {isExistingTask && onDelete && (
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

export default ChecklistTask;
