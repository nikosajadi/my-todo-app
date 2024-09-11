
// import React, { useContext } from 'react';
// import { TaskContext } from '@/context/taskContext'; // وارد کردن TaskContext

// const TaskComponent: React.FC = () => {
//   // استفاده از useContext برای دسترسی به context
//   const taskContext = useContext(TaskContext); 

//   // بررسی اینکه آیا context وجود دارد یا خیر
//   if (!taskContext) {
//     return <div>Task context not found</div>; 
//   }

//   // دسترسی به state و dispatch از context
//   const { state, dispatch } = taskContext;

//   // عملکرد افزودن تسک جدید
//   const handleAddTask = () => {
//     const newTask = {
//       id: Date.now().toString(),
//       title: 'New Task',
//       completed: false,
//     };
//     dispatch({ type: 'ADD_TASK', payload: newTask });
//   };

//   return (
//     <div>
//       <h1>Task List</h1>
//       <ul>
//         {state.map((task) => (
//           <li key={task.id}>
//             {task.title} - {task.completed ? 'Completed' : 'Not Completed'}
//           </li>
//         ))}
//       </ul>
//       <button onClick={handleAddTask}>Add Task</button>
//     </div>
//   );
// };

// export default TaskComponent;
import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '@/context/taskContext'; // وارد کردن Context از پوشه context

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

  useEffect(() => {
    // Fetch tasks from API (if needed)
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks"); // Fetching from API
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const fetchedTasks = await response.json();
        dispatch({ type: 'SET_TASKS', payload: { tasks: fetchedTasks } });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks(); // Trigger fetching on component mount
  }, [dispatch]);

  // Add new task
  const handleAddTask = () => {
    if (taskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskTitle,
        completed: false,
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
      setTaskTitle(""); // Clear input after adding task
    } else {
      console.log("Task title is empty");
    }
  };

  const handleEditTask = (taskId: string, newTitle: string) => {
    dispatch({ type: 'EDIT_TASK', payload: { id: taskId, title: newTitle } });
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { id: taskId } });
  };

  const handleToggleComplete = (taskId: string) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: { id: taskId } });
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

      {/* بررسی وجود state.tasks و استفاده از map در صورت وجود */}
      <ul className="list-disc pl-5">
        {Array.isArray(state.tasks) && state.tasks.length > 0 ? (
          state.tasks.map((task: Task) => (
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
          <p>No tasks available</p>  // نمایش پیام در صورت خالی بودن لیست تسک‌ها
        )}
      </ul>
    </div>
  );
};

export default LocalTaskComponent;
