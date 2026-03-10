import React, { memo, useState, useEffect, useCallback, useMemo } from 'react'
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTodoStore, useFilteredTodos } from '@/store/todo.store'
import { TodoItem } from '@/components/TodoItem'
import { FilterBar } from '@/components/FilterBar'
import { AddTodoInput } from '@/components/AddTodoInput'
import { EditTodoModal } from '@/components/EditTodoModal'
import { Todo, Priority } from '@/types/todo.types'

export const HomeScreen = memo(() => {
  const {
    todos,
    filter,
    isLoading,
    error,
    loadTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
    clearError,
  } = useTodoStore()

  const filteredTodos = useFilteredTodos()
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const counts = useMemo(() => ({
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  }), [todos])

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  const handleEdit = useCallback(
    (id: string) => {
      const todo = todos.find((t) => t.id === id) ?? null
      setEditingTodo(todo)
    },
    [todos],
  )

  const handleSave = useCallback(
    (id: string, title: string, priority: Priority, dueDate?: Date) => {
      editTodo(id, title, priority, dueDate)
      setEditingTodo(null)
    },
    [editTodo],
  )

  const handleCancel = useCallback(() => {
    setEditingTodo(null)
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: Todo }) => (
      <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={handleEdit} />
    ),
    [toggleTodo, deleteTodo, handleEdit],
  )

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator testID="home-loading-indicator" size="large" color="#007AFF" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AddTodoInput onAdd={addTodo} />
      <FilterBar currentFilter={filter} onFilterChange={setFilter} counts={counts} />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity testID="home-clear-error-button" onPress={clearError}>
            <Text style={styles.errorDismiss}>Kapat</Text>
          </TouchableOpacity>
        </View>
      )}

      {filteredTodos.length === 0 ? (
        <View testID="home-empty-state" style={styles.centered}>
          <Text style={styles.emptyText}>Henüz todo yok</Text>
        </View>
      ) : (
        <FlatList
          testID="home-todo-list"
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      <EditTodoModal
        visible={editingTodo !== null}
        todo={editingTodo}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </View>
  )
})

HomeScreen.displayName = 'HomeScreen'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF3F3',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    flex: 1,
  },
  errorDismiss: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
})
