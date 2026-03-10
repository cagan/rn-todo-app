import React, { memo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Priority, PRIORITY_CONFIG } from '@/types/todo.types'

interface PrioritySelectorProps {
  selected: Priority
  onSelect: (priority: Priority) => void
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high']

export const PrioritySelector = memo(({ selected, onSelect }: PrioritySelectorProps) => (
  <View style={styles.row}>
    {PRIORITIES.map((p) => {
      const config = PRIORITY_CONFIG[p]
      const isSelected = selected === p
      return (
        <TouchableOpacity
          key={p}
          style={[
            styles.option,
            { borderColor: config.color },
            isSelected && { backgroundColor: config.color },
          ]}
          onPress={() => onSelect(p)}
        >
          <Text style={[styles.label, isSelected && styles.labelSelected]}>
            {config.label}
          </Text>
        </TouchableOpacity>
      )
    })}
  </View>
))

PrioritySelector.displayName = 'PrioritySelector'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  labelSelected: {
    color: '#fff',
  },
})
