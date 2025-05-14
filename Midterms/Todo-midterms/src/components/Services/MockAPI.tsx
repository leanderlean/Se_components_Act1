// src/services/mockApi.ts
export const fetchExternalTasks = async (): Promise<any[]> => {
    // In a real app, this would be your actual API call
    // For now, we'll return mock data that matches the external format
    return [
      {
        id: "1",
        title: "Complete project",
        description: "Finish the task manager app",
        completed: false,
      },
      {
        id: "2",
        title: "Buy groceries",
        dueDate: "2023-12-31T12:00:00Z",
        completed: false,
      },
      {
        id: "3",
        title: "Write documentation",
        subtasks: [
          { id: "3-1", title: "Research", completed: true },
          { id: "3-2", title: "Draft outline", completed: false },
        ],
      },
    ];
  };