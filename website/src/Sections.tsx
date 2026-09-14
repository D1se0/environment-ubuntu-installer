import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import {
  Terminal as TerminalIcon,
  LayoutGrid,
  Zap,
  Shield,
  Github,
  ChevronRight,
  Copy,
  Check,
  Skull,
  Sparkles,
  Radio,
  Lock,
  Keyboard,
  Crosshair,
  Gauge,
  Package,
  AppWindow,
  HelpCircle
} from 'lucide-react'
import { Reveal, CopyBlock, Section, Counter, Typewriter, Terminal } from './components/ui'

// ================= NAV =================

const NAV = [
  ['#features', 'Sistema'],
  ['#prompt', 'Prompt'],
  ['#instalar', 'Instalar'],
  ['#atajos', 'Atajos'],
  ['#herramientas', 'Herramientas'],
  ['#faq', 'FAQ']
]

function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    NAV.forEach(([id]) => {
      const el = document.querySelector(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  return active
}

function Nav() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const active = useActiveSection()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', on)
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <motion.nav
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-base/85 backdrop-blur-xl border-b border-edge/80 shadow-glass' : 'bg-transparent'
      }`}
    >
      {/* barra de progreso de scroll */}
      <motion.div
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-whs-reddark via-whs-red to-whs-redbright"
      />
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-mono font-bold text-white flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-md bg-whs-red/15 border border-whs-red/40 flex items-center justify-center text-whs-red text-sm group-hover:shadow-glow-red transition-shadow">
            W
          </span>
          whitehat<span className="text-whs-red">SO</span>
          <span className="text-whs-red animate-blink">_</span>
        </a>
        <div className="hidden md:flex gap-1 text-sm">
          {NAV.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md font-mono text-[13px] transition-colors ${
                active === href ? 'text-whs-red bg-whs-red/10' : 'text-whs-grey hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
        <a
          href="https://github.com/D1se0/environment-ubuntu-installer"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-xs font-mono px-3.5 py-2 border border-whs-red/50 text-whs-red rounded-md hover:bg-whs-red hover:text-white hover:shadow-glow-red transition-all"
        >
          <Github size={14} /> v1.0.0
        </a>
      </div>
    </motion.nav>
  )
}

// ================= HERO =================

function Hero() {
  return (
    <header className="relative overflow-hidden">
      {/* fondo: grid en deriva + halos */}
      <div className="absolute inset-0 grid-bg animate-grid-drift opacity-70" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-whs-red/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-60 -right-40 w-96 h-96 bg-whs-orange/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-36 pb-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="chip mb-7 font-mono"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-whs-green animate-pulse" />
              root@whitehatso:~# <Typewriter phrases={['ethical hacking environment', 'bspwm + kitty + polybar', 'zero telemetry', 'tuned for VMs']} className="text-whs-ink" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-white leading-[1.02] font-sans"
            >
              whitehat
              <span className="text-whs-red text-glow-red">SO</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg text-whs-grey leading-relaxed max-w-xl"
            >
              Ubuntu 25.10 transformado en un <span className="text-white font-medium">laboratorio de ethical hacking</span>{' '}
              con estética terminal: tiling puro, rendimiento afinado con zram, telemetría{' '}
              <span className="text-whs-red">cero</span> y cada atajo pensado para vivir en la consola.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-9 flex flex-wrap gap-3.5"
            >
              <a
                href="#instalar"
                className="group px-6 py-3.5 bg-whs-red text-white font-semibold rounded-lg hover:bg-whs-redbright transition-all shadow-glow-red hover:shadow-glow-red-lg flex items-center gap-2"
              >
                <TerminalIcon size={17} />
                Instalar ahora
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#atajos"
                className="px-6 py-3.5 border border-edge rounded-lg text-whs-ink hover:border-whs-red/60 hover:text-whs-red hover:bg-whs-red/5 transition-all flex items-center gap-2"
              >
                <Keyboard size={17} /> Ver atajos
              </a>
              <a
                href="https://github.com/D1se0/environment-ubuntu-installer/releases/latest"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 border border-edge rounded-lg text-whs-ink hover:border-whs-red/60 hover:text-whs-red hover:bg-whs-red/5 transition-all flex items-center gap-2"
              >
                <Package size={17} /> Descargar
              </a>
            </motion.div>

            {/* badges flotantes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mt-10 flex flex-wrap gap-2.5"
            >
              {['Ubuntu 25.10', 'bspwm', 'kitty', 'polybar', 'zram zstd', 'earlyoom'].map((b, i) => (
                <motion.span
                  key={b}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
                  className="chip font-mono"
                >
                  {b}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-whs-red/5 blur-3xl rounded-full pointer-events-none" />
            <Terminal />
          </div>
        </div>
      </div>
    </header>
  )
}

// ================= STATS BAND =================

function Stats() {
  const items = [
    { icon: Gauge, to: 850, suffix: ' Mi', label: 'RAM en reposo', sub: 'VM 4 vCPU / 5,3 GiB' },
    { icon: Shield, to: 0, suffix: '', label: 'paquetes de telemetría', sub: 'whoopsie · apport · insights' },
    { icon: Zap, to: 5, suffix: '.3 GB', label: 'zram zstd activo', sub: 'swappiness 10' },
    { icon: Keyboard, to: 15, suffix: '+', label: 'atajos productivos', sub: 'sxhkd + kitty + bash' }
  ]
  return (
    <div className="border-y border-edge/70 bg-panel/30">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-whs-red/10 border border-whs-red/25 flex items-center justify-center text-whs-red shrink-0">
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white font-sans">
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className="text-sm text-whs-ink">{s.label}</p>
                <p className="text-xs text-whs-grey mt-0.5">{s.sub}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

// ================= FEATURES =================

const FEATURES = [
  {
    icon: LayoutGrid,
    title: 'bspwm + sxhkd',
    desc: 'Tiling binario, sin dependencias ocultas. Cada atajo vive en un sxhkdrc legible y editable al instante.',
    tag: 'window manager'
  },
  {
    icon: TerminalIcon,
    title: 'kitty con identidad',
    desc: 'Paleta roja/gris, transparencia 0.92, pestañas powerline y Ctrl+W con confirmación Si/No real.',
    tag: 'terminal'
  },
  {
    icon: Skull,
    title: 'Prompt con calavera',
    desc: 'Logo Ubuntu · ruta absoluta · ✓ verde si el comando fue bien, ✗ rojo si falló · ☠ rojo y # en modo root.',
    tag: 'bash'
  },
  {
    icon: Gauge,
    title: 'Rendimiento quirúrgico',
    desc: 'zram zstd, swappiness 10, journald limitado, earlyoom anti-congelamientos, I/O scheduler none en VM.',
    tag: 'performance'
  },
  {
    icon: Radio,
    title: 'polybar operativa',
    desc: 'Módulo ATK para marcar tu IP de atacante con settarget, control bettercap/tor y menú de poder rojo.',
    tag: 'status bar'
  },
  {
    icon: AppWindow,
    title: 'Login con estilo',
    desc: 'lightdm temático: fondo generativo rojo, Yaru-red-dark, JetBrains Mono y sesión whitehatSO por defecto.',
    tag: 'greeter'
  }
]

function Features() {
  return (
    <Section
      id="features"
      tag="el sistema"
      title={
        <>
          Qué es whitehat<span className="text-whs-red">SO</span>
        </>
      }
      subtitle="No es una distro nueva: es tu Ubuntu convertido en herramienta. El instalador despliega un gestor de ventanas tiling, una terminal con identidad propia, un panel vivo y una capa de rendimiento que elimina todo lo que Ubuntu trae de fábrica y no necesitas."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.07}>
            <div className="card h-full group relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2.5 py-1 text-[10px] font-mono text-whs-grey/60 bg-base/60 border-b border-l border-edge rounded-bl-lg">
                {f.tag}
              </div>
              <div className="w-11 h-11 rounded-lg bg-whs-red/10 border border-whs-red/30 flex items-center justify-center text-whs-red mb-4 group-hover:shadow-glow-red group-hover:scale-105 transition-all">
                <f.icon size={20} />
              </div>
              <h3 className="text-white font-bold mb-2 font-sans">{f.title}</h3>
              <p className="text-sm text-whs-grey leading-relaxed">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

// ================= PROMPT ANATOMY =================

function PromptAnatomy() {
  const parts = [
    { sym: '◈', name: 'Logo Ubuntu', desc: 'Glifo Nerd Font en naranja Ubuntu (#e95420). Siempre visible.', color: 'text-whs-orange' },
    { sym: '☠', name: 'Calavera (root)', desc: 'Solo aparece como root (sudo -i / su -). Rojo whitehat #e0303c, glifo Unicode estándar ☠.', color: 'text-whs-red' },
    { sym: '│', name: 'Separador', desc: 'Barra gris que separa identidad y ruta.', color: 'text-[#3a3a3d]' },
    { sym: '~', name: 'Ruta absoluta', desc: 'Siempre la ruta completa donde estás, sin abreviar.', color: 'text-whs-grey' },
    { sym: '✓', name: 'Estado del comando', desc: '✓ verde (#3fb850) si el anterior terminó bien · ✗ rojo si falló. Se actualiza en cada prompt.', color: 'text-whs-green' },
    { sym: '$', name: 'Símbolo', desc: '$ como usuario · # cuando eres root (acompañado de la calavera).', color: 'text-whs-red' }
  ]
  const [active, setActive] = useState(0)
  return (
    <Section id="prompt" tag="identidad" title="Anatomía del prompt" subtitle="Cada elemento del prompt tiene un propósito. Haz click en cada parte para ver qué significa.">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Reveal>
          <div className="rounded-2xl border border-edge bg-black/80 p-8 font-mono text-xl md:text-2xl shadow-glass select-none">
            <div className="flex items-center flex-wrap gap-x-3 gap-y-2">
              {parts.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setActive(i)}
                  className={`transition-all hover:scale-110 ${p.color} ${active === i ? 'drop-shadow-[0_0_10px_currentColor]' : 'opacity-80'}`}
                >
                  {p.sym}
                </button>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-edge/60">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-white font-bold text-base font-sans">{parts[active].name}</p>
                  <p className="text-whs-grey text-sm mt-1.5 font-sans">{parts[active].desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-4">
            <CopyBlock
              label="ejemplo real en kitty"
              text={` ◈ ☠  │ /etc ✓ #   ← root tras un fallo
 ◈    │ ~/labos/htb ✓ $  ← usuario, todo OK
 ◈    │ /var/www ✗ $     ← último comando fallido`}
            />
            <div className="card">
              <div className="flex items-center gap-2.5 mb-3">
                <Sparkles size={16} className="text-whs-red" />
                <h4 className="text-white font-bold font-sans">Ctrl+W con confirmación</h4>
              </div>
              <p className="text-sm text-whs-grey leading-relaxed">
                Cerrar ventanas pide siempre <b className="text-white">Si / No</b> con rofi flotante y centrado. Funciona en
                kitty (mapeo interno), en sxhkd (system-wide) y hasta en terminales con protocolo kitty (ptyxis, ghostty)
                vía binds de bash que interpretan la secuencia <code className="text-whs-red">9;9u</code>.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

// ================= INSTALL (tabs) =================

function Install() {
  const [tab, setTab] = useState(0)
  const tabs = [
    {
      id: 'interactivo',
      label: 'Interactivo',
      icon: TerminalIcon,
      body: (
        <>
          <p className="text-sm text-whs-grey mb-4 leading-relaxed">
            El instalador es <span className="text-white">autocontenido</span>: lleva incrustados todos los configs, scripts y
            wallpapers. Te irá preguntando: usuario, paquetes base, tuning de rendimiento, login temático, fixes de VMware y
            prompt de root.
          </p>
          <CopyBlock
            label="instalación paso a paso"
            text={`curl -fsSL https://raw.githubusercontent.com/D1se0/environment-ubuntu-installer/main/install-whitehatso.sh -o install-whitehatso.sh
chmod +x install-whitehatso.sh
sudo bash install-whitehatso.sh`}
          />
        </>
      )
    },
    {
      id: 'desatendido',
      label: 'Desatendido',
      icon: Zap,
      body: (
        <>
          <p className="text-sm text-whs-grey mb-4 leading-relaxed">
            Para scripting, chroots (Cubic) o replicar en muchas máquinas. Cero preguntas: decide con variables de entorno.
          </p>
          <CopyBlock
            label="modo desatendido"
            text={`WHS_ASSUME_YES=1 WHS_USER=tu_usuario \\
  sudo -E bash install-whitehatso.sh`}
          />
        </>
      )
    },
    {
      id: 'fuente',
      label: 'Desde fuente',
      icon: Package,
      body: (
        <>
          <p className="text-sm text-whs-grey mb-4 leading-relaxed">
            Clona el repo y regenera el instalador desde <code className="text-whs-red">payload/</code> (la fuente de verdad
            de todos los configs) con un solo comando.
          </p>
          <CopyBlock
            label="build desde el repo"
            text={`git clone https://github.com/D1se0/environment-ubuntu-installer.git
cd environment-ubuntu-installer
bash build-installer.sh
sudo bash install-whitehatso.sh`}
          />
        </>
      )
    }
  ]

  return (
    <Section id="instalar" tag="despliegue" title="Instalación" subtitle="Tres caminos, mismo resultado. El script respalda tus configs en ~/.config/backups/ y nunca desinstala paquetes críticos (lista protegida integrada).">
      <Reveal>
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setTab(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-mono border transition-all ${
                tab === i
                  ? 'bg-whs-red/15 border-whs-red/60 text-whs-red shadow-glow-red'
                  : 'border-edge text-whs-grey hover:text-white hover:border-whs-grey/40'
              }`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-edge bg-panel/40 p-6 md:p-8"
          >
            {tabs[tab].body}
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </Section>
  )
}

// ================= KEYBINDS =================

const KEYS = [
  { k: ['super', 'Return'], d: 'Abrir kitty' },
  { k: ['super / ctrl', 'space'], d: 'Rofi launcher (apps)' },
  { k: ['ctrl', 'w'], d: 'Cerrar ventana con confirmación Si/No' },
  { k: ['super', 'shift', 'q'], d: 'Cerrar ventana sin confirmar' },
  { k: ['super', '1…5'], d: 'Ir al escritorio 1–5' },
  { k: ['super', 'shift', '1…5'], d: 'Mandar ventana al escritorio' },
  { k: ['super', 'h/j/k/l'], d: 'Mover el foco (vim-style)' },
  { k: ['super', 'shift', 'h/j/k/l'], d: 'Intercambiar ventanas' },
  { k: ['super', 'ctrl', 'h/j/k/l'], d: 'Redimensionar ventanas' },
  { k: ['super', 'f'], d: 'Pantalla completa (toggle)' },
  { k: ['super', 'shift', 'space'], d: 'Ventana flotante (toggle)' },
  { k: ['super', 'shift', 'l'], d: 'Bloquear pantalla (i3lock rojo)' },
  { k: ['super', 'shift', 'r'], d: 'Recargar atajos sxhkd' },
  { k: ['print'], d: 'Captura con edición (flameshot)' },
  { k: ['super', 'click'], d: 'Mover / redimensionar con ratón' }
]

function Keybinds() {
  return (
    <Section id="atajos" tag="referencia" title="Atajos de teclado" subtitle="Todos viven en ~/.config/sxhkd/sxhkdrc. super = tecla Windows. Edítalos y recarga con super + shift + r.">
      <div className="grid md:grid-cols-2 gap-3">
        {KEYS.map((k, i) => (
          <Reveal key={k.d} delay={Math.min(i * 0.04, 0.4)}>
            <div className="flex items-center justify-between gap-4 border border-edge rounded-xl px-5 py-3.5 bg-panel/50 hover:border-whs-red/40 hover:bg-panel transition-all group">
              <span className="text-sm text-whs-grey group-hover:text-whs-ink transition-colors">{k.d}</span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                {k.k.map((part, i) => (
                  <span key={i} className="flex items-center">
                    {i > 0 && <span className="text-whs-red/70 mx-1 font-mono text-xs">+</span>}
                    {part.split('/').map((p, j) => (
                      <span key={j} className="flex items-center">
                        {j > 0 && <span className="text-whs-grey/40 mx-0.5 text-xs">/</span>}
                        <kbd className="kbd group-hover:border-whs-red/40 transition-colors">{p.trim()}</kbd>
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

// ================= TOOLS =================

const TOOLS = [
  { cmd: 'whs-bettercap on|off', desc: 'Arranca o detiene bettercap + tor solo cuando los necesitas. Nada corre 24/7 sin tu permiso.', icon: Radio },
  { cmd: 'whs-status', desc: 'Resumen instantáneo: RAM, disco, zram y estado de tor/bettercap/snapd.', icon: Gauge },
  { cmd: 'settarget <IP>', desc: 'Marca la IP objetivo; polybar la muestra en el módulo rojo ATK. Sin argumento la borra.', icon: Crosshair },
  { cmd: 'whitehatso-close', desc: 'El diálogo de cierre con confirmación que usa Ctrl+W, para cualquier ventana.', icon: AppWindow },
  { cmd: 'whitehatso-lock', desc: 'Pantalla de bloqueo con captura borrosa y anillo rojo i3lock.', icon: Lock },
  { cmd: 'whs-help', desc: 'Chuleta de todos los comandos propios del sistema.', icon: HelpCircle }
]

function Tools() {
  return (
    <Section id="herramientas" tag="arsenal" title="Comandos propios" subtitle="Pequeñas utilidades en /usr/local/bin que hacen que el sistema respire: servicios bajo demanda, objetivo siempre a la vista y bloqueo con estilo.">
      <div className="grid md:grid-cols-2 gap-4">
        {TOOLS.map((t, i) => (
          <Reveal key={t.cmd} delay={i * 0.06}>
            <div className="card h-full flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-whs-red/10 border border-whs-red/30 flex items-center justify-center text-whs-red shrink-0">
                <t.icon size={18} />
              </div>
              <div className="min-w-0">
                <code className="text-whs-red font-bold font-mono text-sm">{t.cmd}</code>
                <p className="text-sm text-whs-grey mt-1.5 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

// ================= FAQ =================

const FAQ = [
  {
    q: '¿Es seguro para mi sistema?',
    a: 'El instalador trabaja con copias de seguridad automáticas en ~/.config/backups/whitehatso-<fecha>/ y nunca desinstala paquetes críticos: la lista protegida (xorg, lightdm, bspwm, mesa…) está escrita en el propio script y se comprueba antes de cada purga.'
  },
  {
    q: '¿Funciona fuera de VMware?',
    a: 'Sí. Los ajustes VMware (resolución dinámica, portapapeles, autofit) son un módulo opcional del instalador. En físico u otro hipervisor, el resto del entorno es idéntico.'
  },
  {
    q: '¿Puedo instalarlo sobre mi Ubuntu ya configurado?',
    a: 'Sí. Despliega los configs respaldando los tuyos, y la capa de rendimiento solo apaga telemetría y servicios innecesarios si aceptas ese paso. Tu usuario y tus datos no se tocan.'
  },
  {
    q: '¿Por qué lightdm + bspwm y no GNOME?',
    a: 'Peso y control. lightdm + bspwm consumen una fracción de RAM, no hay extensiones que se rompan, y cada pieza del sistema es tuya: configs de texto plano, sin estados ocultos.'
  },
  {
    q: '¿Cómo construyo una ISO con todo esto?',
    a: 'Con Cubic: abres la ISO de Ubuntu 25.10, en el chroot ejecutas el instalador en modo desatendido (WHS_ASSUME_YES=1) y generas la ISO nueva. Resultado: instalación limpia con whitehatSO preinstalado.'
  }
]

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section id="faq" tag="dudas" title="Preguntas frecuentes">
      <div className="space-y-3.5 max-w-3xl">
        {FAQ.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.05}>
            <div
              className={`border rounded-xl overflow-hidden transition-all ${
                open === i ? 'border-whs-red/50 bg-panel/70' : 'border-edge bg-panel/40'
              }`}
            >
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full cursor-pointer px-5 py-4 text-left flex items-center justify-between gap-4">
                <span className="text-white font-semibold font-sans">{f.q}</span>
                <span className={`text-whs-red text-xl transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="px-5 pb-5 text-sm text-whs-grey leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

// ================= CTA + FOOTER =================

function GithubBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-base" />
      <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
        <Reveal>
          <div className="inline-flex w-16 h-16 rounded-2xl bg-whs-red/15 border border-whs-red/40 items-center justify-center text-whs-red mb-6 shadow-glow-red">
            <Github size={30} />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white font-sans mb-5">
            Úsalo, fórralo, <span className="gradient-text">compártelo</span>
          </h2>
          <p className="text-whs-grey mb-9 max-w-2xl mx-auto leading-relaxed">
            Todo el proyecto es open source (MIT): configs, scripts, instalador y esta web. Las herramientas de pentesting
            referenciadas solo deben usarse en entornos con autorización explícita. <span className="text-whs-red">Stay white hat.</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/D1se0/environment-ubuntu-installer"
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3.5 bg-whs-red text-white font-semibold rounded-lg hover:bg-whs-redbright transition-all shadow-glow-red flex items-center gap-2"
            >
              <Github size={17} /> Ver en GitHub
            </a>
            <a
              href="https://github.com/D1se0/environment-ubuntu-installer/releases/latest"
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3.5 border border-edge rounded-lg text-whs-ink hover:border-whs-red/60 hover:text-whs-red transition-all flex items-center gap-2"
            >
              <Package size={17} /> Descargar release
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-edge">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-whs-grey font-mono">
        <p>
          <span className="text-whs-red font-bold">whitehat</span>
          <span className="text-white">SO</span> — hecho por <span className="text-whs-ink">D1se0</span> · MIT
        </p>
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-whs-green animate-pulse" />
          payload v1.0.0 · build 2026.09
        </p>
      </div>
    </footer>
  )
}

// ================= APP =================

export default function Sections() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <PromptAnatomy />
      <Install />
      <Keybinds />
      <Tools />
      <Faq />
      <GithubBanner />
      <Footer />
    </div>
  )
}
