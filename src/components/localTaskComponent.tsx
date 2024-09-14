
import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '@/context/taskContext'; 

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const LocalTaskComponent: React.FC = () => {
  const taskContext = useContext(TaskContext);  // دسترسی به context

  if (!taskContext) {
    return <div>Task context not found</div>;  // مدیریت خطا در صورت نبودن context
  }

  const { state, dispatch } = taskContext;  // دسترسی به state و dispatch
  const [taskTitle, setTaskTitle] = useState<string>("");

 
  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const fetchedTasks = await response.json();

      console.log('fetchedTasks : ' , fetchedTasks)
      dispatch({ type: 'SET_TASKS', payload: { tasks: fetchedTasks } });

      console.log('state : ' , state)
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };


  // Fetch tasks when the component is mounted
  useEffect(() => {
    fetchTasks();
  }, [dispatch]);

   // Add new task
  const handleAddTask = async () => {
    if (taskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskTitle,
        completed: false,
      };

      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask),
        });

        if (!response.ok) throw new Error('Failed to add task');
        await fetchTasks();  // Refetch tasks after adding the new task
      } catch (error) {
        console.error('Error adding task:', error);
      } finally {
        setTaskTitle('');  // Clear input after adding task
      }
    } else {
      console.log("Task title is empty");
    }
  };

  // Edit task
  const handleEditTask = async (taskId: string, newTitle: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId, title: newTitle }),
      });

      if (!response.ok) throw new Error('Failed to edit task');
      await fetchTasks();  // Refetch tasks after editing
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
      await fetchTasks();  // Refetch tasks after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (taskId: string) => {
    const task = state.find((t: Task) => t.id == taskId);
    if (!task) return;

    try {
      const response = await fetch(`/api/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId, completed: !task.completed }),
      });

      if (!response.ok) throw new Error('Failed to toggle task completion');
      await fetchTasks();  // Refetch tasks after toggling completion
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">To-Do List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Add a new task"
          className="input px-2 py-1 rounded-md w-full"
        />
        <button className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="list-disc pl-5">
          {Array.isArray(state) && state.length > 0 ? (
            state.map((task: Task) => (
              <li key={task.id} className="flex items-center justify-between mb-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                />
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => handleEditTask(task.id, e.target.value)}
                  className="border p-1 w-full ml-2"
                />
                <button
                  className="bg-red-500 text-white p-2 ml-2 rounded-md"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p>No tasks available</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default LocalTaskComponent;
