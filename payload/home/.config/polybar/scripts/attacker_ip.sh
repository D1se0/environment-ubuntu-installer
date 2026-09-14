#!/usr/bin/env bash
FILE="$HOME/.config/whitehatso/attacker_ip"
mkdir -p "$(dirname "$FILE")"
if [[ -s "$FILE" ]]; then
  printf ' ATK %s\n' "$(cat "$FILE")"
else
  printf ' ATK --\n'
fi
