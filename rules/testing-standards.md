# Testing Standards

## Genel Kurallar
- TDD yaklaşımı — önce test, sonra implementation
- Her yeni component için test dosyası zorunlu
- Her yeni hook için test dosyası zorunlu
- Her yeni service fonksiyonu için unit test zorunlu
- Coverage hedefi: %80 minimum

## Test Yapısı
```
describe('ComponentName', () => {
  describe('render', () => {
    it('should render correctly', () => {})
  })
  
  describe('interactions', () => {
    it('should handle user action', () => {})
  })
  
  describe('edge cases', () => {
    it('should handle empty state', () => {})
  })
})
```

## React Native Testing Library
- `render` kullan, `shallow` değil
- `fireEvent` ile user interaction test et
- `waitFor` kullan async operasyonlarda
- `screen.getByTestId` yerine semantic query tercih et:
  - getByRole > getByLabelText > getByPlaceholderText > getByText > getByTestId

## Mock Stratejisi
- AsyncStorage → jest mock
- Navigation → mock navigation prop
- External service → jest.fn() ile mock
- Mock'ları `__mocks__/` klasöründe topla

## Ne Test Edilmeli
✅ Component render (doğru elemanlar var mı?)
✅ User interaction (buton tıklama, input)
✅ State değişimleri
✅ Error state'leri
✅ Loading state'leri
✅ Edge case'ler (boş liste, null değerler)

❌ Implementation detayları
❌ Third-party library internals
❌ Stil kuralları (snapshot test yok)
