// src/components/__tests__/PriorityBadge.test.tsx
// @tdd-guide tarafından yazıldı — implementasyondan ÖNCE (RED aşaması)

import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { PriorityBadge } from '../PriorityBadge'
import { Priority } from '@/types/todo.types'

describe('PriorityBadge', () => {
  describe('render', () => {
    it('should render without crashing', () => {
      expect(() =>
        render(<PriorityBadge priority="medium" />)
      ).not.toThrow()
    })

    it('should display "Düşük" label for low priority', () => {
      render(<PriorityBadge priority="low" />)
      expect(screen.getByText('Düşük')).toBeTruthy()
    })

    it('should display "Orta" label for medium priority', () => {
      render(<PriorityBadge priority="medium" />)
      expect(screen.getByText('Orta')).toBeTruthy()
    })

    it('should display "Yüksek" label for high priority', () => {
      render(<PriorityBadge priority="high" />)
      expect(screen.getByText('Yüksek')).toBeTruthy()
    })
  })

  describe('renk konfigürasyonu', () => {
    // Badge arka plan rengi PRIORITY_CONFIG'den gelmeli
    it('should apply green background color for low priority', () => {
      render(<PriorityBadge priority="low" />)
      const badge = screen.getByTestId('priority-badge')
      // low → #4CAF50
      expect(badge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: '#4CAF50' }),
        ])
      )
    })

    it('should apply yellow background color for medium priority', () => {
      render(<PriorityBadge priority="medium" />)
      const badge = screen.getByTestId('priority-badge')
      // medium → #FFC107
      expect(badge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: '#FFC107' }),
        ])
      )
    })

    it('should apply red background color for high priority', () => {
      render(<PriorityBadge priority="high" />)
      const badge = screen.getByTestId('priority-badge')
      // high → #F44336
      expect(badge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: '#F44336' }),
        ])
      )
    })
  })

  describe('erişilebilirlik', () => {
    it('should have accessibilityLabel describing the priority', () => {
      render(<PriorityBadge priority="high" />)
      const badge = screen.getByTestId('priority-badge')
      // Ekran okuyucular için anlamlı label
      expect(badge.props.accessibilityLabel).toBe('Öncelik: Yüksek')
    })

    it('should have accessibilityLabel for low priority', () => {
      render(<PriorityBadge priority="low" />)
      const badge = screen.getByTestId('priority-badge')
      expect(badge.props.accessibilityLabel).toBe('Öncelik: Düşük')
    })
  })

  describe('edge cases', () => {
    it('should render all three priority levels without crashing', () => {
      const priorities: Priority[] = ['low', 'medium', 'high']
      priorities.forEach((priority) => {
        const { unmount } = render(<PriorityBadge priority={priority} />)
        expect(screen.getByTestId('priority-badge')).toBeTruthy()
        unmount()
      })
    })
  })
})
