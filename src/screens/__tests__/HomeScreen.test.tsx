// src/screens/__tests__/HomeScreen.test.tsx
// @tdd-guide tarafından yazıldı — implementasyondan ÖNCE (RED aşaması)
// HomeScreen: store entegrasyonu, loading/error state, todo list, modal akışı

import React from 'react'
import { render, fireEvent, screen, act } from '@testing-library/react-native'
import { HomeScreen } from '../HomeScreen'
import { Todo, FilterType } from '@/types/todo.types'

// ---------------------------------------------------------------------------
// Store mock — gerçek Zustand store yerine kontrollü state enjekte ederiz
// ---------------------------------------------------------------------------
const mockLoadTodos = jest.fn()
const mockAddTodo = jest.fn()
const mockToggleTodo = jest.fn()
const mockDeleteTodo = jest.fn()
const mockEditTodo = jest.fn()
const mockSetFilter = jest.fn()
const mockClearError = jest.fn()

// useTodoStore ve useFilteredTodos birlikte mock'lanıyor
jest.mock('@/store/todo.store', () => ({
  useTodoStore: jest.fn(),
  useFilteredTodos: jest.fn(),
}))

import { useTodoStore, useFilteredTodos } from '@/store/todo.store'

const mockUseTodoStore = useTodoStore as unknown as jest.Mock
const mockUseFilteredTodos = useFilteredTodos as unknown as jest.Mock

// ---------------------------------------------------------------------------
// Test verileri
// ---------------------------------------------------------------------------
const baseTodo: Todo = {
  id: '1',
  title: 'Test Todo',
  completed: false,
  createdAt: new Date('2024-01-01'),
  priority: 'medium',
}

const completedTodo: Todo = {
  id: '2',
  title: 'Tamamlanmış Todo',
  completed: true,
  createdAt: new Date('2024-01-02'),
  priority: 'low',
}

// Varsayılan store durumu — her testte override edilebilir
const defaultStoreState = {
  todos: [baseTodo],
  filter: 'all' as FilterType,
  isLoading: false,
  error: null,
  loadTodos: mockLoadTodos,
  addTodo: mockAddTodo,
  toggleTodo: mockToggleTodo,
  deleteTodo: mockDeleteTodo,
  editTodo: mockEditTodo,
  setFilter: mockSetFilter,
  clearError: mockClearError,
}

// Her test öncesi store mock'unu sıfırla ve varsayılan state enjekte et
beforeEach(() => {
  jest.clearAllMocks()
  mockUseTodoStore.mockReturnValue(defaultStoreState)
  mockUseFilteredTodos.mockReturnValue([baseTodo])
  mockLoadTodos.mockResolvedValue(undefined)
  mockAddTodo.mockResolvedValue(undefined)
  mockToggleTodo.mockResolvedValue(undefined)
  mockDeleteTodo.mockResolvedValue(undefined)
  mockEditTodo.mockResolvedValue(undefined)
})

describe('HomeScreen', () => {
  describe('mount davranışı', () => {
    it('should call loadTodos on mount', () => {
      render(<HomeScreen />)
      expect(mockLoadTodos).toHaveBeenCalledTimes(1)
    })

    it('should not call loadTodos more than once on initial render', () => {
      render(<HomeScreen />)
      expect(mockLoadTodos).toHaveBeenCalledTimes(1)
    })
  })

  describe('loading state', () => {
    it('should show ActivityIndicator when isLoading is true', () => {
      mockUseTodoStore.mockReturnValue({ ...defaultStoreState, isLoading: true })
      render(<HomeScreen />)
      expect(screen.getByTestId('home-loading-indicator')).toBeTruthy()
    })

    it('should NOT show ActivityIndicator when isLoading is false', () => {
      render(<HomeScreen />)
      expect(screen.queryByTestId('home-loading-indicator')).toBeNull()
    })

    it('should NOT show todo list while loading', () => {
      mockUseTodoStore.mockReturnValue({ ...defaultStoreState, isLoading: true })
      render(<HomeScreen />)
      expect(screen.queryByTestId('home-todo-list')).toBeNull()
    })
  })

  describe('error state', () => {
    it('should show error message when error is not null', () => {
      mockUseTodoStore.mockReturnValue({
        ...defaultStoreState,
        error: 'Todolar yüklenemedi.',
      })
      render(<HomeScreen />)
      expect(screen.getByText('Todolar yüklenemedi.')).toBeTruthy()
    })

    it('should show clearError button when error is present', () => {
      mockUseTodoStore.mockReturnValue({
        ...defaultStoreState,
        error: 'Bir hata oluştu.',
      })
      render(<HomeScreen />)
      expect(screen.getByTestId('home-clear-error-button')).toBeTruthy()
    })

    it('should call clearError when error button is pressed', () => {
      mockUseTodoStore.mockReturnValue({
        ...defaultStoreState,
        error: 'Bir hata oluştu.',
      })
      render(<HomeScreen />)
      fireEvent.press(screen.getByTestId('home-clear-error-button'))
      expect(mockClearError).toHaveBeenCalledTimes(1)
    })

    it('should NOT show error message when error is null', () => {
      render(<HomeScreen />)
      expect(screen.queryByTestId('home-clear-error-button')).toBeNull()
    })
  })

  describe('todo list render', () => {
    it('should render FlatList with testID home-todo-list', () => {
      render(<HomeScreen />)
      expect(screen.getByTestId('home-todo-list')).toBeTruthy()
    })

    it('should render todo titles from filteredTodos', () => {
      render(<HomeScreen />)
      expect(screen.getByText('Test Todo')).toBeTruthy()
    })

    it('should render multiple todos', () => {
      mockUseFilteredTodos.mockReturnValue([baseTodo, completedTodo])
      render(<HomeScreen />)
      expect(screen.getByText('Test Todo')).toBeTruthy()
      expect(screen.getByText('Tamamlanmış Todo')).toBeTruthy()
    })

    it('should show empty state message when filteredTodos is empty', () => {
      mockUseFilteredTodos.mockReturnValue([])
      render(<HomeScreen />)
      expect(screen.getByTestId('home-empty-state')).toBeTruthy()
    })

    it('should NOT show empty state when there are todos', () => {
      render(<HomeScreen />)
      expect(screen.queryByTestId('home-empty-state')).toBeNull()
    })
  })

  describe('AddTodoInput entegrasyonu', () => {
    it('should render AddTodoInput component', () => {
      render(<HomeScreen />)
      expect(screen.getByTestId('add-todo-text-input')).toBeTruthy()
    })

    it('should call addTodo when AddTodoInput submits a title', async () => {
      render(<HomeScreen />)

      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), 'Yeni Görev')
      await act(async () => {
        fireEvent.press(screen.getByTestId('add-todo-submit-button'))
      })

      expect(mockAddTodo).toHaveBeenCalledTimes(1)
      expect(mockAddTodo).toHaveBeenCalledWith('Yeni Görev')
    })

    it('should NOT call addTodo when AddTodoInput submits empty string', async () => {
      render(<HomeScreen />)

      await act(async () => {
        fireEvent.press(screen.getByTestId('add-todo-submit-button'))
      })

      expect(mockAddTodo).not.toHaveBeenCalled()
    })
  })

  describe('FilterBar entegrasyonu', () => {
    it('should render FilterBar component', () => {
      render(<HomeScreen />)
      expect(screen.getByTestId('filter-all')).toBeTruthy()
      expect(screen.getByTestId('filter-active')).toBeTruthy()
      expect(screen.getByTestId('filter-completed')).toBeTruthy()
    })

    it('should call setFilter with "active" when Aktif pressed', () => {
      render(<HomeScreen />)
      fireEvent.press(screen.getByTestId('filter-active'))
      expect(mockSetFilter).toHaveBeenCalledWith('active')
    })

    it('should call setFilter with "completed" when Tamamlandı pressed', () => {
      render(<HomeScreen />)
      fireEvent.press(screen.getByTestId('filter-completed'))
      expect(mockSetFilter).toHaveBeenCalledWith('completed')
    })

    it('should call setFilter with "all" when Tümü pressed', () => {
      mockUseTodoStore.mockReturnValue({ ...defaultStoreState, filter: 'active' })
      render(<HomeScreen />)
      fireEvent.press(screen.getByTestId('filter-all'))
      expect(mockSetFilter).toHaveBeenCalledWith('all')
    })

    it('should pass currentFilter to FilterBar', () => {
      mockUseTodoStore.mockReturnValue({ ...defaultStoreState, filter: 'completed' })
      render(<HomeScreen />)
      // Tamamlandı butonu seçili görünmeli
      const completedButton = screen.getByTestId('filter-completed')
      expect(completedButton.props.accessibilityState?.selected).toBe(true)
    })
  })

  describe('TodoItem entegrasyonu', () => {
    it('should call toggleTodo with todo id when checkbox pressed', async () => {
      render(<HomeScreen />)

      await act(async () => {
        fireEvent.press(screen.getByRole('checkbox'))
      })

      expect(mockToggleTodo).toHaveBeenCalledTimes(1)
      expect(mockToggleTodo).toHaveBeenCalledWith('1')
    })

    it('should call deleteTodo with todo id when delete button pressed', async () => {
      render(<HomeScreen />)

      await act(async () => {
        fireEvent.press(screen.getByLabelText('Test Todo sil'))
      })

      expect(mockDeleteTodo).toHaveBeenCalledTimes(1)
      expect(mockDeleteTodo).toHaveBeenCalledWith('1')
    })

    it('should open EditTodoModal when edit button pressed on TodoItem', () => {
      render(<HomeScreen />)

      fireEvent.press(screen.getByLabelText('Test Todo düzenle'))

      // Modal görünür olmalı — içinde "Todoyu Düzenle" header'ı var
      expect(screen.getByText('Todoyu Düzenle')).toBeTruthy()
    })
  })

  describe('EditTodoModal açılma / kapanma', () => {
    it('should NOT show EditTodoModal on initial render', () => {
      render(<HomeScreen />)
      expect(screen.queryByText('Todoyu Düzenle')).toBeNull()
    })

    it('should show EditTodoModal after edit button pressed', () => {
      render(<HomeScreen />)

      fireEvent.press(screen.getByLabelText('Test Todo düzenle'))

      expect(screen.getByText('Todoyu Düzenle')).toBeTruthy()
    })

    it('should close EditTodoModal when İptal pressed', () => {
      render(<HomeScreen />)

      // Modalı aç
      fireEvent.press(screen.getByLabelText('Test Todo düzenle'))
      expect(screen.getByText('Todoyu Düzenle')).toBeTruthy()

      // İptal'e bas
      fireEvent.press(screen.getByText('İptal'))

      expect(screen.queryByText('Todoyu Düzenle')).toBeNull()
    })

    it('should call editTodo and close modal when Kaydet pressed with valid title', async () => {
      render(<HomeScreen />)

      // Modalı aç
      fireEvent.press(screen.getByLabelText('Test Todo düzenle'))

      // Başlığı değiştir ve kaydet
      fireEvent.changeText(screen.getByDisplayValue('Test Todo'), 'Güncellenmiş Başlık')
      await act(async () => {
        fireEvent.press(screen.getByText('Kaydet'))
      })

      expect(mockEditTodo).toHaveBeenCalledTimes(1)
      expect(mockEditTodo).toHaveBeenCalledWith('1', 'Güncellenmiş Başlık', expect.any(String), undefined)
      // Modal kapanmalı
      expect(screen.queryByText('Todoyu Düzenle')).toBeNull()
    })

    it('should pass correct todo to EditTodoModal when edit button pressed', () => {
      mockUseTodoStore.mockReturnValue({ ...defaultStoreState, todos: [baseTodo, completedTodo] })
      mockUseFilteredTodos.mockReturnValue([baseTodo, completedTodo])
      render(<HomeScreen />)

      // İkinci todonu düzenle
      fireEvent.press(screen.getByLabelText('Tamamlanmış Todo düzenle'))

      // Modalda ikinci todounun başlığı prefill olmalı
      expect(screen.getByDisplayValue('Tamamlanmış Todo')).toBeTruthy()
    })
  })

  describe('edge cases', () => {
    it('should render without crashing when todos list is empty', () => {
      mockUseTodoStore.mockReturnValue({ ...defaultStoreState, todos: [] })
      mockUseFilteredTodos.mockReturnValue([])
      expect(() => render(<HomeScreen />)).not.toThrow()
    })

    it('should render without crashing when isLoading and error both present', () => {
      mockUseTodoStore.mockReturnValue({
        ...defaultStoreState,
        isLoading: true,
        error: 'Bir hata oluştu.',
      })
      expect(() => render(<HomeScreen />)).not.toThrow()
    })

    it('should still show FilterBar and AddTodoInput regardless of error state', () => {
      mockUseTodoStore.mockReturnValue({
        ...defaultStoreState,
        error: 'Hata var.',
      })
      render(<HomeScreen />)
      expect(screen.getByTestId('add-todo-text-input')).toBeTruthy()
      expect(screen.getByTestId('filter-all')).toBeTruthy()
    })
  })
})
