// src/components/__tests__/TodoItem.test.tsx
// @tdd-guide tarafından yazıldı — implementasyondan ÖNCE
// Priority feature eklendi — RED aşaması
// onEdit prop (edit butonu) testleri eklendi — RED aşaması
// dueDate + DueDateBadge entegrasyonu eklendi — RED aşaması

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react-native'
import { TodoItem } from '../TodoItem'
import { Todo } from '@/types/todo.types'

// Priority alanı zorunlu hale getirildi — dueDate opsiyonel (mevcut testler kırılmaz)
const mockTodo: Todo = {
  id: '1',
  title: 'Test Todo',
  completed: false,
  createdAt: new Date('2024-01-01'),
  priority: 'medium',
  // dueDate yok — mevcut testler etkilenmez
}

const completedTodo: Todo = {
  ...mockTodo,
  completed: true,
}

describe('TodoItem', () => {
  describe('render', () => {
    it('should display todo title', () => {
      render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      expect(screen.getByText('Test Todo')).toBeTruthy()
    })

    it('should show unchecked state for incomplete todo', () => {
      render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox.props.accessibilityState.checked).toBe(false)
    })

    it('should show checked state for completed todo', () => {
      render(<TodoItem todo={completedTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox.props.accessibilityState.checked).toBe(true)
    })

    it('should show delete button', () => {
      render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      expect(screen.getByLabelText('Test Todo sil')).toBeTruthy()
    })

    // Priority badge render testleri
    it('should render PriorityBadge component', () => {
      render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      // PriorityBadge 'medium' label'ını göstermeli
      expect(screen.getByText('Orta')).toBeTruthy()
    })

    it('should render PriorityBadge with correct label for high priority', () => {
      const highPriorityTodo: Todo = { ...mockTodo, priority: 'high' }
      render(<TodoItem todo={highPriorityTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      expect(screen.getByText('Yüksek')).toBeTruthy()
    })

    it('should render PriorityBadge with correct label for low priority', () => {
      const lowPriorityTodo: Todo = { ...mockTodo, priority: 'low' }
      render(<TodoItem todo={lowPriorityTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      expect(screen.getByText('Düşük')).toBeTruthy()
    })

    // Edit butonu render testi
    it('should show edit button with correct accessibilityLabel', () => {
      render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      // accessibilityLabel blueprint'e göre: "${todo.title} düzenle"
      expect(screen.getByLabelText('Test Todo düzenle')).toBeTruthy()
    })
  })

  describe('priority border rengi', () => {
    it('should apply green left border for low priority', () => {
      const lowPriorityTodo: Todo = { ...mockTodo, priority: 'low' }
      render(<TodoItem todo={lowPriorityTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      // Sol border rengi low priority için #4CAF50 olmalı
      const container = screen.getByTestId('todo-item-container')
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ borderLeftColor: '#4CAF50' }),
        ])
      )
    })

    it('should apply yellow left border for medium priority', () => {
      render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      // Sol border rengi medium priority için #FFC107 olmalı
      const container = screen.getByTestId('todo-item-container')
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ borderLeftColor: '#FFC107' }),
        ])
      )
    })

    it('should apply red left border for high priority', () => {
      const highPriorityTodo: Todo = { ...mockTodo, priority: 'high' }
      render(<TodoItem todo={highPriorityTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      // Sol border rengi high priority için #F44336 olmalı
      const container = screen.getByTestId('todo-item-container')
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ borderLeftColor: '#F44336' }),
        ])
      )
    })
  })

  describe('interactions', () => {
    it('should call onToggle with todo id when checkbox pressed', () => {
      const onToggle = jest.fn()
      render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={jest.fn()} onEdit={jest.fn()} />)

      fireEvent.press(screen.getByRole('checkbox'))
      expect(onToggle).toHaveBeenCalledTimes(1)
      expect(onToggle).toHaveBeenCalledWith('1')
    })

    it('should call onDelete with todo id when delete pressed', () => {
      const onDelete = jest.fn()
      render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={onDelete} onEdit={jest.fn()} />)

      fireEvent.press(screen.getByLabelText('Test Todo sil'))
      expect(onDelete).toHaveBeenCalledTimes(1)
      expect(onDelete).toHaveBeenCalledWith('1')
    })

    it('should not call onToggle multiple times from single press', () => {
      const onToggle = jest.fn()
      render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={jest.fn()} onEdit={jest.fn()} />)

      fireEvent.press(screen.getByRole('checkbox'))
      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    // onEdit interaction testleri
    it('should call onEdit with todo id when edit button pressed', () => {
      const onEdit = jest.fn()
      render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={onEdit} />)

      fireEvent.press(screen.getByLabelText('Test Todo düzenle'))
      // onEdit doğru id ile çağrılmalı
      expect(onEdit).toHaveBeenCalledTimes(1)
      expect(onEdit).toHaveBeenCalledWith('1')
    })

    it('should not call onEdit when delete button pressed', () => {
      const onEdit = jest.fn()
      render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={onEdit} />)

      fireEvent.press(screen.getByLabelText('Test Todo sil'))
      // Sil butonuna basınca onEdit tetiklenmemeli
      expect(onEdit).not.toHaveBeenCalled()
    })

    it('should not call onDelete when edit button pressed', () => {
      const onDelete = jest.fn()
      render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={onDelete} onEdit={jest.fn()} />)

      fireEvent.press(screen.getByLabelText('Test Todo düzenle'))
      // Düzenle butonuna basınca onDelete tetiklenmemeli
      expect(onDelete).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle very long titles without crashing', () => {
      const longTitleTodo = {
        ...mockTodo,
        title: 'A'.repeat(500),
      }
      expect(() =>
        render(<TodoItem todo={longTitleTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      ).not.toThrow()
    })

    it('should handle special characters in title', () => {
      const specialTodo = { ...mockTodo, title: '🎯 Özel karakterler & <html>' }
      render(<TodoItem todo={specialTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      expect(screen.getByText('🎯 Özel karakterler & <html>')).toBeTruthy()
    })

    // Priority alanı her zaman zorunlu — default 'medium' store seviyesinde atanır
    // Bu test, component'in her 3 priority değerini de doğru render ettiğini garanti eder
    it('should render correctly for all priority levels', () => {
      const priorities: Array<Todo['priority']> = ['low', 'medium', 'high']
      priorities.forEach((priority) => {
        const { unmount } = render(
          <TodoItem todo={{ ...mockTodo, priority }} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />
        )
        expect(screen.getByText('Test Todo')).toBeTruthy()
        unmount()
      })
    })

    // accessibilityLabel'ın todo title'ı ile dinamik olarak güncellendiğini doğrula
    it('should use correct todo title in edit button accessibilityLabel', () => {
      const differentTodo: Todo = { ...mockTodo, id: '99', title: 'Alışveriş Yap' }
      render(<TodoItem todo={differentTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      // Label, todo title'ını yansıtmalı
      expect(screen.getByLabelText('Alışveriş Yap düzenle')).toBeTruthy()
    })
  })

  // -------------------------------------------------------------------------
  // DueDateBadge entegrasyonu — due date feature (RED aşaması)
  // -------------------------------------------------------------------------
  describe('due date — DueDateBadge entegrasyonu', () => {
    // Tarih bağımsız testler için sabit sistem saati — bu describe bloğuna özel
    const FIXED_NOW = new Date('2026-03-10T12:00:00.000Z')

    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(FIXED_NOW)
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should NOT render DueDateBadge when dueDate is undefined', () => {
      // dueDate olmayan todo → badge hiç görünmemeli
      render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      expect(screen.queryByTestId('due-date-badge')).toBeNull()
    })

    it('should render DueDateBadge when todo has a dueDate', () => {
      // dueDate olan todo → badge görünmeli
      const todoWithDueDate: Todo = {
        ...mockTodo,
        dueDate: new Date('2026-03-15T00:00:00.000Z'),
      }
      render(<TodoItem todo={todoWithDueDate} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      expect(screen.getByTestId('due-date-badge')).toBeTruthy()
    })

    it('should render DueDateBadge with "Gecikti" for overdue incomplete todo', () => {
      const overdueTodo: Todo = {
        ...mockTodo,
        completed: false,
        dueDate: new Date('2026-03-09T00:00:00.000Z'), // dün
      }
      render(<TodoItem todo={overdueTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      expect(screen.getByText('Gecikti')).toBeTruthy()
    })

    it('should render DueDateBadge with "Bugün" for today due date', () => {
      const todayTodo: Todo = {
        ...mockTodo,
        dueDate: new Date('2026-03-10T00:00:00.000Z'), // bugün
      }
      render(<TodoItem todo={todayTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      expect(screen.getByText('Bugün')).toBeTruthy()
    })

    it('should pass completed prop correctly to DueDateBadge', () => {
      // Tamamlanmış overdue todo → kırmızı değil, gri badge
      const completedOverdue: Todo = {
        ...mockTodo,
        completed: true,
        dueDate: new Date('2026-03-09T00:00:00.000Z'), // dün
      }
      render(<TodoItem todo={completedOverdue} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      // Badge render edilmeli ama "Gecikti" etiketi olmamalı
      expect(screen.getByTestId('due-date-badge')).toBeTruthy()
      expect(screen.queryByText('Gecikti')).toBeNull()
    })

    it('should still render all existing elements alongside DueDateBadge', () => {
      // Badge eklenmesi mevcut elemanları kırmamalı
      const todoWithDueDate: Todo = {
        ...mockTodo,
        dueDate: new Date('2026-03-15T00:00:00.000Z'),
      }
      render(<TodoItem todo={todoWithDueDate} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />)
      // Mevcut elementler hâlâ var olmalı
      expect(screen.getByText('Test Todo')).toBeTruthy()
      expect(screen.getByRole('checkbox')).toBeTruthy()
      expect(screen.getByLabelText('Test Todo sil')).toBeTruthy()
      expect(screen.getByLabelText('Test Todo düzenle')).toBeTruthy()
      // Badge de render edilmeli
      expect(screen.getByTestId('due-date-badge')).toBeTruthy()
    })
  })
})
