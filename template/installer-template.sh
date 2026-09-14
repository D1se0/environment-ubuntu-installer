#!/usr/bin/env bash
###############################################################################
#  whitehatSO installer — auto-deploys the full whitehatSO environment
#  Target: Ubuntu 25.10 (apt-based). Run:  sudo bash install-whitehatso.sh
#  Non-interactive: WHS_ASSUME_YES=1 WHS_USER=<name> sudo -E bash install-whitehatso.sh
###############################################################################
set -euo pipefail

WHS_VERSION="1.0.0"
WHS_TAG="\033[38;2;224;48;60m[whitehatSO]\033[0m"
log(){ echo -e "$WHS_TAG $*"; }
die(){ echo -e "$WHS_TAG \033[31mERROR:\033[0m $*" >&2; exit 1; }
ask(){ # ask "question" default(y|n) -> returns 0 for yes
  [ "${WHS_ASSUME_YES:-0}" = "1" ] && return 0
  local a; read -r -p "$1 [$2] " a </dev/tty || return 1
  [ -z "$a" ] && a="$2"; [[ "$a" =~ ^[sSyY] ]]
}

[ "$(id -u)" -eq 0 ] || die "Run as root: sudo bash $0"

PAYLOAD_B64="__WHS_PAYLOAD_B64__"
WORK="$(mktemp -d /tmp/whs-install.XXXXXX)"
trap 'rm -rf "$WORK"' EXIT

# ---------------------------------------------------------------------------
# 0. Unpack embedded payload
# ---------------------------------------------------------------------------
log "Unpacking whitehatSO payload v$WHS_VERSION..."
printf '%s' "$PAYLOAD_B64" | base64 -d | tar xzf - -C "$WORK"
[ -d "$WORK/home/.config/bspwm" ] || die "payload corrupt"

# ---------------------------------------------------------------------------
# 1. Detect environment
# ---------------------------------------------------------------------------
. /etc/os-release
log "Host: ${PRETTY_NAME:-unknown} | kernel $(uname -r)"
if [ "${VERSION_ID:-}" != "25.10" ]; then
  ask "This was built for Ubuntu 25.10. Continue anyway?" n || die "Aborted."
fi

# ---------------------------------------------------------------------------
# 2. Questions
# ---------------------------------------------------------------------------
DEFAULT_USER="${SUDO_USER:-$(logname 2>/dev/null || echo '')}"
[ -n "$DEFAULT_USER" ] || DEFAULT_USER=""
if [ "${WHS_ASSUME_YES:-0}" != "1" ]; then
  read -r -p "Username to configure [${DEFAULT_USER:-required}]: " WHS_INPUT_USER </dev/tty || true
fi
WHS_USER="${WHS_USER:-${WHS_INPUT_USER:-$DEFAULT_USER}}"
[ -n "$WHS_USER" ] && id "$WHS_USER" &>/dev/null || die "user '$WHS_USER' does not exist"
WHS_HOME=$(getent passwd "$WHS_USER" | cut -d: -f6)
log "Configuring user: $WHS_USER ($WHS_HOME)"

ask "Install base packages (Xorg, lightdm, bspwm, kitty, polybar, fonts...)?" y && WHS_PKGS=1 || WHS_PKGS=0
ask "Performance: zram, sysctl tuning, service debloat, telemetry purge (Firefox snap replaced by native .deb)?" y && WHS_PERF=1 || WHS_PERF=0
ask "Themed lightdm login (Yaru-red + custom background)?" y && WHS_LOGIN=1 || WHS_LOGIN=0
ask "Apply VMware fixes (modesetting+RandR, autofit, clipboard)?" y && WHS_VMWARE=1 || WHS_VMWARE=0
ask "Apply prompt (Ubuntu logo / skull / path / check) to root too?" y && WHS_ROOT=1 || WHS_ROOT=0

# ---------------------------------------------------------------------------
# 3. Packages
# ---------------------------------------------------------------------------
if [ "$WHS_PKGS" = "1" ]; then
  log "Installing packages..."
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y -qq --no-install-recommends \
    bspwm sxhkd picom polybar kitty rofi feh dunst fastfetch \
    xorg xserver-xorg-core xserver-xorg-input-all xserver-xorg-video-all xinit xauth \
    lightdm lightdm-gtk-greeter accountsservice \
    x11-xserver-utils xclip wmctrl eza bat jq curl wget \
    scrot imagemagick flameshot i3lock \
    network-manager network-manager-gnome \
    systemd-zram-generator fontconfig fonts-liberation >/dev/null
  log "Packages installed."
fi

# ---------------------------------------------------------------------------
# 4. User configuration
# ---------------------------------------------------------------------------
log "Deploying configs to $WHS_HOME..."
BK="$WHS_HOME/.config/backups/whitehatso-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BK" "$WHS_HOME/.config"
for d in bspwm sxhkd picom polybar kitty rofi fastfetch dunst; do
  [ -e "$WHS_HOME/.config/$d" ] && { mv "$WHS_HOME/.config/$d" "$BK/" 2>/dev/null || true; }
  cp -r "$WORK/home/.config/$d" "$WHS_HOME/.config/"
done
# bashrc: backup + rebuild with prompt block
[ -f "$WHS_HOME/.bashrc" ] && cp "$WHS_HOME/.bashrc" "$BK/dot-bashrc"
cat "$WORK/home/dot-bashrc" > "$WHS_HOME/.bashrc"
# Nerd fonts
mkdir -p /usr/local/share/fonts/JetBrainsMonoNerd
if [ ! -d /usr/local/share/fonts/JetBrainsMonoNerd ] || [ -z "$(ls -A /usr/local/share/fonts/JetBrainsMonoNerd 2>/dev/null)" ]; then
  log "Downloading JetBrainsMono Nerd Font..."
  curl -fsSL -o /tmp/JB.zip https://github.com/ryanoasis/nerd-fonts/releases/latest/download/JetBrainsMono.zip \
    && unzip -oq /tmp/JB.zip -d /usr/local/share/fonts/JetBrainsMonoNerd && rm -f /tmp/JB.zip \
    || log "WARN: font download failed (offline?)"
fi
fc-cache -f >/dev/null 2>&1 || true
chown -R "$WHS_USER:$WHS_USER" "$WHS_HOME/.config" "$WHS_HOME/.bashrc"

# scripts
install -m 755 "$WORK"/system/usr-local-bin/* /usr/local/bin/

# session entry
install -m 644 "$WORK/system/etc/whitehatso-bspwm.desktop" /usr/share/xsessions/ 2>/dev/null || true
# wallpapers + login background
mkdir -p /usr/share/backgrounds
[ -d "$WORK/system/etc/whitehatso-wallpapers" ] && cp -r "$WORK/system/etc/whitehatso-wallpapers" /usr/share/backgrounds/whitehatso
[ -f "$WORK/system/etc/whitehatso-login.png" ] && install -m 644 "$WORK/system/etc/whitehatso-login.png" /usr/share/backgrounds/whitehatso-login.png

# ---------------------------------------------------------------------------
# 5. Performance
# ---------------------------------------------------------------------------
if [ "$WHS_PERF" = "1" ]; then
  log "Applying performance tuning..."
  install -m 644 "$WORK/system/etc/99-whitehatso.conf" /etc/sysctl.d/ 2>/dev/null || true
  sysctl --system >/dev/null 2>&1 || true
  install -m 644 "$WORK/system/etc/60-whitehatso-iosched.rules" /etc/udev/rules.d/ 2>/dev/null || true
  [ -f "$WORK/system/etc/zram-generator.conf" ] && install -m 644 "$WORK/system/etc/zram-generator.conf" /etc/systemd/zram-generator.conf
  # journald cap
  sed -i 's/^#\?SystemMaxUse=.*/SystemMaxUse=150M/' /etc/systemd/journald.conf
  grep -q "^SystemMaxUse" /etc/systemd/journald.conf || echo "SystemMaxUse=150M" >> /etc/systemd/journald.conf
  systemctl restart systemd-journald 2>/dev/null || true
  systemctl enable --now systemd-zram-setup@zram0 2>/dev/null || systemctl restart systemd-zram-setup@zram0 2>/dev/null || true
  systemctl enable --now earlyoom 2>/dev/null || true
  apt-get install -y -qq earlyoom xclip >/dev/null 2>&1 || true

  # --- debloat: telemetry + services. PROTECTED LIST: never removed ---
  log "Disabling telemetry and unneeded services..."
  PROTECTED='xorg|xserver-xorg|xinit|xauth|lightdm|gdm3|sddm|bspwm|sxhkd|kitty|polybar|picom|xserver-xorg-video-vmware|xserver-xorg-input|mesa|libgl1|ubuntu-desktop|ubuntu-minimal'
  PURGE_LIST="whoopsie whoopsie-preferences apport apport-gtk apport-symptoms python3-apport ubuntu-report ubuntu-insights unattended-upgrades snapd squashfs-tools"
  SAFE=""
  for p in $PURGE_LIST; do
    dpkg -l "$p" 2>/dev/null | grep -q "^ii" || continue
    if echo "$p" | grep -qE "^($PROTECTED)"; then
      log "  PROTECT: $p would be purged but is whitelisted - skipping"; continue
    fi
    SAFE="$SAFE $p"
  done
  [ -n "$SAFE" ] && { apt-get purge -y -qq $SAFE >/dev/null 2>&1 || true; apt-get autoremove -y -qq --purge >/dev/null 2>&1 || true; }
  # verify X survived (hard guarantee)
  dpkg -l xserver-xorg-core >/dev/null 2>&1 || apt-get install -y -qq xserver-xorg-core xorg >/dev/null
  # on-demand services
  systemctl disable --now bettercap.service tor.service ModemManager cups cups-browsed avahi-daemon cloud-init power-profiles-daemon bluetooth 2>/dev/null || true
  systemctl mask cloud-init 2>/dev/null || true
  log "Debloat done."
fi

# ---------------------------------------------------------------------------
# 6. Firefox native .deb (if no firefox present)
# ---------------------------------------------------------------------------
if ! command -v firefox >/dev/null 2>&1; then
  ask "Firefox not found. Install native Mozilla .deb?" y && {
    install -d -m 0755 /etc/apt/keyrings
    curl -fsSL https://packages.mozilla.org/apt/repo-signing-key.gpg -o /etc/apt/keyrings/packages.mozilla.org.asc 2>/dev/null || true
    echo "deb [signed-by=/etc/apt/keyrings/packages.mozilla.org.asc] https://packages.mozilla.org/apt mozilla main" > /etc/apt/sources.list.d/mozilla.list
    echo 'Package: * Pin: origin packages.mozilla.org Pin-Priority: 1000' > /etc/apt/preferences.d/mozilla
    apt-get update -qq && apt-get install -y -qq firefox >/dev/null && log "Firefox .deb installed." || log "WARN: firefox install failed"
  } || true
fi

# ---------------------------------------------------------------------------
# 7. Login manager
# ---------------------------------------------------------------------------
if [ "$WHS_LOGIN" = "1" ]; then
  log "Configuring lightdm greeter..."
  install -m 644 "$WORK/system/etc/50-whitehatso.conf" /etc/lightdm/lightdm.conf.d/ 2>/dev/null || { mkdir -p /etc/lightdm/lightdm.conf.d; install -m 644 "$WORK/system/etc/50-whitehatso.conf" /etc/lightdm/lightdm.conf.d/; }
  [ -f "$WORK/system/etc/lightdm-gtk-greeter.conf" ] && install -m 644 "$WORK/system/etc/lightdm-gtk-greeter.conf" /etc/lightdm/lightdm-gtk-greeter.conf
  echo /usr/sbin/lightdm > /etc/X11/default-display-manager
  systemctl enable lightdm 2>/dev/null || true
  mkdir -p /var/lib/lightdm/data && chown lightdm:lightdm /var/lib/lightdm/data
  log "lightdm set as display manager."
fi

# ---------------------------------------------------------------------------
# 8. VMware guest fixes
# ---------------------------------------------------------------------------
if [ "$WHS_VMWARE" = "1" ]; then
  log "Applying VMware guest fixes..."
  systemd-detect-virt 2>/dev/null | grep -qi vmware || log "  NOTE: not running inside VMware (applying anyway for portability)."
  apt-get install -y -qq open-vm-tools open-vm-tools-desktop xserver-xorg-video-vmware >/dev/null 2>&1 || true
  install -m 644 "$WORK/system/etc/10-vmware-modesetting.conf" /etc/X11/xorg.conf.d/ 2>/dev/null || { mkdir -p /etc/X11/xorg.conf.d; install -m 644 "$WORK/system/etc/10-vmware-modesetting.conf" /etc/X11/xorg.conf.d/; }
  log "VMware fixes applied (modesetting+RandR, autofit via bspwmrc)."
fi

# ---------------------------------------------------------------------------
# 9. Root prompt
# ---------------------------------------------------------------------------
if [ "$WHS_ROOT" = "1" ]; then
  log "Applying prompt to /root/.bashrc..."
  cp /root/.bashrc /root/.bashrc.bak-whitehatso-$(date +%Y%m%d) 2>/dev/null || true
  cat "$WORK/home/dot-bashrc" > /root/.bashrc
fi

# ---------------------------------------------------------------------------
# 10. Summary
# ---------------------------------------------------------------------------
systemctl daemon-reload 2>/dev/null || true
log "\033[32mDone.\033[0m whitehatSO v$WHS_VERSION deployed for user '$WHS_USER'."
log "Backups: $BK"
log "Next: reboot (or log out) and pick 'whitehatSO (bspwm)' in the login menu."
log "Verify with:  whs-status"
