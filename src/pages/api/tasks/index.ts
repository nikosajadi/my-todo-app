// You can use a temporary in-memory store or connect to a database for persistent storage.
// For this example, I'm using a temporary store for simplicity.
let tasks = any=[];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      res.status(200).json(tasks); // Return the tasks stored in the in-memory array
      break;

    case 'POST':
      const newTask = req.body;
      tasks.push(newTask); // Add the new task to the tasks array
      res.status(201).json(newTask);
      break;

    case 'PUT':
      const { id, title } = req.body;
      const taskIndex = tasks.findIndex((task:any) => task.id == id);
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }
      tasks[taskIndex].title = title; // Update task title
      tasks[taskIndex].completed = completed;
      //res.status(200).json({ id, title });
      res.status(200).json(tasks[taskIndex]);
      break;

    case 'DELETE':
      const taskId = req.query.id;
      tasks = tasks.filter(task => task.id != taskId); // Remove task with the given id
      res.status(204).end();
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

