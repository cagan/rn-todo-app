---
name: refactor-clean
description: >
  Codebase temizliği için kullan. "/refactor-clean" komutuyla tetiklenir.
  Dead code, kullanılmayan import, loose .md dosyaları, eski TODO'lar
  temizlendiğinde devreye gir. Uzun session sonlarında kullanılması önerilir.
---

# Refactor & Clean Workflow

## Kapsam
Bu skill davranış değiştirmez — sadece temizlik yapar.

## Adımlar

### 0. Config Oku
`.claude/project.conf` dosyasını oku — DIR_SRC, FILE_EXT_SOURCE, CMD_TEST, CMD_TYPECHECK, CONSOLE_LOG_PATTERN değerlerini al.

### 1. Dead Code Tarama
- Kullanılmayan import'ları bul (DIR_SRC içinde)
- CMD_TYPECHECK varsa çalıştır ve "declared but" uyarılarını listele

### 2. TODO / FIXME Tarama
DIR_SRC içinde `TODO`, `FIXME`, `HACK`, `XXX` ara.
Listele ve kullanıcıya göster. Hangilerinin çözüleceğini sor.

### 3. Console.log Tarama
DIR_SRC içinde CONSOLE_LOG_PATTERN ile ara (NO_CONSOLE_LOG=true ise).
Bulunanları kaldır veya logger'a çevir.

### 4. Loose .md Dosyaları
`.claude/tmp/` klasöründe 7 günden eski session dosyalarını listele.
Kullanıcıya göster, onay alarak sil.

### 5. Kullanılmayan Dependency Kontrolü
Projenin paket yöneticisine uygun unused dependency kontrolü yap.
Sonuçları göster, kullanıcı kararına bırak.

### 6. Test Çalıştır
Temizlik sonrası: `CMD_TEST` çalıştır.
Tüm testler geçmeli — hiçbir davranış değişmemeli.

### 7. Sonuç Raporu
- Kaç satır silindi
- Kaç dosya düzenlendi
- Test sonucu
