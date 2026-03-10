# RN Todo App — Agent Harness

## Project Config
Projeye özel tüm değişkenler `.claude/project.conf` dosyasında tanımlıdır.
Agent'lar, skill'ler ve hook'lar bu dosyadan okur.
**Yeni bir projeye taşırken sadece `project.conf` değiştirilir.**

## Stack
- React Native (Expo), TypeScript, Zustand (state), AsyncStorage (persistence)
- Jest + React Native Testing Library (unit/integration)
- EAS Build (distribution)

## Rules (her zaman uy — bunlar rules/ klasöründe detaylıdır)
- Commit atmadan önce tüm testler geçmeli (project.conf: `CMD_TEST`)
- `main` branch'e direkt commit yok — her zaman feature branch
- Fonksiyon başına max 30 satır, component başına max 150 satır (project.conf: `MAX_FUNCTION_LINES`, `MAX_FILE_LINES`)
- Her yeni component için mutlaka test dosyası yaz
- TypeScript strict mode — `any` kullanma
- Console.log bırakma — logger utility kullan

## Subagentlar
Aşağıdaki subagentları uygun durumlarda otomatik devreye al:
- `@planner` → Yeni feature başlamadan önce plan çıkar
- `@architect` → Mimari kararlar, klasör yapısı değişiklikleri
- `@tdd-guide` → Test yaz, sonra implementation
- `@code-reviewer` → Implementasyon bittikten sonra review
- `@deployer` → Commit, push ve deploy işlemleri (her adımda onay zorunlu)

## Skills (auto-invoked)
- `implement-feature` → planner → architect → tdd-guide → implement → review → deploy pipeline
- `deploy-pipeline` → commit → push → GitHub Actions deploy (her adımda onay zorunlu)
- `tdd` → Test yazma workflow'u
- `refactor-clean` → Dead code temizleme, loose .md dosyaları
- `codemap-update` → Codebase haritasını güncelle (checkpoint'lerde)

## Commands (slash ile çağrılan)
- `/implement-feature` → Feature geliştirme pipeline'ını başlat
- `/deploy` → Deploy pipeline'ını başlat (commit → push → deploy)
- `/tdd` → TDD workflow'u başlat
- `/refactor-clean` → Temizlik workflow'u
- `/codemap-update` → Codemap güncelle
- `/session-summary` → Session özetini .claude/tmp/'ye kaydet

## Dizin Yapısı
```
src/
  components/   → Reusable UI bileşenleri
  screens/      → Ekran bileşenleri
  hooks/        → Custom React hooks
  services/     → AsyncStorage, API katmanı
  store/        → Zustand store'ları
rules/          → Best practice kuralları (.md dosyaları)
.claude/
  agents/       → Subagent tanımları
  skills/       → Skill dosyaları
  hooks/        → Hook scriptleri
  tmp/          → Session memory dosyaları
```

## Sık Kullanılan Komutlar
- Dev: `npx expo start`
- Test: `npm test`
- Test watch: `npm run test:watch`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Build iOS: `eas build --platform ios`

## Session Memory
Her session başında kontrol et: `.claude/tmp/` klasöründe son session özeti var mı?
Varsa o dosyayı oku ve kaldığın yerden devam et.
