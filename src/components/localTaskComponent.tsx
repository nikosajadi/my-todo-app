import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '@/context/taskContext'; 

// Interface defining the structure of a Task
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const LocalTaskComponent: React.FC = () => {
  // Access the context which contains state and dispatch for managing tasks
  const taskContext = useContext(TaskContext); 

  // Handle the case when TaskContext is not available, to prevent runtime errors
  if (!taskContext) {
    return <div>Task context not found</div>;  // Error handling if context is unavailable
  }

  const { state, dispatch } = taskContext;  // Destructure state and dispatch from the context

  // Local state to manage the title of the new task and the loading status
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);  

  // Function to fetch tasks from the server and dispatch them to the global state
  const fetchTasks = async () => {
    setLoading(true);  // Set loading to true while fetching tasks
    try {
      const response = await fetch('/api/tasks');  // Fetch tasks from API endpoint
      if (!response.ok) throw new Error('Failed to fetch tasks');  // Handle failed API request
      const fetchedTasks = await response.json();

      console.log('fetchedTasks : ', fetchedTasks);  // Log fetched tasks for debugging
      dispatch({ type: 'SET_TASKS', payload: { tasks: fetchedTasks } });  // Dispatch action to update tasks

      console.log('state : ', state);  // Log state for debugging
    } catch (error) {
      console.error('Error fetching tasks:', error);  // Log any errors encountered during fetching
    } finally {
      setLoading(false);  // Set loading to false after the fetch is complete
    }
  };

  // Fetch tasks when the component is first mounted
  useEffect(() => {
    fetchTasks();  // Call fetchTasks when the component is mounted
  }, [dispatch]);  // Only re-run effect if dispatch changes

  // Function to handle adding a new task
  const handleAddTask = async () => {
    if (taskTitle.trim()) {  // Only proceed if the task title is not empty
      const newTask: Task = {
        id: Date.now().toString(),  // Use current timestamp as a unique task ID
        title: taskTitle,
        completed: false,
      };

      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask),  // Send new task to the server
        });

        if (!response.ok) throw new Error('Failed to add task');  // Handle failed API request
        await fetchTasks();  // Re-fetch tasks after adding the new one
      } catch (error) {
        console.error('Error adding task:', error);  // Log any errors encountered during adding
      } finally {
        setTaskTitle('');  // Clear input field after the task is added
      }
    } else {
      console.log("Task title is empty");  // Log message if the input is empty
    }
  };

  // Function to handle editing an existing task
  const handleEditTask = async (taskId: string, newTitle: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId, title: newTitle }),  // Send updated task title to the server
      });

      if (!response.ok) throw new Error('Failed to edit task');  // Handle failed API request
      await fetchTasks();  // Re-fetch tasks after editing the task
    } catch (error) {
      console.error('Error editing task:', error);  // Log any errors encountered during editing
    }
  };

  // Function to handle deleting a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',  // Delete the task from the server
      });

      if (!response.ok) throw new Error('Failed to delete task');  // Handle failed API request
      await fetchTasks();  // Re-fetch tasks after deleting the task
    } catch (error) {
      console.error('Error deleting task:', error);  // Log any errors encountered during deletion
    }
  };

  // Function to toggle the completion status of a task
  const handleToggleComplete = async (taskId: string) => {
    const task = state.find((t: Task) => t.id === taskId);  // Find the task by ID in the state
    if (!task) return;  // Return early if the task is not found

    try {
      const response = await fetch(`/api/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId, completed: !task.completed }),  // Toggle the task's completed status
      });

      if (!response.ok) throw new Error('Failed to toggle task completion');  // Handle failed API request
      await fetchTasks();  // Re-fetch tasks after toggling completion
    } catch (error) {
      console.error('Error toggling task completion:', error);  // Log any errors encountered during toggling
    }
  };

  // Render the UI
  return (
    <div className=" font-serif max-w-lg mx-auto mt-10 bg-purple-300 p-6 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-6">To-Do List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}  // Update taskTitle state on input change
          placeholder="Add a new task"
          className="input px-4 py-2 rounded-l-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button className="bg-purple-600 text-white px-6 py-2 rounded-r-md hover:bg-purple-700 transition-colors" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>  // Show loading indicator while tasks are being fetched
      ) : (
        <ul className="list-none">
          {Array.isArray(state) && state.length > 0 ? (  // Render tasks if state contains tasks
            state.map((task: Task) => (
              <li key={task.id} className="flex items-center justify-between bg-white p-4 mb-2 rounded-md shadow-sm">
                <div className="flex items-center relative">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                    className="appearance-none h-5 w-5 border-2 rounded-full border-gray-300 checked:bg-green-500"
                  />
                  {task.completed && (
                    <svg className="absolute top-0 left-0 w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L7.5 13.086l-2.793-2.793a1 1 0 10-1.414 1.414l3.5 3.5a1 1 0 001.414 0l8.5-8.5a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleEditTask(task.id, e.target.value)}  // Update task title on change
                    className={`border-0 p-2 w-full ml-3 focus:outline-none ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                  />
                  <button
                    className="bg-purple-500 text-white px-3 py-1 ml-3 rounded-md hover:bg-purple-200 transition-colors"
                    onClick={() => handleDeleteTask(task.id)}  // Delete the task on button click
                    
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center font-bold text-purple-800">No tasks available</p>  // Show message if there are no tasks
          )}
        </ul>
      )}
    </div>
  );
};

export default LocalTaskComponent;
