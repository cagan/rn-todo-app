---
name: init
description: >
  Yeni bir projeye Claude Harness'i kur. "/claude-harness:init" komutuyla tetiklenir.
  project.conf olusturur, dizin yapisi kurar ve CLAUDE.md template'ini yazar.
---

# Claude Harness — Init

Bu skill, mevcut projeye Claude Harness yapisini kurar.

## Adimlar

### 1. Proje Bilgilerini Topla
Kullaniciya sor:
- Proje adi
- Programlama dili (typescript/python/go/rust/java)
- Framework (react-native/nextjs/django/gin/spring/none)
- Proje aciklamasi
- Test komutu (npm test, pytest, go test ./...)
- Lint komutu (opsiyonel)
- Type check komutu (opsiyonel)
- Dev komutu
- Kaynak dizin (src/, app/, cmd/)
- Dosya uzantilari (ts,tsx / py / go / rs)

### 2. Dizin Yapisi Olustur
```
.claude/
  tmp/
rules/
```

### 3. project.conf Olustur
Plugin'in `templates/project.conf.template` dosyasini baz alarak,
kullanicinin cevaplariyla doldurulmus `.claude/project.conf` dosyasi olustur.

### 4. CLAUDE.md Olustur
Plugin'in `templates/CLAUDE.md.template` dosyasini baz alarak,
proje bilgileriyle doldurulmus `CLAUDE.md` dosyasi olustur.

### 5. rules/ Klasoru
Temel kural dosyalarini olustur:
- `rules/coding-standards.md` — Projenin dil/framework'une uygun kodlama standartlari
- `rules/testing-standards.md` — Test yazma kurallari
- `rules/git-workflow.md` — Git branch/commit kurallari

### 6. Sonuc
Kullaniciya goster:
- Olusturulan dosyalar
- Aktif olan skill'ler ve agent'lar
- "project.conf dosyasini ihtiyacina gore duzenleyebilirsin"
- "/claude-harness:implement-feature ile ilk feature'ini olusturabilirsin"
