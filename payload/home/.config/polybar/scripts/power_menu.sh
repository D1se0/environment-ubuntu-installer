#!/usr/bin/env bash
opt=$(printf 'Bloquear\nSuspender\nReiniciar\nApagar\nCancelar' | rofi -dmenu -p 'whitehatSO' -lines 5)
case "$opt" in
  Bloquear) /usr/local/bin/whitehatso-lock ;;
  Suspender)
    confirm=$(rofi -dmenu -p '¿Suspender? (yes/no)' -lines 0)
    [[ "$confirm" == "yes" ]] && systemctl suspend
    ;;
  Reiniciar)
    confirm=$(rofi -dmenu -p '¿Reiniciar? (yes/no)' -lines 0)
    [[ "$confirm" == "yes" ]] && systemctl reboot
    ;;
  Apagar)
    confirm=$(rofi -dmenu -p '¿Apagar? (yes/no)' -lines 0)
    [[ "$confirm" == "yes" ]] && systemctl poweroff
    ;;
esac
