

let index = [
  { id: 1, title: 'Learn React' },
  { id: 2, title: 'Learn TypeScript' },
];

export default function handler(req, res) {
  const { method } = req;
console.log('method  : ' , method)
  switch (method) {
    case 'GET':
      res.status(200).json(index);
      break;
    case 'POST':
      const newTask = req.body;
      index.push(newTask);
      res.status(201).json(newTask);
      break;
    case 'PUT':
      const { id, title } = req.body;
      index = index.map(task => (task.id === id ? { ...task, title } : task));
      res.status(200).json({ id, title });
      break;
    case 'DELETE':
      const taskId = parseInt(req.query.id);
      index = index.filter(task => task.id !== taskId);
      res.status(204).end();
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
