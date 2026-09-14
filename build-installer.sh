#!/usr/bin/env bash
# build-installer.sh — regenerates the self-contained install-whitehatso.sh
# from the payload/ directory and the installer template.
# Uso: bash build-installer.sh   (desde la raíz del repo)
set -euo pipefail
cd "$(dirname "$0")"

TEMPLATE="template/installer-template.sh"
OUT="install-whitehatso.sh"

[ -f "$TEMPLATE" ] || { echo "ERROR: falta $TEMPLATE" >&2; exit 1; }
[ -d "payload" ]   || { echo "ERROR: falta payload/"   >&2; exit 1; }

echo "[*] Empaquetando payload/..."
TAR=$(mktemp)
B64=$(mktemp)
trap 'rm -f "$TAR" "$B64"' EXIT

tar czf "$TAR" -C payload .
gzip -t "$TAR"
base64 -w 76 "$TAR" > "$B64"
echo "[*] Payload: $(gzip -l "$TAR" | tail -1 | awk '{print $2}') bytes -> $(wc -c < "$B64") b64"

echo "[*] Generando $OUT..."
python3 - "$TEMPLATE" "$B64" "$OUT" <<'PY'
import sys
tpl_path, b64_path, out_path = sys.argv[1:4]
tpl = open(tpl_path).read()
b64 = open(b64_path).read().strip()
assert '__WHS_PAYLOAD_B64__' in tpl, "placeholder missing in template"
open(out_path, 'w').write(tpl.replace('__WHS_PAYLOAD_B64__', b64, 1))
print(f"[+] {out_path} generado ({len(tpl) + len(b64)} bytes aprox)")
PY

bash -n "$OUT" && echo "[+] Sintaxis OK — instalador listo para distribuir."
