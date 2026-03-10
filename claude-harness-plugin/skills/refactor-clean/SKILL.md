---
name: refactor-clean
description: >
  Codebase temizligi icin kullan. "/refactor-clean" komutuyla tetiklenir.
  Dead code, kullanilmayan import, loose .md dosyalari, eski TODO'lar
  temizlendiginde devreye gir. Uzun session sonlarinda kullanilmasi onerilir.
---

# Refactor & Clean Workflow

## Kapsam
Bu skill davranis degistirmez — sadece temizlik yapar.

## Adimlar

### 0. Config Oku
`.claude/project.conf` dosyasini oku — DIR_SRC, FILE_EXT_SOURCE, CMD_TEST, CMD_TYPECHECK, CONSOLE_LOG_PATTERN degerlerini al.

### 1. Dead Code Tarama
- Kullanilmayan import'lari bul (DIR_SRC icinde)
- CMD_TYPECHECK varsa calistir ve "declared but" uyarilarini listele

### 2. TODO / FIXME Tarama
DIR_SRC icinde `TODO`, `FIXME`, `HACK`, `XXX` ara.
Listele ve kullaniciya goster. Hangilerinin cozulecegini sor.

### 3. Console.log Tarama
DIR_SRC icinde CONSOLE_LOG_PATTERN ile ara (NO_CONSOLE_LOG=true ise).
Bulunanlari kaldir veya logger'a cevir.

### 4. Loose .md Dosyalari
`.claude/tmp/` klasorunde 7 gunden eski session dosyalarini listele.
Kullaniciya goster, onay alarak sil.

### 5. Kullanilmayan Dependency Kontrolu
Projenin paket yoneticisine uygun unused dependency kontrolu yap.
Sonuclari goster, kullanici kararina birak.

### 6. Test Calistir
Temizlik sonrasi: `CMD_TEST` calistir.
Tum testler gecmeli — hicbir davranis degismemeli.

### 7. Sonuc Raporu
- Kac satir silindi
- Kac dosya duzenlendi
- Test sonucu
