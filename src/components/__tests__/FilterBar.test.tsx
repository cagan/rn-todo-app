// src/components/__tests__/FilterBar.test.tsx
// @tdd-guide tarafından yazıldı — implementasyondan ÖNCE (RED aşaması)
// FilterBar: all / active / completed filtre butonları

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react-native'
import { FilterBar } from '../FilterBar'
import { FilterType } from '@/types/todo.types'

// Ortak render yardımcısı
const renderFilterBar = (
  currentFilter: FilterType = 'all',
  onFilterChange: jest.Mock = jest.fn()
) =>
  render(<FilterBar currentFilter={currentFilter} onFilterChange={onFilterChange} />)

describe('FilterBar', () => {
  describe('render', () => {
    it('should render three filter buttons', () => {
      renderFilterBar()
      expect(screen.getByText('Tümü')).toBeTruthy()
      expect(screen.getByText('Aktif')).toBeTruthy()
      expect(screen.getByText('Tamamlandı')).toBeTruthy()
    })

    it('should render Tümü button with testID filter-all', () => {
      renderFilterBar()
      expect(screen.getByTestId('filter-all')).toBeTruthy()
    })

    it('should render Aktif button with testID filter-active', () => {
      renderFilterBar()
      expect(screen.getByTestId('filter-active')).toBeTruthy()
    })

    it('should render Tamamlandı button with testID filter-completed', () => {
      renderFilterBar()
      expect(screen.getByTestId('filter-completed')).toBeTruthy()
    })
  })

  describe('aktif buton vurgusu', () => {
    it('should mark filter-all button as selected when currentFilter is "all"', () => {
      renderFilterBar('all')
      const button = screen.getByTestId('filter-all')
      expect(button.props.accessibilityState?.selected).toBe(true)
    })

    it('should mark filter-active button as selected when currentFilter is "active"', () => {
      renderFilterBar('active')
      const button = screen.getByTestId('filter-active')
      expect(button.props.accessibilityState?.selected).toBe(true)
    })

    it('should mark filter-completed button as selected when currentFilter is "completed"', () => {
      renderFilterBar('completed')
      const button = screen.getByTestId('filter-completed')
      expect(button.props.accessibilityState?.selected).toBe(true)
    })

    it('should NOT mark filter-active as selected when currentFilter is "all"', () => {
      renderFilterBar('all')
      const button = screen.getByTestId('filter-active')
      expect(button.props.accessibilityState?.selected).not.toBe(true)
    })

    it('should NOT mark filter-completed as selected when currentFilter is "active"', () => {
      renderFilterBar('active')
      const button = screen.getByTestId('filter-completed')
      expect(button.props.accessibilityState?.selected).not.toBe(true)
    })
  })

  describe('interactions', () => {
    it('should call onFilterChange with "all" when Tümü pressed', () => {
      const onFilterChange = jest.fn()
      renderFilterBar('active', onFilterChange)

      fireEvent.press(screen.getByTestId('filter-all'))

      expect(onFilterChange).toHaveBeenCalledTimes(1)
      expect(onFilterChange).toHaveBeenCalledWith('all')
    })

    it('should call onFilterChange with "active" when Aktif pressed', () => {
      const onFilterChange = jest.fn()
      renderFilterBar('all', onFilterChange)

      fireEvent.press(screen.getByTestId('filter-active'))

      expect(onFilterChange).toHaveBeenCalledTimes(1)
      expect(onFilterChange).toHaveBeenCalledWith('active')
    })

    it('should call onFilterChange with "completed" when Tamamlandı pressed', () => {
      const onFilterChange = jest.fn()
      renderFilterBar('all', onFilterChange)

      fireEvent.press(screen.getByTestId('filter-completed'))

      expect(onFilterChange).toHaveBeenCalledTimes(1)
      expect(onFilterChange).toHaveBeenCalledWith('completed')
    })

    it('should call onFilterChange only once per press', () => {
      const onFilterChange = jest.fn()
      renderFilterBar('all', onFilterChange)

      fireEvent.press(screen.getByTestId('filter-active'))

      expect(onFilterChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    it('should not throw when pressing already-active filter', () => {
      const onFilterChange = jest.fn()
      renderFilterBar('all', onFilterChange)

      expect(() => fireEvent.press(screen.getByTestId('filter-all'))).not.toThrow()
      // onFilterChange yine de çağrılmalı
      expect(onFilterChange).toHaveBeenCalledWith('all')
    })

    it('should render without crashing when re-rendered with different currentFilter', () => {
      const { rerender } = renderFilterBar('all')

      expect(() =>
        rerender(
          <FilterBar currentFilter="completed" onFilterChange={jest.fn()} />
        )
      ).not.toThrow()

      const button = screen.getByTestId('filter-completed')
      expect(button.props.accessibilityState?.selected).toBe(true)
    })
  })
})
