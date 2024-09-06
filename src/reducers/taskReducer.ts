// src/reducers/taskReducer.ts

import { ADD_TASK, EDIT_TASK, DELETE_TASK, TOGGLE_COMPLETE, SET_TASKS } from './actionTypes';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

type Action = 
  | { type: 'ADD_TASK'; payload: { title: string } }
  | { type: 'EDIT_TASK'; payload: { id: string; title: string } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: string } }
  | { type: 'SET_TASKS'; payload: { tasks: Task[] } };

export const taskReducer = (state: Task[], action: Action): Task[] => {
  switch (action.type) {
    case SET_TASKS:
      return action.payload.tasks;
    case ADD_TASK:
      const newTask: Task = {
        id: Date.now().toString(),
        title: action.payload.title,
        completed: false,
      };
      return [newTask, ...state];
    case EDIT_TASK:
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, title: action.payload.title } : task
      );
    case DELETE_TASK:
      return state.filter((task) => task.id !== action.payload.id);
    case TOGGLE_COMPLETE:
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, completed: !task.completed } : task
      );
    default:
      return state;
  }
};
