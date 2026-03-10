import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react-native'
import { PrioritySelector } from '../PrioritySelector'
import { Priority } from '@/types/todo.types'

describe('PrioritySelector', () => {
  it('should render all three priority options', () => {
    render(<PrioritySelector selected="medium" onSelect={jest.fn()} />)
    expect(screen.getByText('Düşük')).toBeTruthy()
    expect(screen.getByText('Orta')).toBeTruthy()
    expect(screen.getByText('Yüksek')).toBeTruthy()
  })

  it('should call onSelect with "low" when Düşük pressed', () => {
    const onSelect = jest.fn()
    render(<PrioritySelector selected="medium" onSelect={onSelect} />)
    fireEvent.press(screen.getByText('Düşük'))
    expect(onSelect).toHaveBeenCalledWith('low')
  })

  it('should call onSelect with "high" when Yüksek pressed', () => {
    const onSelect = jest.fn()
    render(<PrioritySelector selected="medium" onSelect={onSelect} />)
    fireEvent.press(screen.getByText('Yüksek'))
    expect(onSelect).toHaveBeenCalledWith('high')
  })

  it('should call onSelect with "medium" when Orta pressed', () => {
    const onSelect = jest.fn()
    render(<PrioritySelector selected="low" onSelect={onSelect} />)
    fireEvent.press(screen.getByText('Orta'))
    expect(onSelect).toHaveBeenCalledWith('medium')
  })

  it('should render without crashing for all priority values', () => {
    const priorities: Priority[] = ['low', 'medium', 'high']
    priorities.forEach((p) => {
      const { unmount } = render(<PrioritySelector selected={p} onSelect={jest.fn()} />)
      expect(screen.getByText('Düşük')).toBeTruthy()
      unmount()
    })
  })
})
