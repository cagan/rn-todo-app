#!/bin/bash
# post-write-lint.sh
# Write sonrasi hafif lint hint — BLOKLAMA YOK, sadece bilgi
# Komutlar .claude/project.conf'dan okunur

FILE_PATH="${CLAUDE_TOOL_RESULT:-}"

# project.conf'u yukle
CONF="${CLAUDE_PROJECT_DIR:-.}/.claude/project.conf"
if [ -f "$CONF" ]; then
  source "$CONF"
fi

# CMD_LINT tanimli degilse veya dosya kaynak uzantisi degilse cik
if [ -z "$CMD_LINT" ] || [ -z "$FILE_EXT_SOURCE" ]; then
  exit 0
fi

# Dosya uzantisini kontrol et (FILE_EXT_SOURCE: "ts,tsx")
EXT="${FILE_PATH##*.}"
if echo "$FILE_EXT_SOURCE" | grep -q "$EXT"; then
  ISSUES=$($CMD_LINT "$FILE_PATH" --format compact 2>/dev/null | wc -l)
  if [ "$ISSUES" -gt 0 ]; then
    echo "Hint: $FILE_PATH'de $ISSUES lint issue var (commit'te bloklanacak)"
  fi
fi

exit 0
