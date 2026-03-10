# Codemap — 2026-03-10
_codemap-update skill tarafından yönetilir. Manuel düzenleme yapma._

## Types
- `src/types/todo.types.ts` → Tüm tip tanımları
  - `FilterType`: `'all' | 'active' | 'completed'`
  - `Priority`: `'low' | 'medium' | 'high'`
  - `PriorityConfig`: `{ color, label }` — görsel konfigürasyon
  - `PRIORITY_CONFIG`: `Record<Priority, PriorityConfig>` sabiti
  - `DEFAULT_PRIORITY`: `'medium'`
  - `Todo`: `{ id, title, completed, createdAt, priority, dueDate? }`
  - `TodoStore`: State + Actions interface

## Store
- `src/store/todo.store.ts` → Zustand todo store
  - State: `todos[]`, `filter: FilterType`, `isLoading`, `error`
  - Actions: `addTodo(title, priority?, dueDate?)`, `toggleTodo(id)`, `deleteTodo(id)`, `editTodo(id, title, priority, dueDate?)`, `setFilter(filter)`, `loadTodos()`, `clearError()`
  - Selector: `useFilteredTodos()` → filter'a göre filtrelenmiş todos

## Services
- `src/services/storage.service.ts` → AsyncStorage wrapper
  - `saveTodos(todos)`, `loadTodos()`, `clearTodos()`
  - loadTodos: Date deserialize + priority migration (eski todolara `DEFAULT_PRIORITY` atanır)

## Components
- `src/components/TodoItem.tsx` → Tekil todo satırı (memo)
  - Props: `todo: Todo`, `onToggle(id)`, `onDelete(id)`, `onEdit(id)`
  - Priority rengi ile sol border, PriorityBadge, DueDateBadge, edit/delete butonları
- `src/components/PriorityBadge.tsx` → Renkli öncelik rozeti (memo)
  - Props: `priority: Priority`
- `src/components/PrioritySelector.tsx` → 3'lü öncelik seçici (memo)
  - Props: `selected: Priority`, `onSelect(priority)`
- `src/components/DueDateBadge.tsx` → Bitiş tarihi rozeti (memo)
  - Props: `dueDate: Date | undefined`, `completed: boolean`
  - Status: overdue (kırmızı), today (sarı), tomorrow (turuncu), upcoming (gri)
  - Completed todolar her zaman "upcoming" gösterir
- `src/components/DatePickerField.tsx` → Tarih seçici + temizle butonu (memo)
  - Props: `value: Date | undefined`, `onChange(date)`, `label?`, `minimumDate?`
  - `@react-native-community/datetimepicker` kullanır
- `src/components/EditTodoModal.tsx` → Todo düzenleme modalı (memo)
  - Props: `visible`, `todo: Todo | null`, `onSave(id, title, priority, dueDate?)`, `onCancel()`
  - İçinde PrioritySelector + DatePickerField kullanır

## Mocks
- `src/__mocks__/async-storage.ts` → Jest AsyncStorage mock (in-memory Map)

## Tests (8 suite, 129 test — tümü geçiyor)
- `src/components/__tests__/TodoItem.test.tsx`
- `src/components/__tests__/PriorityBadge.test.tsx`
- `src/components/__tests__/PrioritySelector.test.tsx`
- `src/components/__tests__/DueDateBadge.test.tsx`
- `src/components/__tests__/DatePickerField.test.tsx`
- `src/components/__tests__/EditTodoModal.test.tsx`
- `src/store/__tests__/todo.store.test.ts`
- `src/services/__tests__/storage.service.test.ts`

## Henüz Yapılmamış
- `src/screens/HomeScreen.tsx` → Ana ekran (todo listesi + filtreler + input)
- `src/components/FilterBar.tsx` → Filtre butonları (all/active/completed)
- `src/components/AddTodoInput.tsx` → Yeni todo ekleme input'u
- Git repo kurulumu

## Son Güncelleme
- Tarih: 2026-03-10
- Son eklenen: EditTodoModal, DatePickerField, DueDateBadge
- Test durumu: 8 suite, 129 test, %100 pass
- Sonraki: HomeScreen, FilterBar, AddTodoInput, git init
