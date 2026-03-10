// src/store/todo.store.ts
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { Todo, TodoStore, Priority, DEFAULT_PRIORITY } from '@/types/todo.types'
import { storageService } from '@/services/storage.service'

export const useTodoStore = create<TodoStore>((set, get) => ({
  // Initial state
  todos: [],
  filter: 'all',
  isLoading: false,
  error: null,

  // Actions
  addTodo: async (title: string, priority: Priority = DEFAULT_PRIORITY, dueDate?: Date): Promise<void> => {
    const trimmed = title.trim()
    if (!trimmed) return

    const newTodo: Todo = {
      id: uuidv4(),
      title: trimmed,
      completed: false,
      createdAt: new Date(),
      priority,
      dueDate,
    }

    const updatedTodos = [...get().todos, newTodo]
    set({ todos: updatedTodos, error: null })

    try {
      await storageService.saveTodos(updatedTodos)
    } catch {
      set({ error: 'Todo kaydedilemedi. Tekrar dene.' })
    }
  },

  toggleTodo: async (id: string): Promise<void> => {
    const updatedTodos = get().todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )

    set({ todos: updatedTodos, error: null })

    try {
      await storageService.saveTodos(updatedTodos)
    } catch {
      set({ error: 'Değişiklik kaydedilemedi.' })
    }
  },

  editTodo: async (id: string, title: string, priority: Priority, dueDate?: Date): Promise<void> => {
    const trimmed = title.trim()
    if (!trimmed) return
    if (!get().todos.some((t) => t.id === id)) return

    const updatedTodos = get().todos.map((todo) =>
      todo.id === id ? { ...todo, title: trimmed, priority, dueDate } : todo
    )

    set({ todos: updatedTodos, error: null })

    try {
      await storageService.saveTodos(updatedTodos)
    } catch {
      set({ error: 'Todo güncellenemedi. Tekrar dene.' })
    }
  },

  deleteTodo: async (id: string): Promise<void> => {
    const updatedTodos = get().todos.filter((todo) => todo.id !== id)
    set({ todos: updatedTodos, error: null })

    try {
      await storageService.saveTodos(updatedTodos)
    } catch {
      set({ error: 'Todo silinemedi.' })
    }
  },

  setFilter: (filter): void => {
    set({ filter })
  },

  loadTodos: async (): Promise<void> => {
    set({ isLoading: true, error: null })

    try {
      const todos = await storageService.loadTodos()
      set({ todos, isLoading: false })
    } catch {
      set({ isLoading: false, error: 'Todolar yüklenemedi.' })
    }
  },

  clearError: (): void => {
    set({ error: null })
  },
}))

// Derived selector — filtered todos
export const useFilteredTodos = (): Todo[] => {
  const { todos, filter } = useTodoStore()

  switch (filter) {
    case 'active':
      return todos.filter((t) => !t.completed)
    case 'completed':
      return todos.filter((t) => t.completed)
    default:
      return todos
  }
}
