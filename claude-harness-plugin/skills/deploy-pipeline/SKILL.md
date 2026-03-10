---
name: deploy-pipeline
description: >
  Feature tamamlandiktan sonra commit -> push -> deploy pipeline'i.
  "/deploy" komutuyla veya implement-feature'in son adimi olarak tetiklenir.
  Her adimda kullanici onayi zorunludur — onaysiz aksiyon alinmaz.
---

# Deploy Pipeline

Bu skill, tamamlanmis kodu guvenli sekilde deploy eder.
Her adimda kullanici onayi **zorunludur** — onaysiz ilerleme yapma.

## Pipeline Adimlari

### Adim 1: Quality Gate
Once `.claude/project.conf` dosyasini oku. Ardindan asagidaki kontrolleri calistir:
```bash
$CMD_TEST        # project.conf'dan
$CMD_TYPECHECK   # project.conf'dan (tanimliysa)
```

Tum kontroller gecmeli. Herhangi biri basarisiz olursa:
- Hatayi kullaniciya goster
- Pipeline'i durdur
- "Duzeltip tekrar deneyelim mi?" sor

### Adim 2: Git Durum Kontrolu
```bash
git status
git branch --show-current
git log --oneline -5
```

Kullaniciya goster:
- Hangi branch'tesin
- Degisen dosya sayisi
- Son commit'ler

**Kural:** project.conf'daki `MAIN_BRANCH` uzerindeysen uyar ve feature branch olusturmayi oner.

### Adim 3: Commit (Onay Gerekli)
1. Degisen dosyalari listele
2. Anlamli commit mesaji oner (conventional commits formati)
3. **"Bu commit mesaji ile devam edeyim mi?" sor**
4. Onay gelirse: `git add <dosyalar>` + `git commit`
5. Onay gelmezse: Kullanicinin istedigi mesajla commit at

### Adim 4: Push (Onay Gerekli)
1. Push edilecek branch'i goster
2. Remote durumunu kontrol et (`git remote -v`)
3. **"<branch> branch'ine push edeyim mi?" sor**
4. Onay gelirse: `git push -u origin <branch>`
5. Push sonucunu goster

### Adim 5: PR / Deploy Tetikleme (Onay Gerekli)
1. GitHub Actions CI workflow'un otomatik tetiklenecegini bildir
2. PR olusturulup olusturulmayacagini sor
3. **"PR olusturayim mi? (main'e merge icin)" sor**
4. Onay gelirse: `gh pr create` ile PR olustur
5. CI durumunu kontrol et: `gh run list --limit 1`

### Adim 6: Sonuc Raporu
Pipeline tamamlandiginda goster:
- Commit hash
- Branch adi
- PR URL (varsa)
- CI durumu
- Bir sonraki adim onerisi

## Onemli Kurallar
- **ASLA** kullanici onayi almadan commit, push veya PR olusturma
- **ASLA** MAIN_BRANCH'e (project.conf) direkt push yapma
- **ASLA** force push kullanma
- Her adimda ne olacagini ONCE acikla, SONRA onay iste
- Hata durumunda pipeline'i durdur, kullaniciya raporla
