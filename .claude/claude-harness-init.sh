#!/bin/bash
# ============================================================
# Claude Harness — Init Script
# ============================================================
# Bu script, mevcut .claude/ yapısını yeni bir projeye kopyalar
# ve project.conf'u interaktif olarak doldurur.
#
# Kullanım:
#   curl -sL <repo-url>/claude-harness-init.sh | bash
#   veya
#   bash claude-harness-init.sh /path/to/target-project
# ============================================================

set -e

TARGET="${1:-.}"
HARNESS_DIR="$TARGET/.claude"

echo "============================================"
echo "  Claude Harness — Proje Kurulumu"
echo "============================================"
echo ""

# Mevcut .claude/ varsa uyar
if [ -d "$HARNESS_DIR" ]; then
  echo "UYARI: $HARNESS_DIR zaten mevcut."
  read -p "Üzerine yazılsın mı? (e/h): " OVERWRITE
  if [ "$OVERWRITE" != "e" ]; then
    echo "Iptal edildi."
    exit 0
  fi
fi

# Dizinleri oluştur
mkdir -p "$HARNESS_DIR"/{agents,skills/{implement-feature,deploy-pipeline,tdd,refactor-clean,codemap-update},hooks,tmp,commands}
mkdir -p "$TARGET/rules"

echo ""
echo "--- Proje Bilgileri ---"
read -p "Proje adı: " PROJECT_NAME
read -p "Programlama dili (typescript/python/go/rust/java): " PROJECT_LANG
read -p "Framework (react-native/nextjs/django/gin/actix/spring/none): " PROJECT_FRAMEWORK
read -p "Proje açıklaması: " PROJECT_DESC

echo ""
echo "--- Komutlar ---"
read -p "Test komutu (ör: npm test, pytest, go test ./...): " CMD_TEST
read -p "Lint komutu (ör: npm run lint, flake8, golangci-lint run) [boş bırakılabilir]: " CMD_LINT
read -p "Type check komutu (ör: npx tsc --noEmit, mypy .) [boş bırakılabilir]: " CMD_TYPECHECK
read -p "Dev komutu (ör: npx expo start, python manage.py runserver): " CMD_DEV

echo ""
echo "--- Dizin Yapısı ---"
read -p "Kaynak dizin (ör: src/, app/, cmd/): " DIR_SRC
read -p "Dosya uzantıları (ör: ts,tsx / py / go / rs): " FILE_EXT

echo ""
echo "--- Kurallar ---"
read -p "Max fonksiyon satır sayısı [30]: " MAX_FUNC
MAX_FUNC="${MAX_FUNC:-30}"
read -p "Max dosya satır sayısı [150]: " MAX_FILE
MAX_FILE="${MAX_FILE:-150}"
read -p "Console.log yasaklansın mı? (true/false) [true]: " NO_CONSOLE
NO_CONSOLE="${NO_CONSOLE:-true}"
read -p "Main branch adı [main]: " MAIN_BRANCH
MAIN_BRANCH="${MAIN_BRANCH:-main}"
read -p "Agent çıktı dili (tr/en) [tr]: " LANG_UI
LANG_UI="${LANG_UI:-tr}"

# project.conf oluştur
cat > "$HARNESS_DIR/project.conf" << CONF
# Claude Harness — Project Configuration
# Yeni projeye taşırken SADECE bu dosyayı değiştir.

PROJECT_NAME="$PROJECT_NAME"
PROJECT_LANG="$PROJECT_LANG"
PROJECT_FRAMEWORK="$PROJECT_FRAMEWORK"
PROJECT_DESCRIPTION="$PROJECT_DESC"

CMD_TEST="$CMD_TEST"
CMD_LINT="$CMD_LINT"
CMD_TYPECHECK="$CMD_TYPECHECK"
CMD_DEV="$CMD_DEV"

DIR_SRC="$DIR_SRC"
FILE_EXT_SOURCE="$FILE_EXT"
FILE_GLOB_SOURCE="*.{$FILE_EXT}"

MAX_FUNCTION_LINES=$MAX_FUNC
MAX_FILE_LINES=$MAX_FILE
NO_CONSOLE_LOG=$NO_CONSOLE
CONSOLE_LOG_PATTERN="console\."

COMMIT_FORMAT="conventional"
BRANCH_STRATEGY="feature"
MAIN_BRANCH="$MAIN_BRANCH"
PROTECTED_BRANCHES="$MAIN_BRANCH"

LANG_UI="$LANG_UI"
CONF

echo ""
echo "project.conf olusturuldu."
echo ""
echo "============================================"
echo "  Kurulum Tamamlandi!"
echo "============================================"
echo ""
echo "Sonraki adimlar:"
echo "  1. .claude/agents/ altindaki agent .md dosyalarini kopyala"
echo "  2. .claude/skills/ altindaki skill dosyalarini kopyala"
echo "  3. .claude/hooks/ altindaki hook scriptlerini kopyala"
echo "  4. rules/ altina projeye ozel kurallar ekle"
echo "  5. CLAUDE.md'yi projeye uyarla"
echo ""
echo "Veya tum dosyalari bir template repo'dan kopyala:"
echo "  cp -r <harness-template>/.claude/agents/ $HARNESS_DIR/agents/"
echo "  cp -r <harness-template>/.claude/skills/ $HARNESS_DIR/skills/"
echo "  cp -r <harness-template>/.claude/hooks/ $HARNESS_DIR/hooks/"
echo ""
