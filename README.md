# RN Todo App

React Native (Expo) todo uygulaması. cogsec'in "Everything Claude Code" yöntemiyle yapılandırılmış Claude Code harness'ı ile geliştirilir.

## Kurulum

```bash
npm install
npx expo start
```

## Test

```bash
npm test              # tek seferlik
npm run test:watch    # watch mode
npm run test:coverage # coverage raporu
```

---

## Claude Code Harness Yapısı

Bu proje cogsec'in Shorthand Guide pratiklerini uygular:

```
.claude/
  agents/
    planner.md          → Feature planı çıkarır, onay alır
    architect.md        → Blueprint & interface tanımları
    tdd-guide.md        → Test dosyalarını önce yazar (RED aşaması)
    code-reviewer.md    → Implementasyon sonrası review
  skills/
    implement-feature/  → Tam pipeline: plan→mimarı→tdd→implement→review
    tdd/                → Standalone TDD workflow
    refactor-clean/     → Dead code & temizlik
    codemap-update/     → Codebase haritasını güncelle
  commands/
    session-summary.md  → Session özetini .tmp'ye kaydet
  hooks/
    pre-commit-gate.sh  → Commit'te: TS + lint + test zorunlu (exit 2)
    post-write-lint.sh  → Write sonrası: hafif hint (bloklama yok)
    session-auto-save.sh→ Stop event'te: otomatik özet kaydet
  codemap.md            → Codebase haritası (context tasarrufu)
  tmp/                  → Session memory dosyaları
  settings.json         → Hook konfigürasyonu

rules/
  coding-standards.md   → TypeScript, React Native, naming kuralları
  testing-standards.md  → TDD yaklaşımı, coverage, test yapısı
  git-workflow.md       → Branch stratejisi, commit formatı, PR kuralları

CLAUDE.md              → Proje anayasası (her session'da okunur)
```

## Geliştirme Workflow'u

### Yeni Feature

```
Sen: "Login ekranı ekle"

Claude → implement-feature skill devreye girer:
  1. @planner → Plan + onay
  2. @architect → Blueprint & interface'ler
  3. @tdd-guide → Test dosyaları (RED)
  4. Ana agent → Implementation (GREEN)
  5. Refactor aşaması
  6. @code-reviewer → Review (🔴/🟡/🔵)
  7. /codemap-update
```

### Manuel Komutlar

```bash
/implement-feature   # Feature pipeline başlat
/tdd                 # Standalone TDD workflow
/refactor-clean      # Dead code temizle
/codemap-update      # Codemap güncelle
/session-summary     # Session özetini kaydet
```

### Session Memory

```bash
# Session biterken otomatik kaydedilir (.claude/tmp/session-YYYY-MM-DD_HH-MM.md)

# Yeni session'da devam etmek için:
"`.claude/tmp/session-2024-01-15_14-30.md` oku ve kaldığın yerden devam et"
```

### Hook Davranışı

| Hook | Tetikleyici | Davranış |
|------|-------------|----------|
| pre-commit-gate | `git commit` | TS + lint + test → fail ise `exit 2` (BLOKLA) |
| post-write-lint | Her Write | Hint ver, ASLA bloklama |
| session-auto-save | Session Stop | Otomatik özet kaydet |

## Subagent Kılavuzu

| Subagent | Araçlar | Ne zaman çağrılır |
|----------|---------|-------------------|
| @planner | Read, Glob, Grep | Feature başlamadan önce |
| @architect | Read, Glob, Grep | Plan onayından sonra |
| @tdd-guide | Read, Write, Edit, Glob | Blueprint sonrası |
| @code-reviewer | Read, Glob, Grep | Implementasyon bittikten sonra |

## rules/ Klasörü

Claude'un her zaman uyması gereken kurallar `.rules/` yapısını uygular:
- `coding-standards.md` → TypeScript strict, naming, max 30 satır/fonksiyon
- `testing-standards.md` → TDD, coverage ≥80%, test yapısı
- `git-workflow.md` → Conventional Commits, branch stratejisi
