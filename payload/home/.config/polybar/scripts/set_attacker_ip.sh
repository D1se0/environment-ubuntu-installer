#!/usr/bin/env bash
FILE="$HOME/.config/whitehatso/attacker_ip"
mkdir -p "$(dirname "$FILE")"
current="$(cat "$FILE" 2>/dev/null)"
new="$(rofi -dmenu -p 'Attacker IP' -lines 0 ${current:+-mesg "actual: $current"})"
[[ -n "$new" ]] && printf '%s' "$new" > "$FILE"
