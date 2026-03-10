// src/components/TodoItem.tsx
import React, { memo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Todo, PRIORITY_CONFIG } from '@/types/todo.types'
import { PriorityBadge } from '@/components/PriorityBadge'
import { DueDateBadge } from '@/components/DueDateBadge'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  // onEdit — düzenleme modalini açar; implementasyon GREEN aşamasında eklenecek
  onEdit: (id: string) => void
}

export const TodoItem = memo(({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  return (
    <View
      testID="todo-item-container"
      style={[
        styles.container,
        { borderLeftWidth: 4, borderLeftColor: PRIORITY_CONFIG[todo.priority].color },
      ]}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(todo.id)}
        accessibilityRole="checkbox"
        accessibilityLabel={todo.title}
        accessibilityState={{ checked: todo.completed }}
      >
        <View style={[styles.checkboxInner, todo.completed && styles.checkboxChecked]}>
          {todo.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <Text
        style={[styles.title, todo.completed && styles.titleCompleted]}
        numberOfLines={2}
      >
        {todo.title}
      </Text>

      <PriorityBadge priority={todo.priority} />
      <DueDateBadge dueDate={todo.dueDate} completed={todo.completed} />

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => onEdit(todo.id)}
        accessibilityLabel={`${todo.title} düzenle`}
        accessibilityRole="button"
      >
        <Text style={styles.editText}>✎</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(todo.id)}
        accessibilityLabel={`${todo.title} sil`}
        accessibilityRole="button"
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  )
})

TodoItem.displayName = 'TodoItem'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
  },
  editText: {
    fontSize: 16,
    color: '#007AFF',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 4,
  },
  deleteText: {
    fontSize: 16,
    color: '#FF3B30',
  },
})
