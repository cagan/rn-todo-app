import React, { useState, memo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

const MONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

const formatDateTR = (d: Date): string =>
  `${d.getDate()} ${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`

interface DatePickerFieldProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  label?: string
  minimumDate?: Date
}

export const DatePickerField = memo(({ value, onChange, label, minimumDate }: DatePickerFieldProps) => {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <View testID="date-picker-field">
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.row}>
        <TouchableOpacity
          testID="date-picker-trigger"
          style={styles.triggerButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.triggerText}>
            {value ? formatDateTR(value) : 'Tarih seç'}
          </Text>
        </TouchableOpacity>

        {value != null && (
          <TouchableOpacity
            testID="date-clear-button"
            style={styles.clearButton}
            onPress={() => onChange(undefined)}
            accessibilityLabel="Tarihi temizle"
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {showPicker && (
        <DateTimePicker
          testID="native-date-picker"
          value={value ?? new Date()}
          mode="date"
          minimumDate={minimumDate}
          onChange={(_, selected) => {
            setShowPicker(false)
            if (selected != null) onChange(selected)
          }}
        />
      )}
    </View>
  )
})

DatePickerField.displayName = 'DatePickerField'

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  triggerButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  triggerText: {
    fontSize: 15,
    color: '#333',
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
  },
  clearText: {
    fontSize: 16,
    color: '#FF3B30',
  },
})
