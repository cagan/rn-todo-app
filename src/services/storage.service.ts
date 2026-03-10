// src/services/storage.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Todo, Priority, DEFAULT_PRIORITY } from '@/types/todo.types'

const TODOS_KEY = '@rn_todo_app:todos'

export const storageService = {
  async saveTodos(todos: Todo[]): Promise<void> {
    try {
      const serialized = JSON.stringify(todos)
      await AsyncStorage.setItem(TODOS_KEY, serialized)
    } catch (error) {
      throw new Error(`Failed to save todos: ${String(error)}`)
    }
  },

  async loadTodos(): Promise<Todo[]> {
    try {
      const raw = await AsyncStorage.getItem(TODOS_KEY)
      if (!raw) return []

      type PersistedTodo = Omit<Todo, 'createdAt' | 'priority' | 'dueDate'> & {
        createdAt: string
        priority?: Priority
        dueDate?: string
      }

      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      return (parsed as PersistedTodo[]).map((todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        priority: todo.priority ?? DEFAULT_PRIORITY,
        dueDate: todo.dueDate != null ? new Date(todo.dueDate) : undefined,
      }))
    } catch (error) {
      throw new Error(`Failed to load todos: ${String(error)}`)
    }
  },

  async clearTodos(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TODOS_KEY)
    } catch (error) {
      throw new Error(`Failed to clear todos: ${String(error)}`)
    }
  },
}
