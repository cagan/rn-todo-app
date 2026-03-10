---
name: tdd
description: >
  Test-Driven Development workflow'u icin kullan. "/tdd" komutuyla veya
  "test yaz", "tdd ile yap" ifadesi gectiginde devreye gir.
  Mevcut bir component/hook/service icin test yazmak istendiginde de kullan.
---

# TDD Workflow

## Kullanim
Bu skill, mevcut veya yeni kod icin TDD dongusunu uygular.

## Adimlar

### 0. Config Oku
`.claude/project.conf` dosyasini oku — CMD_TEST, DIR_SRC, FILE_EXT_TEST degerlerini al.

### 1. Hedefi Belirle
- Hangi dosya/component test edilecek?
- Mevcut test dosyasi var mi? (kontrol et)

### 2. Test Dosyasi Olustur (yoksa)
Projenin test dosya pattern'ine uygun olustur (project.conf'daki DIR_TESTS ve FILE_EXT_TEST'e bak).

### 3. Test Senaryolarini Belirle
rules/testing-standards.md'ye gore:
- Happy path
- Error path
- Edge case'ler (empty, null, max length vb.)

### 4. Testleri Yaz (RED)
Once failing testleri yaz.
`CMD_TEST -- --testPathPattern=FileName` ile confirm et — fail olmasi beklenen.

### 5. Implementation (GREEN)
Testleri gecirecek minimum kodu yaz.
`CMD_TEST` calistir — GREEN olana kadar iterate et.

### 6. Refactor
Testler GREEN iken kodu temizle.
`CMD_TEST` tekrar calistir — GREEN'de kaldigini dogrula.

### 7. Coverage Raporu
`CMD_TEST -- --coverage --testPathPattern=FileName`
Raporu kullaniciya goster.

## @tdd-guide Subagent ile Fark
- Bu skill: Hizli, interaktif TDD — mevcut component'ler icin
- @tdd-guide subagent: implement-feature pipeline icinde izole context'te calisir
