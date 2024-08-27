
import { useState } from "react";
import { GetServerSideProps } from 'next';

// Define a TypeScript type for a Task
type Task = {
  id: number;     // Each task has an 'id' of type number
  title: string;  // Each task has a 'title' of type string
};

// Define a TypeScript type for the component's props
type Props = {
  initialTasks: Task[];  // The component expects an array of Task objects as props
};

const Home = ({ initialTasks }: Props) => {
  // Define state 'tasks' to hold an array of task titles (strings)
  const [tasks, setTasks] = useState<string[]>(
    initialTasks.map(task => task.title) // Initialize state with the titles of the initial tasks
  );

  // Define state 'task' to hold the value of the current input (the new task to be added)
  const [task, setTask] = useState<string>('');

  // Function to add a new task to the list
  const addTask = () => {
    if (task.trim()) {  // Check if the task is not empty or just whitespace
      setTasks([...tasks, task]);  // Add the new task to the 'tasks' array
      setTask('');  // Clear the input field after adding the task
    }
  };

  return (
    <div>
      <h1>My To-Do List</h1>
      {/* Input field to enter a new task */}
      <input
        type="text"
        value={task}  // Bind the input value to the 'task' state
        onChange={(e) => setTask(e.target.value)}  // Update 'task' state as the user types
        placeholder="Add a new task"  // Placeholder text for the input field
      />
      {/* Button to add the new task to the list */}
      <button onClick={addTask}>Add Task</button>
      
      {/* Display the list of tasks */}
      <ul>
        {tasks.map((t, index) => (
          <li key={index}>{t}</li>  // Render each task title as a list item
        ))}
      </ul>
    </div>
  );
};

// This function is called on the server side to fetch data before rendering the page
export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch data from an external API
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
  const data = await res.json();  // Parse the JSON response

  // Map the fetched data to an array of Task objects
  const initialTasks: Task[] = data.map((task: any) => ({
    id: task.id,
    title: task.title,
  }));

  // Return the fetched tasks as props to the Home component
  return {
    props: {
      initialTasks,
    },
  };
};

export default Home;  // Export the Home component as the default export
