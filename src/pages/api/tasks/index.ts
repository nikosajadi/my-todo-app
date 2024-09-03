// In-memory task storage, each task has an 'id' and 'title'.
let index = [
  { id: 1, title: 'Learn React' },
  { id: 2, title: 'Learn TypeScript' },
];

// API handler for managing tasks with CRUD operations.
export default function handler(req, res) {
  const { method } = req; // Get the HTTP method.
  console.log('HTTP Method:', method); // Log method for debugging.

  switch (method) {
    case 'GET':
      res.status(200).json(index); // Return all tasks.
      break;

    case 'POST':
      const newTask = req.body;
      index.push(newTask); // Add new task.
      res.status(201).json(newTask); // Return the added task.
      break;

    case 'PUT':
      const { id, title } = req.body;
      index = index.map(task =>
        task.id === id ? { ...task, title } : task
      ); // Update task title.
      res.status(200).json({ id, title }); // Return updated task.
      break;

    case 'DELETE':
      const taskId = parseInt(req.query.id, 10);
      index = index.filter(task => task.id !== taskId); // Remove task.
      res.status(204).end(); // Confirm deletion.
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`); // Method not allowed.
  }
}
