import { useState, useEffect } from "react";
import { GetServerSideProps } from 'next';

// Define a TypeScript type for a Task
type Task = {
  id: number;      // Unique identifier for each task
  title: string;   // The title or description of the task
};

// Define the props type for the Home component
type HomePage = {
  initialTasks: Task[];  // Array of tasks passed as initial data from server-side
};

const Home = ({ initialTasks }: HomePage) => {
  // State to hold the list of tasks
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  // State to hold the title of a new task being added
  const [taskTitle, setTaskTitle] = useState<string>('');

  // useEffect to fetch updated tasks when the component mounts
  useEffect(() => {
    const fetchUpdatedTasks = async () => {
      const res = await fetch('/api/tasks');  // Fetch tasks from the API
      if (res.ok) {
        const data = await res.json();  // Parse the JSON response
        setTasks(data);  // Update the tasks state with the fetched data
      }
    };

    fetchUpdatedTasks();  // Call the function to fetch tasks
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  // Function to handle adding a new task
  const handleAddTask = async () => {
    if (taskTitle.trim()) {  // Check if the task title is not empty
      const newTask = { id: Date.now(), title: taskTitle };  // Create a new task object
      const res = await fetch('/api/tasks', {
        method: 'POST',  // Use POST method to add a new task
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),  // Send the new task data in the request body
      });

      if (res.ok) {
        setTasks([...tasks, newTask]);  // Add the new task to the current list of tasks
        setTaskTitle('');  // Clear the input field after adding the task
      }
    }
  };

  // Function to handle editing an existing task
  const handleEditTask = async (id: number, newTitle: string) => {
    const updatedTask = { id, title: newTitle };  // Create an updated task object
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',  // Use PUT method to update the task
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),  // Send the updated task data in the request body
    });

    if (res.ok) {
      // Update the tasks state with the edited task
      setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
    }
  };

  // Function to handle deleting a task
  const handleDeleteTask = async (id: number) => {
    console.log("Attempting to delete task with ID:", id);
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',  // Use DELETE method to remove the task
    });

    if (res.ok) {
      console.log("Task deleted successfully:", id);
      // Update the tasks state to remove the deleted task
      setTasks(tasks.filter(task => task.id !== id));
    } else {
      console.error("Failed to delete task:", id, res.status);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">My To-Do List</h1>
      <div className="flex mb-4">
        {/* Input field to enter a new task */}
        <input
          id="task-input"
          type="text"
          value={taskTitle}  // Bind the input value to the 'taskTitle' state
          onChange={(e) => setTaskTitle(e.target.value)}  // Update 'taskTitle' state as the user types
          placeholder="Add a new task"  // Placeholder text for the input field
        />
        {/* Button to add the new task to the list */}
        <button className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600" onClick={handleAddTask}>
          Add Task
        </button>
      </div>
      {/* Display the list of tasks */}
      <ul className="list-disc pl-5">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between mb-2">
            {/* Input field to edit the task title */}
            <input 
              type="text"
              value={task.title}
              onChange={(e) => handleEditTask(task.id, e.target.value)} 
            />
            {/* Button to delete the task */}
            <button className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
              onClick={() => handleDeleteTask(task.id)}>
              Delete
            </button>
          </li>  
        ))}
      </ul>
    </div>
  );
};

// Fetch initial tasks from server-side
export const getServerSideProps: GetServerSideProps = async () => {
  // Simulate fetching tasks from a database or an API
  const initialTasks = [
    { id: 1, title: 'Learn React' },
    { id: 2, title: 'Learn TypeScript' },
  ];

  return {
    props: {
      initialTasks,
    },
  };
};

export default Home;  // Export the Home component as the default export
