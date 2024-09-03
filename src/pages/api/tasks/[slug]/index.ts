
// In-memory array for storing tasks, each with a unique 'id' and a 'title'.
let tasks = [
  { id: 1, title: 'Learn React' },
  { id: 2, title: 'Learn TypeScript' },
];

// API handler for performing CRUD operations on tasks.
export default function handler(req, res) {
  const { method } = req; // Extract HTTP method.
  console.log('Method:', method); // Log method for debugging.

  switch (method) {
    case 'GET':
      res.status(200).json(tasks); // Return all tasks.
      break;

    case 'POST':
      const newTask = req.body;
      tasks.push(newTask); // Add new task to the list.
      res.status(201).json(newTask); // Return the added task.
      break;

    case 'PUT':
      const { id, title } = req.body;
      tasks = tasks.map(task => (task.id === id ? { ...task, title } : task)); // Update task title.
      res.status(200).json({ id, title }); // Return updated task.
      break;

    case 'DELETE':
      const taskId = parseInt(req.query.id);
      tasks = tasks.filter(task => task.id !== taskId); // Remove task by id.
      res.status(204).end(); // Confirm deletion.
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']); // Specify allowed methods.
      res.status(405).end(`Method ${method} Not Allowed`); // Handle unsupported methods.
  }
}
