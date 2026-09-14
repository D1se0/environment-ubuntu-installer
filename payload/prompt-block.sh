WHS_UBUNTU=$'\uf31b'
WHS_SKULL=$'\u2620'
WHS_OK=$'\u2713'
WHS_KO=$'\u2717'
WHS_BAR=$'\u2502'

__whs_prompt() {
    local st=$?
    local mark badge sym ucol
    if (( st == 0 )); then
        mark="\[\e[38;2;63;185;80m\]${WHS_OK}"
    else
        mark="\[\e[38;2;224;48;60m\]${WHS_KO}"
    fi
    if [[ $EUID -eq 0 ]]; then
        badge=" \[\e[38;2;224;48;60m\]${WHS_SKULL}"
        sym='#'
        ucol='224;48;60'
    else
        badge=""
        sym='$'
        ucol='207;207;207'
    fi
    PS1="\[\e[38;2;233;84;32m\]${WHS_UBUNTU}${badge} \[\e[38;2;58;58;61m\]${WHS_BAR}\[\e[0m\] \[\e[38;2;${ucol}m\]\u\[\e[0m\] \[\e[38;2;154;154;154m\]\w\[\e[0m\] ${mark}\[\e[0m\] \[\e[38;2;224;48;60m\]${sym}\[\e[0m\] "
}
PROMPT_COMMAND=__whs_prompt

# Terminales con protocolo kitty: si el emulador deja escapar Ctrl+W como
# secuencia CSI-u en vez de ^W, ejecutar el dialogo Si/No. Se cubren todas las
# codificaciones posibles (119='w', 87='W', 23=C0 de ^W, 9;9u legacy).
bind -x '"\e[119;5u": /usr/local/bin/whitehatso-close'  2>/dev/null
bind -x '"\e[87;5u":  /usr/local/bin/whitehatso-close'  2>/dev/null
bind -x '"\e[23;5u":  /usr/local/bin/whitehatso-close'  2>/dev/null
bind -x '"\e[9;9u":   /usr/local/bin/whitehatso-close'  2>/dev/null
bind -x '"\e[119;7u": /usr/local/bin/whitehatso-close'  2>/dev/null

alias ls='eza --icons --group-directories-first'
alias ll='eza -lh --icons --group-directories-first'
alias la='eza -lah --icons --group-directories-first'
alias lt='eza --icons --tree --level=2'
command -v batcat >/dev/null && alias cat='batcat --paging=never --style=plain'
# <<< whitehatSO prompt <<<
