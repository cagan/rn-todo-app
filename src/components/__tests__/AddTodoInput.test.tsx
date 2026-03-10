// src/components/__tests__/AddTodoInput.test.tsx
// @tdd-guide tarafından yazıldı — implementasyondan ÖNCE (RED aşaması)
// AddTodoInput: metin girişi ve submit — onAdd callback ile entegrasyon

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react-native'
import { AddTodoInput } from '../AddTodoInput'

// Ortak render yardımcısı
const renderInput = (onAdd: jest.Mock = jest.fn()) =>
  render(<AddTodoInput onAdd={onAdd} />)

describe('AddTodoInput', () => {
  describe('render', () => {
    it('should render TextInput', () => {
      renderInput()
      expect(screen.getByTestId('add-todo-text-input')).toBeTruthy()
    })

    it('should render submit button', () => {
      renderInput()
      expect(screen.getByTestId('add-todo-submit-button')).toBeTruthy()
    })

    it('should render TextInput with empty initial value', () => {
      renderInput()
      expect(screen.getByDisplayValue('')).toBeTruthy()
    })
  })

  describe('buton disabled durumu', () => {
    it('should have submit button disabled when input is empty', () => {
      renderInput()
      const button = screen.getByTestId('add-todo-submit-button')
      expect(button.props.accessibilityState?.disabled).toBe(true)
    })

    it('should have submit button disabled when input contains only whitespace', () => {
      renderInput()
      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), '   ')
      const button = screen.getByTestId('add-todo-submit-button')
      expect(button.props.accessibilityState?.disabled).toBe(true)
    })

    it('should have submit button disabled when input contains only tab characters', () => {
      renderInput()
      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), '\t\t\t')
      const button = screen.getByTestId('add-todo-submit-button')
      expect(button.props.accessibilityState?.disabled).toBe(true)
    })

    it('should have submit button enabled when input has valid text', () => {
      renderInput()
      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), 'Yeni Todo')
      const button = screen.getByTestId('add-todo-submit-button')
      expect(button.props.accessibilityState?.disabled).not.toBe(true)
    })

    it('should have submit button enabled when input has single character', () => {
      renderInput()
      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), 'a')
      const button = screen.getByTestId('add-todo-submit-button')
      expect(button.props.accessibilityState?.disabled).not.toBe(true)
    })
  })

  describe('interactions — submit butonu', () => {
    it('should call onAdd with trimmed title when submit button pressed', () => {
      const onAdd = jest.fn()
      renderInput(onAdd)

      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), 'Alışveriş Yap')
      fireEvent.press(screen.getByTestId('add-todo-submit-button'))

      expect(onAdd).toHaveBeenCalledTimes(1)
      expect(onAdd).toHaveBeenCalledWith('Alışveriş Yap')
    })

    it('should call onAdd with trimmed title when input has surrounding whitespace', () => {
      const onAdd = jest.fn()
      renderInput(onAdd)

      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), '  Başlık  ')
      fireEvent.press(screen.getByTestId('add-todo-submit-button'))

      expect(onAdd).toHaveBeenCalledWith('Başlık')
    })

    it('should NOT call onAdd when submit button pressed with empty input', () => {
      const onAdd = jest.fn()
      renderInput(onAdd)

      fireEvent.press(screen.getByTestId('add-todo-submit-button'))

      expect(onAdd).not.toHaveBeenCalled()
    })

    it('should NOT call onAdd when submit button pressed with whitespace-only input', () => {
      const onAdd = jest.fn()
      renderInput(onAdd)

      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), '   ')
      fireEvent.press(screen.getByTestId('add-todo-submit-button'))

      expect(onAdd).not.toHaveBeenCalled()
    })

    it('should clear input after successful submit', () => {
      const onAdd = jest.fn()
      renderInput(onAdd)

      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), 'Temizlenecek')
      fireEvent.press(screen.getByTestId('add-todo-submit-button'))

      expect(screen.getByDisplayValue('')).toBeTruthy()
    })

    it('should disable submit button again after clearing input on submit', () => {
      const onAdd = jest.fn()
      renderInput(onAdd)

      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), 'Submit Sonrası')
      fireEvent.press(screen.getByTestId('add-todo-submit-button'))

      const button = screen.getByTestId('add-todo-submit-button')
      expect(button.props.accessibilityState?.disabled).toBe(true)
    })
  })

  describe('interactions — keyboard submit (onSubmitEditing)', () => {
    it('should call onAdd when onSubmitEditing fired with valid input', () => {
      const onAdd = jest.fn()
      renderInput(onAdd)

      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), 'Klavye ile Submit')
      fireEvent(screen.getByTestId('add-todo-text-input'), 'submitEditing')

      expect(onAdd).toHaveBeenCalledTimes(1)
      expect(onAdd).toHaveBeenCalledWith('Klavye ile Submit')
    })

    it('should NOT call onAdd when onSubmitEditing fired with empty input', () => {
      const onAdd = jest.fn()
      renderInput(onAdd)

      fireEvent(screen.getByTestId('add-todo-text-input'), 'submitEditing')

      expect(onAdd).not.toHaveBeenCalled()
    })

    it('should clear input after onSubmitEditing with valid text', () => {
      const onAdd = jest.fn()
      renderInput(onAdd)

      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), 'Klavye Temizle')
      fireEvent(screen.getByTestId('add-todo-text-input'), 'submitEditing')

      expect(screen.getByDisplayValue('')).toBeTruthy()
    })

    it('should call onAdd with trimmed value via onSubmitEditing', () => {
      const onAdd = jest.fn()
      renderInput(onAdd)

      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), '  Trim Test  ')
      fireEvent(screen.getByTestId('add-todo-text-input'), 'submitEditing')

      expect(onAdd).toHaveBeenCalledWith('Trim Test')
    })
  })

  describe('edge cases', () => {
    it('should handle very long input without crashing', () => {
      renderInput()
      expect(() =>
        fireEvent.changeText(screen.getByTestId('add-todo-text-input'), 'A'.repeat(500))
      ).not.toThrow()
    })

    it('should handle special characters in input', () => {
      const onAdd = jest.fn()
      renderInput(onAdd)

      const specialText = '🎯 <script>alert(1)</script> & "quoted"'
      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), specialText)
      fireEvent.press(screen.getByTestId('add-todo-submit-button'))

      expect(onAdd).toHaveBeenCalledWith(specialText)
    })

    it('should allow adding multiple todos sequentially', () => {
      const onAdd = jest.fn()
      renderInput(onAdd)

      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), 'Birinci')
      fireEvent.press(screen.getByTestId('add-todo-submit-button'))

      fireEvent.changeText(screen.getByTestId('add-todo-text-input'), 'İkinci')
      fireEvent.press(screen.getByTestId('add-todo-submit-button'))

      expect(onAdd).toHaveBeenCalledTimes(2)
      expect(onAdd).toHaveBeenNthCalledWith(1, 'Birinci')
      expect(onAdd).toHaveBeenNthCalledWith(2, 'İkinci')
    })
  })
})
