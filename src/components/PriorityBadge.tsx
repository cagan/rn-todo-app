import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Priority, PRIORITY_CONFIG } from '@/types/todo.types'

interface PriorityBadgeProps {
  priority: Priority
}

export const PriorityBadge = memo(({ priority }: PriorityBadgeProps) => {
  const config = PRIORITY_CONFIG[priority]

  return (
    <View
      testID="priority-badge"
      accessibilityLabel={`Öncelik: ${config.label}`}
      style={[styles.badge, { backgroundColor: config.color }]}
    >
      <Text style={styles.label}>{config.label}</Text>
    </View>
  )
})

PriorityBadge.displayName = 'PriorityBadge'

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
})
