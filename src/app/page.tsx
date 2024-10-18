"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import { Moon, Plus, Search, Sun, X, Calendar, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import confetti from "canvas-confetti"

type Todo = {
  id: number
  text: string
  completed: boolean
  date: Date
  important: boolean
  order: number
}

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode")
    if (storedDarkMode) {
      setDarkMode(storedDarkMode === "true")
    }
    const storedTodos = localStorage.getItem("todos")
    if (storedTodos) {
      const parsedTodos: Todo[] = JSON.parse(storedTodos)
      const todosWithDates = parsedTodos.map((todo) => ({
        ...todo,
        date: new Date(todo.date),
      }))
      setTodos(todosWithDates)
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback(() => {
    if (newTodo.trim() !== "") {
      setTodos((prevTodos) => [
        ...prevTodos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          date: new Date(),
          important: false,
          order: prevTodos.length,
        },
      ])
      setNewTodo("")
    }
  }, [newTodo])

  const toggleTodo = useCallback((id: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
      if (updatedTodos.every((todo) => todo.completed)) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
      return updatedTodos
    })
  }, [])

  const toggleImportant = useCallback((id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, important: !todo.important } : todo
      )
    )
  }, [])

  const removeTodo = useCallback((id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }, [])

  const sortedTodos = useMemo(() => {
    return todos.slice().sort((a, b) => a.order - b.order)
  }, [todos])

  const filteredTodos = useMemo(() => {
    return sortedTodos.filter((todo) => {
      const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      switch (activeTab) {
        case "completed":
          return matchesSearch && todo.completed
        case "active":
          return matchesSearch && !todo.completed
        case "important":
          return matchesSearch && todo.important
        default:
          return matchesSearch
      }
    })
  }, [sortedTodos, searchTerm, activeTab])

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return

      const { source, destination } = result

      const sourceTodoId = filteredTodos[source.index].id
      const destinationTodoId = filteredTodos[destination.index].id

      setTodos((prevTodos) => {
        const todosCopy = [...prevTodos]

        const sourceIndex = todosCopy.findIndex((todo) => todo.id === sourceTodoId)
        const destinationIndex = todosCopy.findIndex((todo) => todo.id === destinationTodoId)

        if (sourceIndex === -1 || destinationIndex === -1) {
          return prevTodos
        }

        const [removedTodo] = todosCopy.splice(sourceIndex, 1)
        todosCopy.splice(destinationIndex, 0, removedTodo)

        // Reassign the order property
        return todosCopy.map((todo, index) => ({ ...todo, order: index }))
      })
    },
    [filteredTodos]
  )

  const completedPercentage = useMemo(() => {
    return (todos.filter((todo) => todo.completed).length / todos.length) * 100 || 0
  }, [todos])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300 font-sans">
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Todo</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="mb-6 flex space-x-2">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addTodo()
              }
            }}
            className="flex-grow focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-all duration-300 rounded-full text-sm"
          />
          <Button
            onClick={addTodo}
            className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 rounded-full px-4"
            aria-label="Add task"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-all duration-300 rounded-full text-sm"
              aria-label="Search tasks"
            />
          </div>
        </div>

        <div className="mb-6">
          <Progress
            value={completedPercentage}
            className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            {completedPercentage.toFixed(0)}% completed
          </p>
        </div>

        <Tabs value={activeTab} className="mb-6" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            <TabsTrigger value="all" className="rounded-full text-xs transition-all duration-300">
              All
            </TabsTrigger>
            <TabsTrigger value="active" className="rounded-full text-xs transition-all duration-300">
              Active
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-full text-xs transition-all duration-300"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="important"
              className="rounded-full text-xs transition-all duration-300"
            >
              Important
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId="todos">
    {(droppableProvided) => (
      <ul
        {...droppableProvided.droppableProps}
        ref={droppableProvided.innerRef}
        className="space-y-2"
      >
        {filteredTodos.map((todo, index) => (
          <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
            {(draggableProvided) => (
              <li
                ref={draggableProvided.innerRef}
                {...draggableProvided.draggableProps}
                {...draggableProvided.dragHandleProps}
                className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm ${
                  todo.completed ? "opacity-60" : ""
                } ${
                  todo.important ? "border-l-2 border-blue-500 dark:border-blue-400" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="border-2 border-gray-300 dark:border-gray-600 rounded-full w-5 h-5"
                      aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                    />
                    <div>
                      <span
                        className={`text-sm ${
                          todo.completed
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : ""
                        }`}
                      >
                        {todo.text}
                      </span>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(todo.date, "d MMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleImportant(todo.id)}
                      className={`rounded-full transition-all duration-300 p-1 ${
                        todo.important
                          ? "text-yellow-500 dark:text-yellow-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                      aria-label={todo.important ? "Unmark as important" : "Mark as important"}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTodo(todo.id)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-full transition-all duration-300 p-1"
                      aria-label="Delete task"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            )}
          </Draggable>
        ))}
        {droppableProvided.placeholder}
      </ul>
    )}
  </Droppable>
</DragDropContext>

      </div>
    </div>
  )
}
