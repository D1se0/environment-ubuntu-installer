#!/usr/bin/env bash
ip=$(ip -4 addr show tun0 2>/dev/null | awk '/inet /{print $2}' | cut -d/ -f1)
if [[ -n "$ip" ]]; then
  printf ' HTB %s\n' "$ip"
else
  printf ' HTB --\n'
fi
