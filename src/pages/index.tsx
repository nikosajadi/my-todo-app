import { useState, useEffect, useReducer } from "react";
import { taskReducer } from '../reducers/taskReducer';
import { GetServerSideProps } from 'next';
import { ADD_TASK, EDIT_TASK, DELETE_TASK, TOGGLE_COMPLETE, SET_TASKS } from '../reducers/actionTypes';


interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const TaskComponent = ({ initialTasks }) => {
  const [state, dispatch] = useReducer(taskReducer, initialTasks);
  const [taskTitle, setTaskTitle] = useState(""); // useState for input field

  // Fetch tasks from an API (if needed)
  const fetchTasks = async () => {
    const fetchedTasks = await getTasksFromAPI(); // Replace with actual API call
    dispatch({ type: SET_TASKS, payload: { tasks: fetchedTasks } });
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks'); // تماس به API داخلی
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const fetchedTasks = await response.json(); // تبدیل پاسخ به JSON
        dispatch({ type: SET_TASKS, payload: { tasks: fetchedTasks } });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  }, []);

  // Add new task
  const handleAddTask = () => {
    if (taskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskTitle,
        completed: false,
      };
      dispatch({ type: ADD_TASK, payload: { task: newTask } });
      setTaskTitle(""); // Clear input after adding task
    }
  };

  // Edit task
  const handleEditTask = (taskId: string, newTitle: string) => {
    dispatch({ type: EDIT_TASK, payload: { id: taskId, title: newTitle } });
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    dispatch({ type: DELETE_TASK, payload: { id: taskId } });
  };

  // Toggle task completion
  const handleToggleComplete = (taskId: string) => {
    dispatch({ type: TOGGLE_COMPLETE, payload: { id: taskId } });
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">My To-Do List</h1>
      <div className="flex mb-4">
        <input
          id="task-input"
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Add a new task"
          className="border p-2 rounded-l-md w-full"
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>
      <ul className="list-disc pl-5">
        {state.map((task) => (
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
              className="bg-red-500 text-white p-2 rounded-md ml-2 hover:bg-red-600"
              onClick={() => handleDeleteTask(task.id)}
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
export const getServerSideProps: GetServerSideProps = async () => {
  const initialTasks: Task[] = [
    { id: "1", title: "Learn React", completed: false },
    { id: "2", title: "Learn TypeScript", completed: false },
  ];

  return {
    props: {
      initialTasks,
    },
  };
};

export default TaskComponent;
