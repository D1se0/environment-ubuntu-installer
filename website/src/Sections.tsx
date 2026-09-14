import { useState } from 'react'

// ---------- utilidades ----------

function CopyBlock({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard no disponible */
    }
  }
  return (
    <div className="relative group rounded-lg border border-edge bg-black/60 overflow-hidden">
      {label && (
        <div className="px-4 py-2 text-[11px] uppercase tracking-widest text-whs-grey border-b border-edge flex items-center justify-between">
          <span>{label}</span>
          <span className="text-whs-red/60 group-hover:text-whs-red transition-colors">bash</span>
        </div>
      )}
      <pre className="p-4 text-sm text-whs-ink overflow-x-auto whitespace-pre-wrap break-words">{text}</pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs rounded border border-edge bg-base hover:border-whs-red hover:text-whs-red"
      >
        {copied ? '✓ copiado' : 'copiar'}
      </button>
    </div>
  )
}

const Section = ({ id, tag, title, children }: { id: string; tag: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="max-w-6xl mx-auto px-6 py-20 border-t border-edge/60">
    <p className="section-tag mb-3">// {tag}</p>
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
      {title}
      <span className="text-whs-red">_</span>
    </h2>
    {children}
  </section>
)

// ---------- datos reales (extraidos del payload) ----------

const FEATURES = [
  {
    icon: '⌘',
    title: 'bspwm + sxhkd',
    desc: 'Tiling puro, binario, sin dependencias ocultas. Cada atajo vive en un sxhkdrc legible y al momento.',
  },
  {
    icon: '▮',
    title: 'kitty a medida',
    desc: 'Paleta roja/gris, transparencia sutil (0.92), pestañas powerline y Ctrl+W con confirmación Si/No.',
  },
  {
    icon: '☠',
    title: 'Prompt con calavera',
    desc: 'Logo Ubuntu · ruta absoluta · ✓ verde si el comando fue bien, ✗ rojo si falló · ☠ rojo y # en modo root.',
  },
  {
    icon: '⚡',
    title: 'Rendimiento quirúrgico',
    desc: 'zram zstd, swappiness 10, journald limitado, earlyoom anti-congelamientos y telemetría 100% fuera.',
  },
  {
    icon: '▣',
    title: 'polybar operativa',
    desc: 'Módulo ATK para marcar tu IP de atacante (settarget), control de bettercap/tor, menú de poder rojo.',
  },
  {
    icon: '⌥',
    title: 'Login con estilo',
    desc: 'lightdm temático: fondo generativo rojo, Yaru-red-dark, JetBrains Mono y sesión whitehatSO por defecto.',
  },
]

const TOOLS = [
  { cmd: 'whs-bettercap on|off', desc: 'Arranca o detiene bettercap + tor solo cuando los necesitas. Nada corre 24/7.' },
  { cmd: 'whs-status', desc: 'Resumen instantáneo: RAM, disco, zram, estado de tor/bettercap/snapd.' },
  { cmd: 'whs-help', desc: 'Chuleta de comandos propios del sistema.' },
  { cmd: 'settarget <IP>', desc: 'Marca la IP objetivo; polybar la muestra en el módulo rojo ATK. Sin argumento la borra.' },
  { cmd: 'whitehatso-close', desc: 'El diálogo de cierre con confirmación que usa Ctrl+W (funciona para cualquier ventana).' },
  { cmd: 'whitehatso-lock', desc: 'Pantalla de bloqueo con captura borrosa y anillo rojo i3lock.' },
]

const KEYS = [
  { k: 'super + Return', d: 'Abrir kitty' },
  { k: 'super / ctrl + space', d: 'Rofi launcher (apps)' },
  { k: 'ctrl + w', d: 'Cerrar ventana con confirmación Si/No' },
  { k: 'super + shift + q', d: 'Cerrar ventana (sin confirmación)' },
  { k: 'super + {1…5}', d: 'Ir al escritorio 1–5' },
  { k: 'super + shift + {1…5}', d: 'Mandar ventana al escritorio 1–5' },
  { k: 'super + h / j / k / l', d: 'Mover foco entre ventanas (vim-style)' },
  { k: 'super + shift + h/j/k/l', d: 'Intercambiar posición de ventanas' },
  { k: 'super + ctrl + h/j/k/l', d: 'Redimensionar ventanas' },
  { k: 'super + f', d: 'Pantalla completa (toggle)' },
  { k: 'super + shift + space', d: 'Ventana flotante (toggle)' },
  { k: 'super + shift + l', d: 'Bloquear pantalla' },
  { k: 'super + shift + r', d: 'Recargar atajos sxhkd' },
  { k: 'print', d: 'Captura de pantalla (flameshot)' },
  { k: 'super + click izq/der', d: 'Mover / redimensionar con el ratón' },
]

const FAQ = [
  {
    q: '¿Es seguro para mi sistema?',
    a: 'El instalador trabaja con copias de seguridad automáticas en ~/.config/backups/whitehatso-<fecha> y nunca desinstala paquetes críticos: la lista de paquetes protegidos (xorg, lightdm, bspwm…) está escrita en el propio script.',
  },
  {
    q: '¿Funciona fuera de VMware?',
    a: 'Sí. Los ajustes VMware (resolución dinámica, portapapeles) solo se aplican si eliges esa opción; en física u otro hipervisor el resto del entorno es idéntico.',
  },
  {
    q: '¿Puedo instalarlo sobre mi Ubuntu ya configurado?',
    a: 'Sí. Despliega los configs, respalda los tuyos y solo apaga servicios de telemetría si aceptas ese paso. Tu usuario y tus datos no se tocan.',
  },
  {
    q: '¿Por qué no GDM/GNOME?',
    a: 'Peso y control. lightdm + bspwm consumen una fracción de RAM y cada pieza es tuya: sin extensiones, sin GVfs sorpresas, sin telemetría.',
  },
]

// ---------- secciones ----------

function Hero() {
  return (
    <header className="relative overflow-hidden">
      {/* scanline decorativa */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-whs-red/5 to-transparent animate-scan" />
      </div>
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-24">
        <p className="text-whs-red text-xs tracking-[0.35em] uppercase mb-6 animate-blink">
          ▸ root@whitehatso:~# ethical hacking environment
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05]">
          whitehat<span className="text-whs-red">SO</span>
          <span className="animate-blink text-whs-red">_</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-whs-grey leading-relaxed">
          Ubuntu 25.10 transformado en un <span className="text-whs-ink">laboratorio de ethical hacking</span> con estética
          terminal: <span className="text-whs-ink">bspwm + kitty + polybar</span>, rendimiento afinado con zram, telemetría
          cero y cada atajo pensado para vivir dentro de la terminal.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#instalar" className="px-6 py-3 bg-whs-red text-white font-semibold rounded-md hover:bg-whs-redbright transition-colors shadow-lg shadow-whs-red/20">
            Instalar ahora ↓
          </a>
          <a href="#atajos" className="px-6 py-3 border border-edge rounded-md hover:border-whs-red hover:text-whs-red transition-colors">
            Ver atajos de teclado
          </a>
          <a href="https://github.com/D1se0/enviroment-ubuntu-installer" target="_blank" rel="noreferrer" className="px-6 py-3 border border-edge rounded-md hover:border-whs-red hover:text-whs-red transition-colors">
            GitHub ↗
          </a>
        </div>

        {/* terminal simulada */}
        <div className="mt-16 rounded-xl border border-edge bg-black/70 shadow-2xl shadow-black/60 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-edge flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-whs-red/80" />
            <span className="w-3 h-3 rounded-full bg-edge" />
            <span className="w-3 h-3 rounded-full bg-edge" />
            <span className="ml-3 text-xs text-whs-grey">diseño@whitehatso — kitty</span>
          </div>
          <div className="p-6 text-sm leading-7">
            <p><span className="text-[#e95420]"></span> <span className="text-[#3a3a3d]">│</span> <span className="text-whs-grey">~</span> <span className="text-whs-green">✓</span> <span className="text-whs-red">$</span> <span className="text-whs-ink">whs-status</span></p>
            <p className="text-whs-grey">RAM: 848Mi / 5.3Gi · disco: 15G de 30G (53%) · zram 5.3G</p>
            <p className="text-whs-grey">tor: inactive | bettercap: inactive | snapd: inactive</p>
            <p><span className="text-[#e95420]"></span> <span className="text-[#3a3a3d]">│</span> <span className="text-whs-grey">~</span> <span className="text-whs-green">✓</span> <span className="text-whs-red">$</span> <span className="text-whs-ink">sudo bash install-whitehatso.sh</span><span className="animate-blink">▊</span></p>
          </div>
          <div className="px-6 py-2 bg-panel border-t border-edge text-xs text-whs-grey flex gap-6 flex-wrap">
            <span><b className="text-whs-red">RAM base</b> ~850 Mi</span>
            <span><b className="text-whs-red">Telemetría</b> 0 paquetes</span>
            <span><b className="text-whs-red">Snap</b> eliminado</span>
            <span><b className="text-whs-red">zram</b> 5.3 GB zstd</span>
          </div>
        </div>
      </div>
    </header>
  )
}

function Features() {
  return (
    <Section id="features" tag="el sistema" title="Qué es whitehatSO">
      <p className="text-whs-grey max-w-3xl mb-10 leading-relaxed">
        No es una distro nueva: es <span className="text-whs-ink">tu Ubuntu convertido en herramienta</span>. El instalador
        despliega un gestor de ventanas tipo tiling, una terminal con identidad, un panel vivo y una capa de rendimiento que
        elimina todo lo que Ubuntu trae de fábrica y no necesitas.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map(f => (
          <div key={f.title} className="card">
            <div className="text-2xl text-whs-red mb-3">{f.icon}</div>
            <h3 className="text-white font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-whs-grey leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Install() {
  return (
    <Section id="instalar" tag="despliegue" title="Instalación">
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-white font-bold mb-3">1 · Un solo comando</h3>
          <p className="text-sm text-whs-grey mb-4 leading-relaxed">
            El instalador es <span className="text-whs-ink">autocontenido</span>: lleva incrustados todos los configs, scripts
            y wallpapers. Descárgalo, revísalo (es un script plano y legible) y ejecútalo.
          </p>
          <CopyBlock
            label="instalación interactiva"
            text={`curl -fsSL https://raw.githubusercontent.com/D1se0/environment-ubuntu-installer/main/install-whitehatso.sh -o install-whitehatso.sh
chmod +x install-whitehatso.sh
sudo bash install-whitehatso.sh`}
          />
          <p className="text-xs text-whs-grey mt-3">
            Te preguntará: usuario, paquetes base, tuning de rendimiento, login temático, fixes de VMware y prompt de root.
          </p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">2 · Modo automático</h3>
          <p className="text-sm text-whs-grey mb-4 leading-relaxed">
            Para despliegues desatendidos (o dentro de un chroot como Cubic) usa las variables de entorno.
          </p>
          <CopyBlock
            label="modo desatendido"
            text={`WHS_ASSUME_YES=1 WHS_USER=tu_usuario \\
  sudo -E bash install-whitehatso.sh`}
          />
          <h3 className="text-white font-bold mt-8 mb-3">3 · Construir desde fuente</h3>
          <CopyBlock
            label="generar el instalador del repo"
            text={`git clone https://github.com/D1se0/environment-ubuntu-installer.git
cd environment-ubuntu-installer
bash build-installer.sh`}
          />
        </div>
      </div>
    </Section>
  )
}

function Keybinds() {
  return (
    <Section id="atajos" tag="referencia" title="Atajos de teclado">
      <p className="text-whs-grey mb-8 max-w-3xl">
        Todos viven en <code className="text-whs-red">~/.config/sxhkd/sxhkdrc</code>. <code className="text-whs-red">super</code> = tecla Windows.
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {KEYS.map(k => (
          <div key={k.k} className="flex items-center justify-between border border-edge rounded-md px-4 py-3 bg-panel/50 hover:border-whs-red/40 transition-colors">
            <span className="text-sm text-whs-grey">{k.d}</span>
            <span className="text-xs text-whs-ink whitespace-nowrap">
              {k.k.split(' + ').map((part, i) => (
                <span key={i}>
                  {part.split('/').map((p, j) => (
                    <span key={j}>
                      {j > 0 && <span className="text-whs-grey/50"> / </span>}
                      <kbd className="kbd">{p.trim()}</kbd>
                    </span>
                  ))}
                  {i < k.k.split(' + ').length - 1 && <span className="text-whs-red mx-1">+</span>}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Tools() {
  return (
    <Section id="herramientas" tag="arsenal" title="Comandos propios">
      <div className="space-y-4">
        {TOOLS.map(t => (
          <div key={t.cmd} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 border border-edge rounded-md px-5 py-4 bg-panel/50 hover:border-whs-red/40 transition-colors">
            <code className="text-whs-red font-bold whitespace-nowrap md:w-64">{t.cmd}</code>
            <span className="text-sm text-whs-grey">{t.desc}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Faq() {
  return (
    <Section id="faq" tag="dudas" title="Preguntas frecuentes">
      <div className="space-y-4 max-w-3xl">
        {FAQ.map(f => (
          <details key={f.q} className="group border border-edge rounded-md bg-panel/50 open:border-whs-red/50 transition-colors">
            <summary className="cursor-pointer px-5 py-4 text-white font-semibold list-none flex items-center justify-between">
              {f.q}
              <span className="text-whs-red group-open:rotate-45 transition-transform text-xl">+</span>
            </summary>
            <p className="px-5 pb-5 text-sm text-whs-grey leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-edge mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-whs-grey">
        <p>
          <span className="text-whs-red">whitehat</span>
          <span className="text-white">SO</span> — hecho por <span className="text-whs-ink">D1se0</span> · Ubuntu 25.10 · licencia MIT
        </p>
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-whs-green animate-pulse-slow" />
          build 2026.09 · payload v1.0.0
        </p>
      </div>
    </footer>
  )
}

// ---------- nav ----------

const NAV = [
  ['#features', 'Sistema'],
  ['#instalar', 'Instalar'],
  ['#atajos', 'Atajos'],
  ['#herramientas', 'Herramientas'],
  ['#faq', 'FAQ'],
]

function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-base/80 border-b border-edge/60">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" className="font-bold text-white">
          whitehat<span className="text-whs-red">SO</span>
          <span className="text-whs-red animate-blink">_</span>
        </a>
        <div className="hidden md:flex gap-6 text-sm">
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className="text-whs-grey hover:text-whs-red transition-colors">
              {label}
            </a>
          ))}
        </div>
        <a
          href="https://github.com/D1se0/enviroment-ubuntu-installer/releases/latest"
          target="_blank"
          rel="noreferrer"
          className="text-xs px-3 py-1.5 border border-whs-red/60 text-whs-red rounded hover:bg-whs-red hover:text-white transition-colors"
        >
          v1.0.0
        </a>
      </div>
    </nav>
  )
}

export default function Sections() {
  return (
    <div>
      <Nav />
      <Hero />
      <Features />
      <Install />
      <Keybinds />
      <Tools />
      <Faq />
      <Footer />
    </div>
  )
}
