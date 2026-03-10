---
name: implement-feature
description: >
  Yeni bir feature implement edilmek istendiginde otomatik devreye gir.
  "yeni feature", "ekle", "implement et", "gelistir" ifadeleri gectiginde
  ya da kullanici acikca bir ozellik talep ettiginde bu skill'i kullan.
  TDD pipeline'ini baslatir: planner -> architect -> tdd-guide -> implement -> review.
---

# Feature Implementation Pipeline

Bu skill, yeni bir feature'i uctan uca gelistirir.
CLAUDE.md ve rules/ klasorune gore calisir.

## Pipeline Adimlari

### Adim 1: Plan (@planner subagent)
@planner subagent'ini su context ile cagir:
- Kullanicinin istegi
- Mevcut codebase yapisi (CLAUDE.md'den)
- Ilgili mevcut dosyalar

@planner'in plani cikmasini bekle.
Kullanicidan onay al. Onay gelmeden Adim 2'ye gecme.

### Adim 2: Mimari (@architect subagent)
@architect subagent'ini @planner'in onayli plani ile cagir.
Blueprint cikana kadar bekle.

### Adim 3: Test Yaz (@tdd-guide subagent)
@tdd-guide subagent'ini @architect'in blueprint'i ile cagir.
Test dosyalari yazilana kadar bekle. (RED asamasi)

### Adim 4: Implementation (Ana Agent)
Once `.claude/project.conf` dosyasini oku — CMD_TEST komutunu ve dizin yapisini oradan al.
Sirayla implement et — her adimdan sonra testleri calistir:
1. Type/interface/model tanimlari
2. Service/data katmani
3. State management katmani
4. UI katmani (component/view/page)
5. Ekrana/route'a entegrasyon
6. `CMD_TEST` calistir -> GREEN asamasi

### Adim 5: Refactor
GREEN'e ulasildiktan sonra:
- Kodun okunabilirligini artir (davranisi degistirmeden)
- Tekrar eden kod varsa extract et
- `CMD_TEST` tekrar calistir — hala GREEN mi?

### Adim 6: Review (@code-reviewer subagent)
@code-reviewer subagent'ini tum degisen dosyalarla cagir.
CRITICAL veya MAJOR bulgu varsa once duzelt.

### Adim 7: Codemap Guncelle
implement-feature bittikten sonra /codemap-update'i calistir.

### Adim 8: Deploy (Onay Gerekli)
Kullaniciya sor: "Degisiklikleri commit/push/deploy etmek ister misin?"
- Evet -> /deploy-pipeline skill'ini tetikle
- Hayir -> Pipeline'i burada sonlandir

## Onemli Kurallar
- Her adimda kullaniciyi bilgilendir ("Su an Adim 2'deyiz...")
- Adimlari atlatma — siralamaya uy
- Bir adim basarisiz olursa duraksama ve kullaniciya rapor ver
- Deploy adiminda HER alt-adim icin ayri onay al
