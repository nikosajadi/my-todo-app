
import { taskReducer } from '@/reducers/taskReducer';
import { ADD_TASK, EDIT_TASK, DELETE_TASK, TOGGLE_COMPLETE, SET_TASKS } from '@/reducers/actionTypes';
import { NextApiRequest, NextApiResponse } from 'next';

// In-memory task storage, each task has an 'id' and 'title'.
let index = [
  { id: 1, title: 'Learn React' },
  { id: 2, title: 'Learn TypeScript' },
];

export default function handler(req, res) {
  const { method } = req;
  console.log('HTTP Method:', method);

  let state = index;

  switch (method) {
    case 'GET':
      res.status(200).json(state);
      break;

    case 'POST':
      const newTask = req.body;
      state = taskReducer(state, { type: ADD_TASK, payload: newTask });
      res.status(201).json(newTask);
      break;

    case 'PUT':
      const { id, title } = req.body;
      state = taskReducer(state, { type: UPDATE_TASK, payload: { id, title } });
      res.status(200).json({ id, title });
      break;

    case 'DELETE':
      const taskId = parseInt(req.query.id, 10);
      state = taskReducer(state, { type: DELETE_TASK, payload: { id: taskId } });
      res.status(200).json({ id: taskId });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }

  index = state; // Update the in-memory storage with the new state
}