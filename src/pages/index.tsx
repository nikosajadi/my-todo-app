
import { useState, useEffect } from "react";
import { GetServerSideProps } from 'next';


// Define a TypeScript type for a Task
type Task = {
  id: number;     
  title: string;  
};


type HomePage  = {
  initialTasks: Task[]; 
};

const Home = ({ initialTasks }: HomePage) => {
const [tasks, setTasks] = useState<Task[]>(initialTasks);
const [taskTitle, setTaskTitle] = useState<string>('');



useEffect(()=> {
  const fetchUpdatedTasks = async () =>{
    const res = await fetch('/api/tasks'); 
    const data = await res.json();
    setTasks(data);
  }

  fetchUpdatedTasks();
}, []); 



 // Add a new task
 const handleAddTask = async () => {
  if (taskTitle.trim()) {
    const newTask = { id: Date.now(), title: taskTitle };
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });

    if (res.ok) {
      setTasks([...tasks, newTask]);
      setTaskTitle('');
    }
  }
};
  // Edit an existing task
  const handleEditTask = async (id: number, newTitle: string) => {
    const updatedTask = { id, title: newTitle };
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    if (res.ok) {
      setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
    }
  };

  // Delete a task
  const handleDeleteTask = async (id: number) => {

    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',

    });
 
    if (res.ok) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  return (

    <div>
      <h1>My To-Do List</h1>
      {/* Input field to enter a new task */}
      <input
      id="task-input"
        type="text"
        value={taskTitle}  // Bind the input value to the 'task' state
        onChange={(e) => setTaskTitle(e.target.value)}  // Update 'task' state as the user types
        placeholder="Add a new task"  // Placeholder text for the input field
      />
      {/* Button to add the new task to the list */}
      <button onClick={handleAddTask}>Add Task</button>
      
      {/* Display the list of tasks */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>

         <input 
         type="task"
         value={task.title}
         onChange={(e) => handleEditTask(task.id, e.target.value)} 
         />
        <button
              onClick={() => handleDeleteTask(task.id)}
              aria-label={`Delete task ${task.title}`}
             
            >
              Delete
            </button>

          </li>  
        ))}
      </ul>
    </div>
  );
};

// Fetch initial tasks from server-side
export const getServerSideProps = async () => {
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
