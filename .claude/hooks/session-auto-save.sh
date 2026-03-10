#!/bin/bash
# session-auto-save.sh
# Session bittiğinde (Stop event) otomatik özet oluştur

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
SESSION_FILE=".claude/tmp/session-${TIMESTAMP}.md"

mkdir -p .claude/tmp

cat > "$SESSION_FILE" << EOF
# Session Özeti — ${TIMESTAMP}
_Bu dosya otomatik oluşturuldu. Detay eklemek için /session-summary komutunu kullan._

## Git Durumu
$(git status --short 2>/dev/null || echo "Git repo yok")

## Son Commit'ler
$(git log --oneline -5 2>/dev/null || echo "Git history yok")

## Test Durumu
$(npm test --silent 2>&1 | tail -5 || echo "Test çalıştırılamadı")

## Sonraki Session İçin
Bu dosyayı oku ve devam et. Detay için /session-summary ile daha kapsamlı özet oluştur.
EOF

echo "📝 Session özeti kaydedildi: $SESSION_FILE"
exit 0
