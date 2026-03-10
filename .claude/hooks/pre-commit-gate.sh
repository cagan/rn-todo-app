#!/bin/bash
# pre-commit-gate.sh
# Sadece "git commit" komutlarını yakala ve testleri zorunlu kıl

# Claude'un çalıştırdığı komutu al
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"

# Commit komutu değilse çıkış (hook'u bypass et)
if ! echo "$TOOL_INPUT" | grep -q "git commit"; then
  exit 0
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 Commit Gate — Pre-checks başlıyor"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. TypeScript kontrolü
echo "📘 TypeScript kontrol ediliyor..."
if ! npx tsc --noEmit --quiet 2>/dev/null; then
  echo "❌ TypeScript hataları var!"
  npx tsc --noEmit 2>&1 | head -20
  echo ""
  echo "🛑 Commit engellendi. TypeScript hatalarını düzelt."
  exit 2  # exit 2 = Claude'u durdur
fi
echo "✅ TypeScript: Temiz"

# 2. Lint kontrolü
echo "🔍 Lint kontrol ediliyor..."
if ! npx eslint src/ --quiet 2>/dev/null; then
  echo "❌ ESLint hataları var!"
  npx eslint src/ 2>&1 | head -20
  echo ""
  echo "🛑 Commit engellendi. Lint hatalarını düzelt."
  exit 2
fi
echo "✅ Lint: Temiz"

# 3. Console.log kontrolü
echo "🔎 Console.log kontrol ediliyor..."
CONSOLE_LOGS=$(grep -r "console\." src/ --include="*.ts" --include="*.tsx" -l 2>/dev/null)
if [ -n "$CONSOLE_LOGS" ]; then
  echo "❌ Console.log bulundu:"
  echo "$CONSOLE_LOGS"
  echo ""
  echo "🛑 Commit engellendi. Console.log'ları kaldır veya logger'a çevir."
  exit 2
fi
echo "✅ Console.log: Temiz"

# 4. Test kontrolü
echo "🧪 Testler çalıştırılıyor..."
if ! npm test --silent 2>/dev/null; then
  echo "❌ Testler geçmedi!"
  npm test 2>&1 | tail -30
  echo ""
  echo "🛑 Commit engellendi. Testleri düzelt."
  exit 2
fi
echo "✅ Testler: Geçti"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Tüm kontroller geçti — commit alınıyor"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exit 0
