# Session Summary Command

Bu session'da yapılanları özetle ve `.claude/tmp/session-[tarih].md` dosyasına kaydet.

## Özet Şablonu

```markdown
# Session Özeti — [tarih ve saat]

## Tamamlanan İşler
- [x] Feature/fix/refactor açıklaması

## Devam Eden İşler
- [ ] Yarım kalan görev

## Çalışan Yaklaşımlar (kanıtlanmış)
- [Hangi approach işe yaradı ve neden]

## Denendi, İşe Yaramadı
- [Hangi approach başarısız oldu ve neden]

## Önemli Teknik Kararlar
- [Mimari/teknik karar ve gerekçesi]

## Sonraki Adımlar
1. [Öncelik sırasıyla]
2.
3.

## Dikkat Edilmesi Gereken
- [Bilinen bug, edge case, teknik borç]

## Test Durumu
- Son `npm test` sonucu: PASS/FAIL
- Coverage: [%]
```

## Kullanım
Yeni session'a başlarken Claude'a şunu söyle:
"`.claude/tmp/session-[tarih].md` dosyasını oku ve kaldığın yerden devam et"
