import React, { memo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FilterType } from '@/types/todo.types'

interface FilterBarProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  counts: Record<FilterType, number>
}

const FILTER_LABELS: Record<FilterType, string> = {
  all: 'Tümü',
  active: 'Aktif',
  completed: 'Tamamlandı',
}

const FILTERS: FilterType[] = ['all', 'active', 'completed']

export const FilterBar = memo(({ currentFilter, onFilterChange, counts }: FilterBarProps) => {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => {
        const isActive = currentFilter === filter
        return (
          <TouchableOpacity
            key={filter}
            testID={`filter-${filter}`}
            style={[styles.button, isActive && styles.activeButton]}
            onPress={() => onFilterChange(filter)}
            accessibilityState={{ selected: isActive }}
            accessibilityRole="button"
          >
            <Text style={[styles.buttonText, isActive && styles.activeText]}>
              {`${FILTER_LABELS[filter]} (${counts[filter]})`}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
})

FilterBar.displayName = 'FilterBar'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeText: {
    color: '#fff',
  },
})
