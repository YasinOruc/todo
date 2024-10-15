'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { ScrollArea } from "../components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { AnimatePresence, motion } from "framer-motion"
import { Sun, Inbox, Calendar, Trash2 } from 'lucide-react'

type Task = {
  id: number
  text: string
  completed: boolean
  label: string
}

type Label = {
  name: string
  count: number
}

const InteractiveTodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<string>("")
  const [newLabel, setNewLabel] = useState<string>("")
  const [filter, setFilter] = useState<string>("all")

  const labels: Label[] = [
    { name: "Work", count: tasks.filter(task => task.label === "Work").length },
    { name: "Personal", count: tasks.filter(task => task.label === "Personal").length },
    { name: "Urgent", count: tasks.filter(task => task.label === "Urgent").length },
  ]

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      setTasks(savedTasks)
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error)
    }
  }, [])

  // Save tasks to localStorage when tasks array changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = useCallback(() => {
    if (newTask.trim()) {
      setTasks(prevTasks => [
        ...prevTasks,
        { id: Date.now(), text: newTask, completed: false, label: newLabel || "Personal" }
      ])
      setNewTask("")
      setNewLabel("")
    }
  }, [newTask, newLabel])

  const toggleTask = useCallback((id: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }, [])

  const removeTask = useCallback((id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
  }, [])

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true
    if (filter === "completed") return task.completed
    if (filter === "active") return !task.completed
    return task.label === filter
  })

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-80 bg-white p-4 border-r border-gray-200">
        <ScrollArea className="h-[calc(100vh-2rem)]">
          <nav className="space-y-2 mb-8">
            <Button variant="ghost" className="w-full justify-start" onClick={() => setFilter("all")}>
              <Sun className="mr-2 h-4 w-4" />
              All Tasks
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setFilter("active")}>
              <Inbox className="mr-2 h-4 w-4" />
              Active
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setFilter("completed")}>
              <Calendar className="mr-2 h-4 w-4" />
              Completed
            </Button>
          </nav>
          <div>
            <h3 className="font-bold text-lg mb-2">Labels</h3>
            {labels.map((label) => (
              <Button
                key={label.name}
                variant="ghost"
                className="w-full justify-between"
                onClick={() => setFilter(label.name)}
              >
                <span>{label.name}</span>
                <span>{label.count}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </aside>
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Todo App</h1>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="New task"
              value={newTask}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
              className="w-64"
            />
            <Input
              type="text"
              placeholder="Label"
              value={newLabel}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLabel(e.target.value)}
              className="w-32"
            />
            <Button onClick={addTask}>Add Task</Button>
          </div>
        </div>
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setFilter("all")}>All</TabsTrigger>
            <TabsTrigger value="active" onClick={() => setFilter("active")}>Active</TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setFilter("completed")}>Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between py-2 border-b"
              >
                <div className="flex items-center">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`ml-2 ${task.completed ? 'line-through text-gray-500' : ''}`}
                  >
                    {task.text}
                  </label>
                  <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">{task.label}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete task</span>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </main>
    </div>
  )
}

export default memo(InteractiveTodoApp)
