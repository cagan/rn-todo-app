// src/components/__tests__/DueDateBadge.test.tsx
// @tdd-guide tarafından yazıldı — implementasyondan ÖNCE (RED aşaması)
// DueDateBadge: due date görsel göstergesi — overdue, today, tomorrow, upcoming, null

import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { DueDateBadge } from '../DueDateBadge'

// Tarih bağımsız testler için sabit bir "bugün" kullanıyoruz
// 2026-03-10 Salı — blueprint test tarihi
const FIXED_NOW = new Date('2026-03-10T12:00:00.000Z')

// Yardımcı: gün offsetiyle tarih üretir (UTC gece yarısı)
const dayOffset = (offset: number): Date => {
  const d = new Date(FIXED_NOW)
  d.setUTCDate(d.getUTCDate() + offset)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

describe('DueDateBadge', () => {
  // Her testten önce/sonra sistem saatini kontrol et
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(FIXED_NOW)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  // -----------------------------------------------------------------------
  describe('render — dueDate yok', () => {
    it('should render null when dueDate is undefined', () => {
      // dueDate yoksa badge hiç render edilmemeli
      const { toJSON } = render(<DueDateBadge dueDate={undefined} completed={false} />)
      expect(toJSON()).toBeNull()
    })

    it('should render null when dueDate is undefined and todo is completed', () => {
      const { toJSON } = render(<DueDateBadge dueDate={undefined} completed={true} />)
      expect(toJSON()).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  describe('render — overdue (gecikmiş)', () => {
    it('should display "Gecikti" label for past due date on incomplete todo', () => {
      // Dün geçmiş, tamamlanmamış → overdue
      const yesterday = dayOffset(-1)
      render(<DueDateBadge dueDate={yesterday} completed={false} />)
      expect(screen.getByText('Gecikti')).toBeTruthy()
    })

    it('should display "Gecikti" label for date far in the past', () => {
      const weekAgo = dayOffset(-7)
      render(<DueDateBadge dueDate={weekAgo} completed={false} />)
      expect(screen.getByText('Gecikti')).toBeTruthy()
    })

    it('should apply red color (#FF3B30) for overdue badge', () => {
      const yesterday = dayOffset(-1)
      render(<DueDateBadge dueDate={yesterday} completed={false} />)
      const badge = screen.getByTestId('due-date-badge')
      // Stil içinde kırmızı renk bulunmalı
      const flatStyle = Array.isArray(badge.props.style)
        ? Object.assign({}, ...badge.props.style)
        : badge.props.style
      expect(flatStyle.backgroundColor).toBe('#FF3B30')
    })

    it('should NOT show "Gecikti" for overdue but completed todo (tamamlanan gecikmiş)', () => {
      // Geçmiş tarih ama tamamlandı → overdue kırmızı gösterilmemeli
      const yesterday = dayOffset(-1)
      render(<DueDateBadge dueDate={yesterday} completed={true} />)
      expect(screen.queryByText('Gecikti')).toBeNull()
    })

    it('should show grey color for completed todo even if overdue', () => {
      const yesterday = dayOffset(-1)
      render(<DueDateBadge dueDate={yesterday} completed={true} />)
      const badge = screen.getByTestId('due-date-badge')
      const flatStyle = Array.isArray(badge.props.style)
        ? Object.assign({}, ...badge.props.style)
        : badge.props.style
      // Tamamlanan todo → kırmızı değil, gri (#E5E5EA) olmalı
      expect(flatStyle.backgroundColor).toBe('#E5E5EA')
    })
  })

  // -----------------------------------------------------------------------
  describe('render — today (bugün)', () => {
    it('should display "Bugün" label when dueDate is today', () => {
      // Bugün gece yarısı (UTC 00:00)
      const today = dayOffset(0)
      render(<DueDateBadge dueDate={today} completed={false} />)
      expect(screen.getByText('Bugün')).toBeTruthy()
    })

    it('should apply yellow color (#FFC107) for today badge', () => {
      const today = dayOffset(0)
      render(<DueDateBadge dueDate={today} completed={false} />)
      const badge = screen.getByTestId('due-date-badge')
      const flatStyle = Array.isArray(badge.props.style)
        ? Object.assign({}, ...badge.props.style)
        : badge.props.style
      expect(flatStyle.backgroundColor).toBe('#FFC107')
    })

    it('should show testID "due-date-badge" for today badge', () => {
      const today = dayOffset(0)
      render(<DueDateBadge dueDate={today} completed={false} />)
      expect(screen.getByTestId('due-date-badge')).toBeTruthy()
    })
  })

  // -----------------------------------------------------------------------
  describe('render — tomorrow (yarın)', () => {
    it('should display "Yarın" label when dueDate is tomorrow', () => {
      const tomorrow = dayOffset(1)
      render(<DueDateBadge dueDate={tomorrow} completed={false} />)
      expect(screen.getByText('Yarın')).toBeTruthy()
    })

    it('should apply orange color (#FF9500) for tomorrow badge', () => {
      const tomorrow = dayOffset(1)
      render(<DueDateBadge dueDate={tomorrow} completed={false} />)
      const badge = screen.getByTestId('due-date-badge')
      const flatStyle = Array.isArray(badge.props.style)
        ? Object.assign({}, ...badge.props.style)
        : badge.props.style
      expect(flatStyle.backgroundColor).toBe('#FF9500')
    })
  })

  // -----------------------------------------------------------------------
  describe('render — upcoming (yaklaşan)', () => {
    it('should display short date label for upcoming dates (> 1 gün sonra)', () => {
      // 5 gün sonra — "15 Mar" formatında kısa tarih
      const fiveDaysLater = dayOffset(5)
      render(<DueDateBadge dueDate={fiveDaysLater} completed={false} />)
      const badge = screen.getByTestId('due-date-badge')
      // "Gecikti", "Bugün", "Yarın" etiketleri olmamalı
      expect(screen.queryByText('Gecikti')).toBeNull()
      expect(screen.queryByText('Bugün')).toBeNull()
      expect(screen.queryByText('Yarın')).toBeNull()
      // Badge render edilmeli
      expect(badge).toBeTruthy()
    })

    it('should apply grey color (#E5E5EA) for upcoming badge', () => {
      const fiveDaysLater = dayOffset(5)
      render(<DueDateBadge dueDate={fiveDaysLater} completed={false} />)
      const badge = screen.getByTestId('due-date-badge')
      const flatStyle = Array.isArray(badge.props.style)
        ? Object.assign({}, ...badge.props.style)
        : badge.props.style
      expect(flatStyle.backgroundColor).toBe('#E5E5EA')
    })

    it('should show short date like "15 Mar" for upcoming date', () => {
      // 2026-03-15 → "15 Mar"
      const march15 = new Date('2026-03-15T00:00:00.000Z')
      render(<DueDateBadge dueDate={march15} completed={false} />)
      // Kısa tarih formatında bir metin görünmeli
      expect(screen.getByTestId('due-date-badge')).toBeTruthy()
      // Label "Gecikti"/"Bugün"/"Yarın" değil, tarih string'i olmalı
      expect(screen.queryByText('Gecikti')).toBeNull()
      expect(screen.queryByText('Bugün')).toBeNull()
      expect(screen.queryByText('Yarın')).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  describe('edge cases', () => {
    it('should use testID "due-date-badge" on the root element', () => {
      // Her durumda testID sabit kalmalı
      const tomorrow = dayOffset(1)
      render(<DueDateBadge dueDate={tomorrow} completed={false} />)
      expect(screen.getByTestId('due-date-badge')).toBeTruthy()
    })

    it('should not crash when dueDate is exactly midnight of today', () => {
      // Tam gece yarısı eşik değeri
      const todayMidnight = new Date('2026-03-10T00:00:00.000Z')
      expect(() =>
        render(<DueDateBadge dueDate={todayMidnight} completed={false} />)
      ).not.toThrow()
    })

    it('should handle far future dates without crashing', () => {
      const farFuture = new Date('2099-12-31T00:00:00.000Z')
      expect(() =>
        render(<DueDateBadge dueDate={farFuture} completed={false} />)
      ).not.toThrow()
    })

    it('should render grey for completed todo with today due date', () => {
      // Bugün bitişli ama tamamlanmış → gri
      const today = dayOffset(0)
      render(<DueDateBadge dueDate={today} completed={true} />)
      const badge = screen.getByTestId('due-date-badge')
      const flatStyle = Array.isArray(badge.props.style)
        ? Object.assign({}, ...badge.props.style)
        : badge.props.style
      expect(flatStyle.backgroundColor).toBe('#E5E5EA')
    })

    it('should render grey for completed todo with tomorrow due date', () => {
      const tomorrow = dayOffset(1)
      render(<DueDateBadge dueDate={tomorrow} completed={true} />)
      const badge = screen.getByTestId('due-date-badge')
      const flatStyle = Array.isArray(badge.props.style)
        ? Object.assign({}, ...badge.props.style)
        : badge.props.style
      // Tamamlanan todo → renk ne olursa olsun gri
      expect(flatStyle.backgroundColor).toBe('#E5E5EA')
    })
  })
})
