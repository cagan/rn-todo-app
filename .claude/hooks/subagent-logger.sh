#!/bin/bash
# Subagent lifecycle logger — SubagentStart ve SubagentStop event'lerini loglar

INPUT=$(cat)
EVENT=$(echo "$INPUT" | jq -r '.hook_event_name')
AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // "unknown"')
AGENT_ID=$(echo "$INPUT" | jq -r '.agent_id // "unknown"')
TIMESTAMP=$(date "+%H:%M:%S")
LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/tmp/subagent-log.txt"

mkdir -p "$(dirname "$LOG_FILE")"

if [ "$EVENT" = "SubagentStart" ]; then
  echo "[$TIMESTAMP] ▶ START  @$AGENT_TYPE (ID: $AGENT_ID)" >> "$LOG_FILE"
elif [ "$EVENT" = "SubagentStop" ]; then
  LAST_MSG=$(echo "$INPUT" | jq -r '.last_assistant_message // "no output"' | head -c 120)
  echo "[$TIMESTAMP] ■ STOP   @$AGENT_TYPE (ID: $AGENT_ID) → $LAST_MSG" >> "$LOG_FILE"
fi

exit 0
