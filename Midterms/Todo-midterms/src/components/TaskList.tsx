// src/components/TaskList.tsx
import React, { useEffect, useState } from 'react';
import { Notification } from './Notification';
import { overdueTaskObserver } from './Services/OverdueTaskObserver';
import type { TimedTask } from './TaskTypes/types';
import TaskFactory from "./TaskTypes/TaskFactory";

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete }) => {
  const [overdueTasks, setOverdueTasks] = useState<TimedTask[]>([]);

  useEffect(() => {
    // Initial check
    setOverdueTasks(overdueTaskObserver.checkOverdueTasks());

    // Subscribe to changes
    const handleOverdueTasks = (tasks: TimedTask[]) => {
      setOverdueTasks(tasks);
    };

    overdueTaskObserver.subscribe(handleOverdueTasks);
    return () => overdueTaskObserver.unsubscribe(handleOverdueTasks);
  }, []);

  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks yet. Create one above!</p>;
  }

  return (
    <div className="space-y-4">
      {/* Overdue notifications */}
      {overdueTasks.map(task => (
        <Notification
          key={`overdue-${task.id}`}
          message={`Task "${task.title}" is overdue!`}
          type="error"
        />
      ))}

      {/* Task list */}
      {tasks.map((task) => (
        <div key={task.id} className="p-4">
          <TaskFactory
            type={
              'dueDate' in task
                ? 'timed'
                : 'subtasks' in task
                ? 'checklist'
                : 'basic'
            }
            task={task}
            onUpdate={onUpdate}
            showCompletedCheckbox={true}
            onDelete={onDelete}
          />
          {/* Inline overdue warning */}
          {'dueDate' in task && task.dueDate < new Date() && !task.completed && (
            <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
              ⚠️ This task is overdue!
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList