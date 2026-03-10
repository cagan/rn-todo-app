---
name: codemap-update
description: >
  Codebase haritasini guncelle. "/codemap-update" komutuyla veya
  her feature implementation sonrasinda otomatik calisir. Claude'un
  codebase'de gezinmesini context harcamadan saglar.
---

# Codemap Update Workflow

## Amac
Claude'un codebase'i her seferinde kesfetmek icin context harcamamasi icin
guncel bir harita tut.

## Adimlar

### 1. Mevcut Codemap Kontrol Et
`.claude/codemap.md` dosyasi var mi? Yoksa olustur.

### 2. Config Oku
`.claude/project.conf` dosyasini oku — DIR_SRC, FILE_EXT_SOURCE ve dizin yapisini al.

### 3. Proje Yapisini Tara
project.conf'daki DIR_SRC ve FILE_EXT_SOURCE degerlerini kullanarak dosyalari bul.

### 4. Codemap'i Guncelle
`.claude/codemap.md` dosyasina projenin dizin yapisina gore harita yaz.
Her dizin (DIR_COMPONENTS, DIR_SCREENS, DIR_STORE, vb.) icin ayri bolum olustur.
Her dosya icin kisa aciklama ekle (dosyayi okuyarak).

### 5. Checkpoint Notu Ekle
Codemap'in sonuna:
```
## Son Guncelleme
- Tarih: [bugun]
- Son eklenen: [son feature adi]
- Test coverage: [son bilinen %]
```

Bu harita sayesinde yeni session'larda Claude tum dosyalari okumak yerine
bu haritayi okuyarak hizlica context kurar.
