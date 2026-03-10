#!/bin/bash
# post-write-lint.sh
# Write sonrası hafif lint hint — BLOKLAMA YOK, sadece bilgi
# (blocking mid-plan Claude'u "şaşırtır" — sadece commit'te blokla)

FILE_PATH="${CLAUDE_TOOL_RESULT:-}"

# TypeScript/TSX dosyalarını kontrol et
if [[ "$FILE_PATH" == *.ts ]] || [[ "$FILE_PATH" == *.tsx ]]; then
  ISSUES=$(npx eslint "$FILE_PATH" --format compact 2>/dev/null | wc -l)
  
  if [ "$ISSUES" -gt 0 ]; then
    echo "💡 Hint: $FILE_PATH'de $ISSUES lint issue var (commit'te bloklanacak)"
  fi
fi

exit 0  # Her zaman 0 — ASLA bloklama
