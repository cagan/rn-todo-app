// src/store/__tests__/todo.store.test.ts
// @tdd-guide tarafından yazıldı — implementasyondan ÖNCE (RED aşaması)
// Priority feature: addTodo priority parametresi almalı, default 'medium'

import { act } from '@testing-library/react-native'
import { useTodoStore } from '../todo.store'
import { storageService } from '@/services/storage.service'
import { Priority } from '@/types/todo.types'

// storageService mock — gerçek AsyncStorage'a dokunmayalım
jest.mock('@/services/storage.service', () => ({
  storageService: {
    saveTodos: jest.fn().mockResolvedValue(undefined),
    loadTodos: jest.fn().mockResolvedValue([]),
    clearTodos: jest.fn().mockResolvedValue(undefined),
  },
}))

// Her testten önce store'u sıfırla
const resetStore = () => {
  useTodoStore.setState({
    todos: [],
    filter: 'all',
    isLoading: false,
    error: null,
  })
}

describe('useTodoStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetStore()
  })

  describe('addTodo — priority parametresi', () => {
    it('should add todo with default priority "medium" when no priority given', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Test Todo')
      })

      const todos = useTodoStore.getState().todos
      expect(todos).toHaveLength(1)
      // Priority belirtilmedi → default 'medium' atanmalı
      expect(todos[0].priority).toBe('medium')
    })

    it('should add todo with "low" priority when explicitly specified', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Düşük Öncelikli Todo', 'low')
      })

      const todos = useTodoStore.getState().todos
      expect(todos[0].priority).toBe('low')
    })

    it('should add todo with "high" priority when explicitly specified', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Yüksek Öncelikli Todo', 'high')
      })

      const todos = useTodoStore.getState().todos
      expect(todos[0].priority).toBe('high')
    })

    it('should add todo with "medium" priority when explicitly specified', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Orta Öncelikli Todo', 'medium')
      })

      const todos = useTodoStore.getState().todos
      expect(todos[0].priority).toBe('medium')
    })

    it('should persist priority to storage when adding todo', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Storage Test Todo', 'high')
      })

      // saveTodos çağrıldı mı?
      expect(storageService.saveTodos).toHaveBeenCalledTimes(1)
      // Kaydedilen todo'nun priority'si doğru mu?
      const savedTodos = (storageService.saveTodos as jest.Mock).mock.calls[0][0] as Array<{ priority: Priority }>
      expect(savedTodos[0].priority).toBe('high')
    })

    it('should add multiple todos with different priorities', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Düşük', 'low')
        await useTodoStore.getState().addTodo('Orta')
        await useTodoStore.getState().addTodo('Yüksek', 'high')
      })

      const todos = useTodoStore.getState().todos
      expect(todos).toHaveLength(3)
      expect(todos[0].priority).toBe('low')
      expect(todos[1].priority).toBe('medium')
      expect(todos[2].priority).toBe('high')
    })

    it('should not add todo with empty title regardless of priority', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('   ', 'high')
      })

      const todos = useTodoStore.getState().todos
      // Boş başlık → todo eklenmemeli
      expect(todos).toHaveLength(0)
    })
  })

  describe('addTodo — mevcut davranış korunuyor', () => {
    it('should add todo with correct title', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Test Todo')
      })

      const todos = useTodoStore.getState().todos
      expect(todos[0].title).toBe('Test Todo')
    })

    it('should trim whitespace from title', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('  Başlık  ')
      })

      const todos = useTodoStore.getState().todos
      expect(todos[0].title).toBe('Başlık')
    })

    it('should add todo with completed false', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Test Todo')
      })

      const todos = useTodoStore.getState().todos
      expect(todos[0].completed).toBe(false)
    })

    it('should set error when storage fails', async () => {
      (storageService.saveTodos as jest.Mock).mockRejectedValueOnce(new Error('Storage full'))

      await act(async () => {
        await useTodoStore.getState().addTodo('Test Todo', 'medium')
      })

      expect(useTodoStore.getState().error).toBe('Todo kaydedilemedi. Tekrar dene.')
    })
  })

  describe('editTodo', () => {
    // Yardımcı: store'a bir todo ekleyip id'sini döndürür
    const addAndGetId = async (title = 'Düzenlenecek Todo', priority: Priority = 'medium'): Promise<string> => {
      await act(async () => {
        await useTodoStore.getState().addTodo(title, priority)
      })
      return useTodoStore.getState().todos[0].id
    }

    it('should update title of matching todo (happy path)', async () => {
      const id = await addAndGetId()

      await act(async () => {
        await useTodoStore.getState().editTodo(id, 'Güncellenmiş Başlık', 'medium')
      })

      const todo = useTodoStore.getState().todos.find((t) => t.id === id)
      // Başlık değişmeli
      expect(todo?.title).toBe('Güncellenmiş Başlık')
    })

    it('should update priority of matching todo (happy path)', async () => {
      const id = await addAndGetId('Todo', 'low')

      await act(async () => {
        await useTodoStore.getState().editTodo(id, 'Todo', 'high')
      })

      const todo = useTodoStore.getState().todos.find((t) => t.id === id)
      // Priority değişmeli
      expect(todo?.priority).toBe('high')
    })

    it('should update both title and priority in a single call', async () => {
      const id = await addAndGetId('Eski Başlık', 'low')

      await act(async () => {
        await useTodoStore.getState().editTodo(id, 'Yeni Başlık', 'high')
      })

      const todo = useTodoStore.getState().todos.find((t) => t.id === id)
      expect(todo?.title).toBe('Yeni Başlık')
      expect(todo?.priority).toBe('high')
    })

    it('should be a no-op when title is empty string', async () => {
      const id = await addAndGetId('Orijinal Başlık', 'medium')

      await act(async () => {
        // Boş title → güncelleme yapılmamalı
        await useTodoStore.getState().editTodo(id, '', 'high')
      })

      const todo = useTodoStore.getState().todos.find((t) => t.id === id)
      expect(todo?.title).toBe('Orijinal Başlık')
      expect(todo?.priority).toBe('medium')
    })

    it('should be a no-op when title is whitespace only', async () => {
      const id = await addAndGetId('Orijinal Başlık', 'medium')

      await act(async () => {
        // Sadece boşluk → no-op
        await useTodoStore.getState().editTodo(id, '   ', 'high')
      })

      const todo = useTodoStore.getState().todos.find((t) => t.id === id)
      expect(todo?.title).toBe('Orijinal Başlık')
    })

    it('should persist updated todo to storage', async () => {
      const id = await addAndGetId('İlk Başlık', 'low')
      jest.clearAllMocks()

      await act(async () => {
        await useTodoStore.getState().editTodo(id, 'Kalıcı Başlık', 'high')
      })

      // saveTodos bir kez çağrılmalı
      expect(storageService.saveTodos).toHaveBeenCalledTimes(1)
      const savedTodos = (storageService.saveTodos as jest.Mock).mock.calls[0][0] as Array<{
        title: string
        priority: Priority
      }>
      expect(savedTodos[0].title).toBe('Kalıcı Başlık')
      expect(savedTodos[0].priority).toBe('high')
    })

    it('should set error when storage fails during edit', async () => {
      const id = await addAndGetId()
      ;(storageService.saveTodos as jest.Mock).mockRejectedValueOnce(new Error('Disk dolu'))

      await act(async () => {
        await useTodoStore.getState().editTodo(id, 'Başlık', 'medium')
      })

      // Storage hatası → error state set edilmeli
      expect(useTodoStore.getState().error).not.toBeNull()
    })

    it('should silently pass when id does not exist', async () => {
      await act(async () => {
        // Var olmayan id → hata fırlatmamalı, state değişmemeli
        await useTodoStore.getState().editTodo('var-olmayan-id', 'Başlık', 'medium')
      })

      // Store hata state'ine girmemeli, todos boş kalmalı
      expect(useTodoStore.getState().todos).toHaveLength(0)
      expect(useTodoStore.getState().error).toBeNull()
    })

    it('should only update the targeted todo, leaving others unchanged', async () => {
      // İki todo ekle
      await act(async () => {
        await useTodoStore.getState().addTodo('Birinci', 'low')
        await useTodoStore.getState().addTodo('İkinci', 'high')
      })

      const [first, second] = useTodoStore.getState().todos

      await act(async () => {
        await useTodoStore.getState().editTodo(first.id, 'Birinci Güncellendi', 'medium')
      })

      const todos = useTodoStore.getState().todos
      const updatedFirst = todos.find((t) => t.id === first.id)
      const untouchedSecond = todos.find((t) => t.id === second.id)

      // Hedef todo güncellendi
      expect(updatedFirst?.title).toBe('Birinci Güncellendi')
      // Diğer todo dokunulmadı
      expect(untouchedSecond?.title).toBe('İkinci')
      expect(untouchedSecond?.priority).toBe('high')
    })
  })

  describe('toggleTodo', () => {
    it('should toggle completed state from false to true', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Toggle Test')
      })
      const id = useTodoStore.getState().todos[0].id

      await act(async () => {
        await useTodoStore.getState().toggleTodo(id)
      })

      expect(useTodoStore.getState().todos[0].completed).toBe(true)
    })

    it('should toggle completed state from true back to false', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Toggle Test')
      })
      const id = useTodoStore.getState().todos[0].id

      await act(async () => {
        await useTodoStore.getState().toggleTodo(id)
        await useTodoStore.getState().toggleTodo(id)
      })

      expect(useTodoStore.getState().todos[0].completed).toBe(false)
    })

    it('should persist toggled state to storage', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Toggle Persist')
      })
      const id = useTodoStore.getState().todos[0].id
      jest.clearAllMocks()

      await act(async () => {
        await useTodoStore.getState().toggleTodo(id)
      })

      expect(storageService.saveTodos).toHaveBeenCalledTimes(1)
    })

    it('should set error when storage fails during toggle', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Toggle Error')
      })
      const id = useTodoStore.getState().todos[0].id
      ;(storageService.saveTodos as jest.Mock).mockRejectedValueOnce(new Error('fail'))

      await act(async () => {
        await useTodoStore.getState().toggleTodo(id)
      })

      expect(useTodoStore.getState().error).toBe('Değişiklik kaydedilemedi.')
    })
  })

  describe('deleteTodo', () => {
    it('should remove todo from list', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Delete Me')
      })
      const id = useTodoStore.getState().todos[0].id

      await act(async () => {
        await useTodoStore.getState().deleteTodo(id)
      })

      expect(useTodoStore.getState().todos).toHaveLength(0)
    })

    it('should persist deletion to storage', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Delete Persist')
      })
      const id = useTodoStore.getState().todos[0].id
      jest.clearAllMocks()

      await act(async () => {
        await useTodoStore.getState().deleteTodo(id)
      })

      expect(storageService.saveTodos).toHaveBeenCalledWith([])
    })

    it('should set error when storage fails during delete', async () => {
      await act(async () => {
        await useTodoStore.getState().addTodo('Delete Error')
      })
      const id = useTodoStore.getState().todos[0].id
      ;(storageService.saveTodos as jest.Mock).mockRejectedValueOnce(new Error('fail'))

      await act(async () => {
        await useTodoStore.getState().deleteTodo(id)
      })

      expect(useTodoStore.getState().error).toBe('Todo silinemedi.')
    })
  })

  describe('loadTodos', () => {
    it('should load todos with priority from storage', async () => {
      const storedTodos = [
        {
          id: '1',
          title: 'Stored Todo',
          completed: false,
          createdAt: new Date('2024-01-01'),
          priority: 'high' as Priority,
        },
      ]
      ;(storageService.loadTodos as jest.Mock).mockResolvedValueOnce(storedTodos)

      await act(async () => {
        await useTodoStore.getState().loadTodos()
      })

      const todos = useTodoStore.getState().todos
      expect(todos[0].priority).toBe('high')
    })

    it('should set isLoading during load', async () => {
      (storageService.loadTodos as jest.Mock).mockResolvedValueOnce([])

      await act(async () => {
        await useTodoStore.getState().loadTodos()
      })

      expect(useTodoStore.getState().isLoading).toBe(false)
    })

    it('should set error when load fails', async () => {
      (storageService.loadTodos as jest.Mock).mockRejectedValueOnce(new Error('fail'))

      await act(async () => {
        await useTodoStore.getState().loadTodos()
      })

      expect(useTodoStore.getState().error).toBe('Todolar yüklenemedi.')
      expect(useTodoStore.getState().isLoading).toBe(false)
    })
  })

  describe('setFilter', () => {
    it('should update filter state', () => {
      act(() => {
        useTodoStore.getState().setFilter('active')
      })
      expect(useTodoStore.getState().filter).toBe('active')

      act(() => {
        useTodoStore.getState().setFilter('completed')
      })
      expect(useTodoStore.getState().filter).toBe('completed')
    })
  })

  describe('clearError', () => {
    it('should clear error state', async () => {
      (storageService.saveTodos as jest.Mock).mockRejectedValueOnce(new Error('fail'))
      await act(async () => {
        await useTodoStore.getState().addTodo('Error Todo')
      })
      expect(useTodoStore.getState().error).not.toBeNull()

      act(() => {
        useTodoStore.getState().clearError()
      })
      expect(useTodoStore.getState().error).toBeNull()
    })
  })
})
