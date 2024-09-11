import { useContext } from 'react';
import { TaskContext } from '@/context/taskContext';
import { ADD_TASK, EDIT_TASK, DELETE_TASK, TOGGLE_COMPLETE, SET_TASKS } from '@/reducers/actionTypes';
import { NextApiRequest, NextApiResponse } from 'next';

// Removing in-memory task storage as tasks will come from Context

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const taskContext = useContext(TaskContext); // Access the global task context

  if (!taskContext) {
    return res.status(500).json({ message: 'Task context not found' });
  }

  const { tasks, dispatch } = taskContext; // Destructure tasks and dispatch from context

  const { method } = req;

  switch (method) {
    case 'GET':
      res.status(200).json(tasks); // Return tasks from context
      break;

    case 'POST':
      const newTask = req.body;
      dispatch({ type: ADD_TASK, payload: newTask }); // Dispatch ADD_TASK action
      res.status(201).json(newTask);
      break;

    case 'PUT':
      const { id, title } = req.body;
      dispatch({ type: EDIT_TASK, payload: { id, title } }); // Dispatch EDIT_TASK action
      res.status(200).json({ id, title });
      break;

    case 'DELETE':
      const taskId = parseInt(req.query.id as string, 10);
      dispatch({ type: DELETE_TASK, payload: { id: taskId } }); // Dispatch DELETE_TASK action
      res.status(204).end();
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
