import React, { memo, useState } from 'react'
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'

interface AddTodoInputProps {
  onAdd: (title: string) => void
}

export const AddTodoInput = memo(({ onAdd }: AddTodoInputProps) => {
  const [inputValue, setInputValue] = useState('')

  const trimmed = inputValue.trim()
  const isDisabled = trimmed.length === 0

  const handleSubmit = () => {
    if (isDisabled) return
    onAdd(trimmed)
    setInputValue('')
  }

  return (
    <View style={styles.container}>
      <TextInput
        testID="add-todo-text-input"
        style={styles.input}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder="Yeni todo ekle..."
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity
        testID="add-todo-submit-button"
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isDisabled}
        accessibilityState={{ disabled: isDisabled }}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Ekle</Text>
      </TouchableOpacity>
    </View>
  )
})

AddTodoInput.displayName = 'AddTodoInput'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
})
