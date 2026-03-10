// src/types/todo.types.ts
// @architect tarafından tanımlandı — değiştirmeden önce @architect'e danış

export type FilterType = 'all' | 'active' | 'completed'

// Priority seviyeleri — blueprint tanımı
export type Priority = 'low' | 'medium' | 'high'

// Priority görsel konfigürasyonu
export interface PriorityConfig {
  color: string
  label: string
}

// Priority sabitleri — PRIORITY_CONFIG[priority] ile erişilir
export const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  low: { color: '#4CAF50', label: 'Düşük' },
  medium: { color: '#FFC107', label: 'Orta' },
  high: { color: '#F44336', label: 'Yüksek' },
}

export const DEFAULT_PRIORITY: Priority = 'medium'

export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  // Priority zorunlu alan — yeni todolar için DEFAULT_PRIORITY kullanılır
  priority: Priority
  // dueDate opsiyonel — due date feature (blueprint v2)
  dueDate?: Date
}

export interface TodoStore {
  // State
  todos: Todo[]
  filter: FilterType
  isLoading: boolean
  error: string | null

  // Actions — priority ve dueDate parametreleri; dueDate opsiyonel
  addTodo: (title: string, priority?: Priority, dueDate?: Date) => Promise<void>
  toggleTodo: (id: string) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  // editTodo — title, priority ve opsiyonel dueDate günceller; boş title ile çağrı no-op
  editTodo: (id: string, title: string, priority: Priority, dueDate?: Date) => Promise<void>
  setFilter: (filter: FilterType) => void
  loadTodos: () => Promise<void>
  clearError: () => void
}
