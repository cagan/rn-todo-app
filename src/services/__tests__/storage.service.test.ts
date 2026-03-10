// src/services/__tests__/storage.service.test.ts
// Priority feature eklendi — RED aşaması
// Migration testi: priority alanı olmayan eski todo'lar 'medium' almalı

import AsyncStorage from '@react-native-async-storage/async-storage'
import { storageService } from '../storage.service'
import { Todo } from '@/types/todo.types'

// Priority alanı artık zorunlu
const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Test Todo 1',
    completed: false,
    createdAt: new Date('2024-01-01'),
    priority: 'low',
  },
  {
    id: '2',
    title: 'Test Todo 2',
    completed: true,
    createdAt: new Date('2024-01-02'),
    priority: 'high',
  },
]

describe('storageService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('saveTodos', () => {
    it('should save todos to AsyncStorage', async () => {
      await storageService.saveTodos(mockTodos)
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@rn_todo_app:todos',
        expect.any(String)
      )
    })

    it('should serialize dates correctly', async () => {
      await storageService.saveTodos(mockTodos)
      const [, serialized] = (AsyncStorage.setItem as jest.Mock).mock.calls[0] as [string, string]
      const parsed = JSON.parse(serialized) as unknown[]
      expect(parsed).toHaveLength(2)
    })

    it('should serialize priority field correctly', async () => {
      await storageService.saveTodos(mockTodos)
      const [, serialized] = (AsyncStorage.setItem as jest.Mock).mock.calls[0] as [string, string]
      const parsed = JSON.parse(serialized) as Array<{ priority: string }>
      // Priority alanı JSON'a doğru yazılmalı
      expect(parsed[0].priority).toBe('low')
      expect(parsed[1].priority).toBe('high')
    })

    it('should throw on AsyncStorage error', async () => {
      ;(AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage full'))
      await expect(storageService.saveTodos(mockTodos)).rejects.toThrow('Failed to save todos')
    })
  })

  describe('loadTodos', () => {
    it('should return empty array when no data exists', async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null)
      const result = await storageService.loadTodos()
      expect(result).toEqual([])
    })

    it('should deserialize dates from string', async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockTodos))
      const result = await storageService.loadTodos()
      expect(result[0].createdAt).toBeInstanceOf(Date)
    })

    it('should preserve priority field when loading todos', async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockTodos))
      const result = await storageService.loadTodos()
      // Priority değerleri kayıp olmadan yüklenmeli
      expect(result[0].priority).toBe('low')
      expect(result[1].priority).toBe('high')
    })

    // Migration testi — eski veriler priority alanı içermeyebilir
    it('should assign default priority "medium" to todos without priority field', async () => {
      // Eski format: priority alanı yok
      const legacyTodos = [
        { id: '1', title: 'Eski Todo', completed: false, createdAt: new Date('2024-01-01').toISOString() },
        { id: '2', title: 'Başka Eski Todo', completed: true, createdAt: new Date('2024-01-02').toISOString() },
      ]
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(legacyTodos))

      const result = await storageService.loadTodos()

      // Migration: priority yoksa 'medium' atanmalı
      expect(result[0].priority).toBe('medium')
      expect(result[1].priority).toBe('medium')
    })

    it('should not override existing priority during migration', async () => {
      // Karışık veri: bazıları priority'li, bazıları değil
      const mixedTodos = [
        { id: '1', title: 'Priority var', completed: false, createdAt: new Date('2024-01-01').toISOString(), priority: 'high' },
        { id: '2', title: 'Priority yok', completed: false, createdAt: new Date('2024-01-02').toISOString() },
      ]
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mixedTodos))

      const result = await storageService.loadTodos()

      // Mevcut priority korunmalı, eksik olan 'medium' almalı
      expect(result[0].priority).toBe('high')
      expect(result[1].priority).toBe('medium')
    })

    it('should throw on parse error', async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid json{{{')
      await expect(storageService.loadTodos()).rejects.toThrow('Failed to load todos')
    })
  })

  describe('clearTodos', () => {
    it('should remove todos from AsyncStorage', async () => {
      await storageService.clearTodos()
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@rn_todo_app:todos')
    })
  })
})
