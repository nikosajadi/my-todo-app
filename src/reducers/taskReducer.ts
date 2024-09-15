
import { ADD_TASK, EDIT_TASK, DELETE_TASK, TOGGLE_COMPLETE, SET_TASKS } from '@/reducers/actionTypes';
// Define the structure of a Task
interface Task {
  id: string;
  title: string;
  completed: boolean;
}
interface Action {
  type: string;
  payload: any;
}

const initialState: Task[] = [
  { id: '1', title: 'Learn React', completed: false },
  { id: '2', title: 'Learn TypeScript', completed: true },
  { id: '3', title: 'Learn React', completed: false },
  { id: '4', title: 'Learn TypeScript', completed: true }
]
// Define the structure of each Action type
type Action = 
  | { type: 'ADD_TASK'; payload: { taskTitle: string } }
  | { type: 'EDIT_TASK'; payload: { id: string; title: string } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: string } }
  | { type: 'SET_TASKS'; payload: { tasks: Task[] } };

// The reducer function to handle state changes
export const taskReducer = (state: Task[], action: Action): Task[] => {
  switch (action.type) {
    case SET_TASKS:
      return action.payload.tasks; // Directly set tasks array

    case ADD_TASK:
      const newTask: Task = {
        id: Date.now().toString(),
        title: action.payload.taskTitle, // Title comes from payload
        completed: false,
      };
      return [newTask, ...state]; // Add the new task to the beginning of the array

    case EDIT_TASK:
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, title: action.payload.title } // Only update the task with matching id
          : task
      );

    case DELETE_TASK:
      return state.filter((task) => task.id !== action.payload.id); // Remove task with matching id

    case TOGGLE_COMPLETE:
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: !task.completed } // Toggle the completed status
          : task
      );

    default:
      return state; // If no action matches, return the current state
  }
};
