import React, { useState, useEffect, memo } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Todo, Priority } from '@/types/todo.types'
import { PrioritySelector } from '@/components/PrioritySelector'
import { DatePickerField } from '@/components/DatePickerField'

export interface EditTodoModalProps {
  visible: boolean
  todo: Todo | null
  onSave: (id: string, title: string, priority: Priority, dueDate?: Date) => void
  onCancel: () => void
}

export const EditTodoModal = memo(({ visible, todo, onSave, onCancel }: EditTodoModalProps) => {
  const [titleInput, setTitleInput] = useState('')
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium')
  const [selectedDueDate, setSelectedDueDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (todo && visible) {
      setTitleInput(todo.title)
      setSelectedPriority(todo.priority)
      setSelectedDueDate(todo.dueDate)
    }
  }, [todo, visible])

  if (!todo) return null

  const isSaveDisabled = !titleInput.trim()

  const handleSave = () => {
    if (isSaveDisabled) return
    onSave(todo.id, titleInput.trim(), selectedPriority, selectedDueDate)
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Todoyu Düzenle</Text>

          <TextInput
            style={styles.input}
            value={titleInput}
            onChangeText={setTitleInput}
            placeholder="Todo başlığını gir"
            maxLength={200}
            autoFocus
          />

          <Text style={styles.sectionLabel}>Öncelik</Text>
          <PrioritySelector selected={selectedPriority} onSelect={setSelectedPriority} />

          <DatePickerField value={selectedDueDate} onChange={setSelectedDueDate} label="Son Tarih" />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, isSaveDisabled && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaveDisabled}
              accessibilityState={{ disabled: isSaveDisabled }}
            >
              <Text style={styles.saveText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
})

EditTodoModal.displayName = 'EditTodoModal'

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
})
