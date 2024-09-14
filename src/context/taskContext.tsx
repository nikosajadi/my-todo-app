

import React, { createContext, useReducer, ReactNode } from 'react';
import { taskReducer } from '@/reducers/taskReducer';


interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskContextProps {
  state: Task[];
  dispatch: React.Dispatch<any>;
}

export const TaskContext = createContext<TaskContextProps | undefined>(undefined);

const initialState: Task[] = [];

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};