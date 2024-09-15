
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
  const [loading, setLoading] = useState<boolean>(false);  // اضافه کردن state برای loading
 
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

    <div className="max-w-lg mx-auto mt-10 bg-gray-100 p-6 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-6">To-Do List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Add a new task"
          className="input px-4 py-2 rounded-l-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button className="bg-purple-600 text-white px-6 py-2 rounded-r-md hover:bg-purple-700 transition-colors" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : (
        <ul className="list-none">
          {Array.isArray(state) && state.length > 0 ? (
            state.map((task: Task) => (
              <li key={task.id} className="flex items-center justify-between bg-white p-4 mb-2 rounded-md shadow-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded"
                  />
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleEditTask(task.id, e.target.value)}
                    className={`border-0 p-2 w-full ml-3 focus:outline-none ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                  />
                
                <button
                  className="bg-red-500 text-white px-3 py-1 ml-3 rounded-md hover:bg-red-600 transition-colors"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No tasks available</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default LocalTaskComponent;