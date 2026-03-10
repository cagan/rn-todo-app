import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface DueDateBadgeProps {
  dueDate: Date | undefined
  completed: boolean
}

type DueDateStatus = 'overdue' | 'today' | 'tomorrow' | 'upcoming'

const MONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

const STATUS_COLORS: Record<DueDateStatus, { bg: string; text: string }> = {
  overdue: { bg: '#FF3B30', text: '#fff' },
  today: { bg: '#FFC107', text: '#1a1a1a' },
  tomorrow: { bg: '#FF9500', text: '#fff' },
  upcoming: { bg: '#E5E5EA', text: '#666' },
}

const normalizeDate = (d: Date): number =>
  Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())

const getStatus = (dueDate: Date, completed: boolean): DueDateStatus => {
  if (completed) return 'upcoming'

  const now = normalizeDate(new Date())
  const due = normalizeDate(dueDate)
  const diff = due - now
  const oneDay = 86400000

  if (diff < 0) return 'overdue'
  if (diff === 0) return 'today'
  if (diff <= oneDay) return 'tomorrow'
  return 'upcoming'
}

const getLabel = (status: DueDateStatus, dueDate: Date): string => {
  if (status === 'overdue') return 'Gecikti'
  if (status === 'today') return 'Bugün'
  if (status === 'tomorrow') return 'Yarın'
  return `${dueDate.getUTCDate()} ${MONTHS_TR[dueDate.getUTCMonth()]}`
}

export const DueDateBadge = memo(({ dueDate, completed }: DueDateBadgeProps) => {
  if (!dueDate) return null

  const status = getStatus(dueDate, completed)
  const colors = STATUS_COLORS[status]
  const label = getLabel(status, dueDate)

  return (
    <View testID="due-date-badge" style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  )
})

DueDateBadge.displayName = 'DueDateBadge'

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
})
