import { useState } from 'react';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

const ToDoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          className="border p-2 rounded"
        />
        <button onClick={addTask} className="ml-2 p-2 bg-blue-500 text-white rounded">
          Add Task
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
            />
            <span className={`ml-2 ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
