#!/bin/bash
# session-auto-save.sh
# Her tool call sonrasi session durumunu otomatik kaydet

TIMESTAMP=$(date +%Y-%m-%d_%H-%M)
SESSION_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/tmp"
SESSION_FILE="$SESSION_DIR/session-$TIMESTAMP.md"

mkdir -p "$SESSION_DIR"

cat > "$SESSION_FILE" << EOF
# Session Ozeti — $TIMESTAMP
_Bu dosya otomatik olusturuldu. Detay eklemek icin /session-summary komutunu kullan._

## Git Durumu
$(git status --short 2>/dev/null || echo "Git repo yok")

## Son Commit'ler
$(git log --oneline -5 2>/dev/null || echo "Git history yok")

## Test Durumu
$(source "${CLAUDE_PROJECT_DIR:-.}/.claude/project.conf" 2>/dev/null; ${CMD_TEST:-echo "CMD_TEST tanimli degil"} --silent 2>&1 | tail -5 || echo "Test calistirilamadi")

## Sonraki Session Icin
Bu dosyayi oku ve devam et. Detay icin /session-summary ile daha kapsamli ozet olustur.
EOF
