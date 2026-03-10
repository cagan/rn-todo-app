# Coding Standards

## TypeScript
- Strict mode her zaman açık
- Interface > Type alias (object şekilleri için)
- Enum yerine `as const` object kullan
- `any` kesinlikle yasak — `unknown` kullan ve narrow et
- Return type'ları her zaman explicit yaz (özellikle async fonksiyonlar)

## React Native
- Functional component only — class component yok
- Her component kendi dosyasında
- Props interface'i component ile aynı dosyada, üstünde tanımla
- StyleSheet.create() kullan — inline style objesi yok
- memo() kullan gereksiz re-render'ları önlemek için

## Dosya Adlandırma
- Component: PascalCase.tsx (örn: TodoItem.tsx)
- Hook: camelCase, "use" prefix (örn: useTodos.ts)
- Service: camelCase.service.ts
- Store: camelCase.store.ts
- Test: aynı isim + .test.ts/.test.tsx

## State Yönetimi
- Global state → Zustand store
- Local UI state → useState
- Server state (varsa) → React Query
- Store'u slice'lara böl — tek dev store yok

## Error Handling
- async fonksiyonlarda try/catch zorunlu
- Error boundary kullan ekran seviyesinde
- User'a anlamlı mesaj göster — teknik error mesajı gösterme
- Tüm hataları logger ile logla

## Import Sırası
1. React/RN core importları
2. Third-party kütüphaneler
3. Internal modüller (store, services, hooks)
4. Component importları
5. Types
6. Styles (en sona)
