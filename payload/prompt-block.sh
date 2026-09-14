WHS_UBUNTU=$'\uf31b'
WHS_SKULL=$'\u2620'
WHS_OK=$'\u2713'
WHS_KO=$'\u2717'
WHS_BAR=$'\u2502'

__whs_prompt() {
    local st=$?
    local mark badge sym
    if (( st == 0 )); then
        mark="\[\e[38;2;63;185;80m\]${WHS_OK}"
    else
        mark="\[\e[38;2;224;48;60m\]${WHS_KO}"
    fi
    if [[ $EUID -eq 0 ]]; then
        badge=" \[\e[38;2;224;48;60m\]${WHS_SKULL}"
        sym='#'
    else
        badge=""
        sym='$'
    fi
    PS1="\[\e[38;2;233;84;32m\]${WHS_UBUNTU}${badge} \[\e[38;2;58;58;61m\]${WHS_BAR}\[\e[0m\] \[\e[38;2;154;154;154m\]\w\[\e[0m\] ${mark}\[\e[0m\] \[\e[38;2;224;48;60m\]${sym}\[\e[0m\] "
}
PROMPT_COMMAND=__whs_prompt

# Terminales con protocolo kitty (ptyxis, ghostty...): si llega la secuencia de
# Ctrl+W como escape (basura tipo "119;5u" o "9;9u"), ejecutar el dialogo Si/No
bind -x '"\e[119;5u": /usr/local/bin/whitehatso-close'  2>/dev/null
bind -x '"\e[9;9u":   /usr/local/bin/whitehatso-close'  2>/dev/null
bind -x '"\e[119;7u": /usr/local/bin/whitehatso-close'  2>/dev/null

alias ls='eza --icons --group-directories-first'
alias ll='eza -lh --icons --group-directories-first'
alias la='eza -lah --icons --group-directories-first'
alias lt='eza --icons --tree --level=2'
command -v batcat >/dev/null && alias cat='batcat --paging=never --style=plain'
# <<< whitehatSO prompt <<<
