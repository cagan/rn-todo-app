// src/components/__tests__/EditTodoModal.test.tsx
// @tdd-guide tarafından yazıldı — implementasyondan ÖNCE (RED aşaması)
// EditTodoModal: title + priority düzenleme, modal tabanlı UX

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react-native'
import { EditTodoModal } from '../EditTodoModal'
import { Todo, Priority } from '@/types/todo.types'

// Test verisi: düzenlenecek todo
const mockTodo: Todo = {
  id: '42',
  title: 'Mevcut Başlık',
  completed: false,
  createdAt: new Date('2024-06-01'),
  priority: 'medium',
}

// Ortak render yardımcısı — tekrar eden prop setini merkezileştirir
const renderModal = (
  overrides: Partial<{
    visible: boolean
    todo: Todo | null
    onSave: (id: string, title: string, priority: Priority, dueDate?: Date) => void
    onCancel: () => void
  }> = {}
) =>
  render(
    <EditTodoModal
      visible={overrides.visible ?? true}
      todo={overrides.todo !== undefined ? overrides.todo : mockTodo}
      onSave={overrides.onSave ?? jest.fn()}
      onCancel={overrides.onCancel ?? jest.fn()}
    />
  )

describe('EditTodoModal', () => {
  describe('render', () => {
    it('should render null when todo prop is null', () => {
      // todo null → modal hiçbir şey render etmemeli
      const { toJSON } = renderModal({ todo: null })
      expect(toJSON()).toBeNull()
    })

    it('should render TextInput prefilled with todo title', () => {
      renderModal()
      // TextInput, mevcut todo başlığını göstermeli
      expect(screen.getByDisplayValue('Mevcut Başlık')).toBeTruthy()
    })

    it('should render three priority selector buttons', () => {
      renderModal()
      // PRIORITY_CONFIG'dan gelen 3 label görünmeli
      expect(screen.getByText('Düşük')).toBeTruthy()
      expect(screen.getByText('Orta')).toBeTruthy()
      expect(screen.getByText('Yüksek')).toBeTruthy()
    })

    it('should render Kaydet button', () => {
      renderModal()
      expect(screen.getByText('Kaydet')).toBeTruthy()
    })

    it('should render İptal button', () => {
      renderModal()
      expect(screen.getByText('İptal')).toBeTruthy()
    })

    it('should show modal when visible is true', () => {
      renderModal({ visible: true })
      // Modal görünür durumdayken içerik erişilebilir olmalı
      expect(screen.getByDisplayValue('Mevcut Başlık')).toBeTruthy()
    })
  })

  describe('interactions — kaydet', () => {
    it('should call onSave with correct args when Kaydet pressed', () => {
      const onSave = jest.fn()
      renderModal({ onSave })

      // Başlığı güncelle
      fireEvent.changeText(screen.getByDisplayValue('Mevcut Başlık'), 'Yeni Başlık')
      // Priority olarak 'high' seç
      fireEvent.press(screen.getByText('Yüksek'))
      // Kaydet'e bas
      fireEvent.press(screen.getByText('Kaydet'))

      // onSave: (id, title, priority)
      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave).toHaveBeenCalledWith('42', 'Yeni Başlık', 'high', undefined)
    })

    it('should call onSave with original id and updated title when title changed', () => {
      const onSave = jest.fn()
      renderModal({ onSave })

      fireEvent.changeText(screen.getByDisplayValue('Mevcut Başlık'), 'Değiştirildi')
      fireEvent.press(screen.getByText('Kaydet'))

      // id değişmemeli
      expect(onSave).toHaveBeenCalledWith('42', 'Değiştirildi', 'medium', undefined)
    })

    it('should call onSave with current priority when no priority change made', () => {
      const onSave = jest.fn()
      renderModal({ onSave })

      // Priority seçmeden kaydet
      fireEvent.press(screen.getByText('Kaydet'))

      // Mevcut priority ('medium') korunmalı
      expect(onSave).toHaveBeenCalledWith('42', 'Mevcut Başlık', 'medium', undefined)
    })

    it('should disable Kaydet button when title is empty', () => {
      const onSave = jest.fn()
      renderModal({ onSave })

      fireEvent.changeText(screen.getByDisplayValue('Mevcut Başlık'), '')
      fireEvent.press(screen.getByText('Kaydet'))

      // Boş title → onSave çağrılmamalı (buton disabled)
      expect(onSave).not.toHaveBeenCalled()
    })

    it('should disable Kaydet button when title is whitespace only', () => {
      const onSave = jest.fn()
      renderModal({ onSave })

      fireEvent.changeText(screen.getByDisplayValue('Mevcut Başlık'), '   ')
      fireEvent.press(screen.getByText('Kaydet'))

      expect(onSave).not.toHaveBeenCalled()
    })

    it('should not call onSave when Kaydet is pressed with empty title', () => {
      const onSave = jest.fn()
      renderModal({ onSave })

      fireEvent.changeText(screen.getByDisplayValue('Mevcut Başlık'), '')
      fireEvent.press(screen.getByText('Kaydet'))

      // Boş title ile onSave çağrılmamalı
      expect(onSave).not.toHaveBeenCalled()
    })
  })

  describe('interactions — iptal', () => {
    it('should call onCancel when İptal pressed', () => {
      const onCancel = jest.fn()
      renderModal({ onCancel })

      fireEvent.press(screen.getByText('İptal'))

      expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('should not call onSave when İptal pressed', () => {
      const onSave = jest.fn()
      renderModal({ onSave })

      fireEvent.press(screen.getByText('İptal'))

      expect(onSave).not.toHaveBeenCalled()
    })
  })

  describe('interactions — priority selector', () => {
    it('should update selected priority to low when Düşük pressed', () => {
      const onSave = jest.fn()
      renderModal({ onSave })

      fireEvent.press(screen.getByText('Düşük'))
      fireEvent.press(screen.getByText('Kaydet'))

      expect(onSave).toHaveBeenCalledWith('42', 'Mevcut Başlık', 'low', undefined)
    })

    it('should update selected priority to high when Yüksek pressed', () => {
      const onSave = jest.fn()
      renderModal({ onSave })

      fireEvent.press(screen.getByText('Yüksek'))
      fireEvent.press(screen.getByText('Kaydet'))

      expect(onSave).toHaveBeenCalledWith('42', 'Mevcut Başlık', 'high', undefined)
    })

    it('should keep medium priority when Orta pressed then saved', () => {
      const onSave = jest.fn()
      // Todo zaten 'medium' — Orta'ya tekrar basınca değişmemeli
      renderModal({ onSave })

      fireEvent.press(screen.getByText('Orta'))
      fireEvent.press(screen.getByText('Kaydet'))

      expect(onSave).toHaveBeenCalledWith('42', 'Mevcut Başlık', 'medium', undefined)
    })
  })

  describe('edge cases', () => {
    it('should reset local state when todo prop changes', () => {
      // Farklı bir todo ile re-render yapıldığında local state resetlenmeli
      const { rerender } = renderModal({ todo: mockTodo })

      // Önce başlığı değiştir
      fireEvent.changeText(screen.getByDisplayValue('Mevcut Başlık'), 'Geçici Değişiklik')

      const newTodo: Todo = {
        ...mockTodo,
        id: '99',
        title: 'Farklı Todo',
        priority: 'high',
      }

      // Farklı todo ile yeniden render
      rerender(
        <EditTodoModal
          visible={true}
          todo={newTodo}
          onSave={jest.fn()}
          onCancel={jest.fn()}
        />
      )

      // Local state reset olmalı — yeni todo'nun başlığı görünmeli
      expect(screen.getByDisplayValue('Farklı Todo')).toBeTruthy()
    })

    it('should handle todo with high priority as initial state', () => {
      const onSave = jest.fn()
      const highPriorityTodo: Todo = { ...mockTodo, priority: 'high' }
      renderModal({ todo: highPriorityTodo, onSave })

      // Priority değiştirmeden kaydet → high korunmalı
      fireEvent.press(screen.getByText('Kaydet'))

      expect(onSave).toHaveBeenCalledWith('42', 'Mevcut Başlık', 'high', undefined)
    })

    it('should handle todo with very long title without crashing', () => {
      const longTitleTodo: Todo = { ...mockTodo, title: 'B'.repeat(300) }
      expect(() => renderModal({ todo: longTitleTodo })).not.toThrow()
    })
  })
})
