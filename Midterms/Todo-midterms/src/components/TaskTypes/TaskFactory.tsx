// src/components/tasks/TaskFactory.tsx
import React from "react";
import type {
  Task,
  TimedTask as TimedTaskType,
  ChecklistTask as ChecklistTaskType,
  TaskFactoryProps,
} from "./types";
import BasicTask from "./BasicTask";
import TimedTaskComponent from "./TimedTask";
import ChecklistTaskComponent from "./ChecklistTask";

// Extend the TaskFactoryProps to include onDelete
interface ExtendedTaskFactoryProps extends TaskFactoryProps {
  onDelete?: (id: string) => void;
}

const TaskFactory: React.FC<ExtendedTaskFactoryProps> = ({
  type,
  task,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  // Allow either creation (onCreate) or update (task + onUpdate)
  if (!onCreate && !(task && onUpdate)) {
    return <div>Missing required props for TaskFactory.</div>;
  }

  const commonProps = {
    showCompletedCheckbox: !!task, // Show checkbox only when displaying in list
    onDelete: task ? onDelete : undefined, // Only pass onDelete if we have a task
  };

  switch (type) {
    case "basic":
      return (
        <BasicTask
          task={task as Task}
          onCreate={onCreate as (task: Task) => void}
          onUpdate={onUpdate as (task: Task) => void}
          {...commonProps}
        />
      );

    case "timed":
      return (
        <TimedTaskComponent
          task={task as TimedTaskType}
          onCreate={onCreate as (TimedTaskType) => void}
          onUpdate={onUpdate as (TimedTaskType) => void}
          {...commonProps}
        />
      );

    case "checklist":
      return (
        <ChecklistTaskComponent
          task={task as ChecklistTaskType}
          onCreate={onCreate as (ChecklistTaskType) => void}
          onUpdate={onUpdate as (ChecklistTaskType) => void}
          {...commonProps}
        />
      );
    default:
      throw new Error(`Unknown task type: ${type}`);
  }
};

export default TaskFactory;
