---
name: codemap-update
description: >
  Codebase haritasını güncelle. "/codemap-update" komutuyla veya
  her feature implementation sonrasında otomatik çalışır. Claude'un
  codebase'de gezinmesini context harcamadan sağlar.
---

# Codemap Update Workflow

## Amaç
Claude'un codebase'i her seferinde keşfetmek için context harcamaması için
güncel bir harita tut.

## Adımlar

### 1. Mevcut Codemap Kontrol Et
`.claude/codemap.md` dosyası var mı? Yoksa oluştur.

### 2. Config Oku
`.claude/project.conf` dosyasını oku — DIR_SRC, FILE_EXT_SOURCE ve dizin yapısını al.

### 3. Proje Yapısını Tara
project.conf'daki DIR_SRC ve FILE_EXT_SOURCE değerlerini kullanarak dosyaları bul.

### 4. Codemap'i Güncelle
`.claude/codemap.md` dosyasına projenin dizin yapısına göre harita yaz.
Her dizin (DIR_COMPONENTS, DIR_SCREENS, DIR_STORE, vb.) için ayrı bölüm oluştur.
Her dosya için kısa açıklama ekle (dosyayı okuyarak).

### 4. Checkpoint Notu Ekle
Codemap'in sonuna:
```
## Son Güncelleme
- Tarih: [bugün]
- Son eklenen: [son feature adı]
- Test coverage: [son bilinen %]
```

Bu harita sayesinde yeni session'larda Claude tüm dosyaları okumak yerine
bu haritayı okuyarak hızlıca context kurar.
