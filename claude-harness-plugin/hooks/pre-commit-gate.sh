#!/bin/bash
# pre-commit-gate.sh
# Sadece "git commit" komutlarini yakala ve quality gate uygula
# Komutlar .claude/project.conf'dan okunur

# Claude'un calistirdigi komutu al
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"

# Sadece git commit komutlarini yakala
if ! echo "$TOOL_INPUT" | grep -q "git commit"; then
  exit 0
fi

# project.conf'u yukle
CONF="${CLAUDE_PROJECT_DIR:-.}/.claude/project.conf"
if [ -f "$CONF" ]; then
  source "$CONF"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Commit Gate — Pre-checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Typecheck (CMD_TYPECHECK tanimliysa)
if [ -n "$CMD_TYPECHECK" ]; then
  echo "Typecheck kontrol ediliyor..."
  if ! $CMD_TYPECHECK --quiet 2>/dev/null; then
    echo "Typecheck hatalari var!"
    $CMD_TYPECHECK 2>&1 | head -20
    echo "Commit engellendi."
    exit 2
  fi
  echo "Typecheck: Temiz"
fi

# 2. Lint (CMD_LINT tanimliysa)
if [ -n "$CMD_LINT" ]; then
  echo "Lint kontrol ediliyor..."
  if ! $CMD_LINT --quiet 2>/dev/null; then
    echo "Lint hatalari var!"
    $CMD_LINT 2>&1 | head -20
    echo "Commit engellendi."
    exit 2
  fi
  echo "Lint: Temiz"
fi

# 3. Console.log kontrolu (NO_CONSOLE_LOG=true ise)
if [ "$NO_CONSOLE_LOG" = "true" ] && [ -n "$DIR_SRC" ]; then
  PATTERN="${CONSOLE_LOG_PATTERN:-console\.}"
  CONSOLE_LOGS=$(grep -r "$PATTERN" "$DIR_SRC" $CONSOLE_LOG_INCLUDE -l 2>/dev/null)
  if [ -n "$CONSOLE_LOGS" ]; then
    echo "Console.log bulundu:"
    echo "$CONSOLE_LOGS"
    echo "Commit engellendi."
    exit 2
  fi
  echo "Console.log: Temiz"
fi

# 4. Test (CMD_TEST tanimliysa)
if [ -n "$CMD_TEST" ]; then
  echo "Testler calistiriliyor..."
  if ! $CMD_TEST --silent 2>/dev/null; then
    echo "Testler gecmedi!"
    $CMD_TEST 2>&1 | tail -30
    echo "Commit engellendi."
    exit 2
  fi
  echo "Testler: Gecti"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Tum kontroller gecti — commit aliniyor"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exit 0
