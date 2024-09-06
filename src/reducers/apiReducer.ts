// src/reducers/apiReducer.ts

interface Task {
    id: string;
    title: string;
    completed: boolean;
  }
  
  type ApiAction = 
    | { type: 'GET_TASKS'; payload: Task[] }
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: { id: string; title: string } }
    | { type: 'DELETE_TASK'; payload: { id: string } };
  
  const apiReducer = (state: Task[], action: ApiAction): Task[] => {
    switch (action.type) {
      case 'GET_TASKS':
        return action.payload;
      case 'ADD_TASK':
        return [...state, action.payload.task];

      case 'UPDATE_TASK':
        return state.map(task => 
          task.id === action.payload.id ? { ...task, title: action.payload.title } : task
        );
      case 'DELETE_TASK':
        return state.filter(task => task.id !== action.payload.id);
      default:
        return state;
    }
  };
  