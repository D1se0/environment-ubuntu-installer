import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ---------- Reveal on scroll ----------
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = ''
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ---------- Copy to clipboard block ----------
export function CopyBlock({ text, label }: { text: string; label?: string }) {
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
    <div className="relative group rounded-xl border border-edge bg-black/70 shadow-glass overflow-hidden">
      {label && (
        <div className="px-4 py-2.5 text-[11px] uppercase tracking-widest text-whs-grey border-b border-edge flex items-center justify-between font-mono">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-whs-red/80 inline-block" />
            {label}
          </span>
          <span className="text-whs-grey/50">bash</span>
        </div>
      )}
      <pre className="p-5 text-sm text-whs-ink overflow-x-auto whitespace-pre-wrap break-words font-mono">{text}</pre>
      <button
        onClick={copy}
        className="absolute top-3 right-3 px-2.5 py-1 text-xs rounded-md border border-edge bg-base/90 text-whs-grey hover:border-whs-red hover:text-whs-red transition-all font-mono"
      >
        {copied ? '✓ copiado' : 'copiar'}
      </button>
    </div>
  )
}

// ---------- Section wrapper ----------
export function Section({
  id,
  tag,
  title,
  subtitle,
  children
}: {
  id: string
  tag: string
  title: React.ReactNode
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="relative max-w-6xl mx-auto px-6 py-24">
      <Reveal>
        <p className="section-tag mb-3">// {tag}</p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 font-sans">{title}</h2>
        {subtitle && <p className="text-whs-grey max-w-3xl mb-12 leading-relaxed">{subtitle}</p>}
      </Reveal>
      {children}
    </section>
  )
}

// ---------- Animated counter ----------
export function Counter({
  to,
  suffix = '',
  prefix = '',
  duration = 1400
}: {
  to: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])
  return (
    <span ref={ref}>
      {prefix}
      {val}
      {suffix}
    </span>
  )
}

// ---------- Typewriter ----------
export function Typewriter({ phrases, className = '' }: { phrases: string[]; className?: string }) {
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[idx % phrases.length]
    const speed = deleting ? 32 : 62
    const timer = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1)
        setText(next)
        if (next === current) setTimeout(() => setDeleting(true), 1700)
      } else {
        const next = current.slice(0, text.length - 1)
        setText(next)
        if (next === '') {
          setDeleting(false)
          setIdx(i => i + 1)
        }
      }
    }, speed)
    return () => clearTimeout(timer)
  }, [text, deleting, idx, phrases])

  return (
    <span className={className}>
      {text}
      <span className="animate-blink text-whs-red">▊</span>
    </span>
  )
}

// ---------- Live terminal demo ----------
export function Terminal() {
  const [lines, setLines] = useState<string[]>([])
  const script: Array<[string, string[]]> = [
    ['$', ['whitehatso --info']],
    ['#', ['distro: Ubuntu 25.10 · kernel 6.17', 'wm: bspwm + sxhkd + picom', 'shell: bash + prompt ☠ whitehatSO']],
    ['$', ['whs-status']],
    ['#', ['RAM: 848Mi / 5.3Gi · zram: 5.3G (zstd)', 'telemetría: 0 paquetes · snapd: gone', 'earlyoom: active · journald: 150M']],
    ['$', ['settarget 10.10.14.7']],
    ['#', ['polybar ATK → 10.10.14.7  [objetivo marcado]']],
    ['$', ['whs-bettercap on']],
    ['#', ['bettercap + tor: ON (solo cuando los pides)']]
  ]
  useEffect(() => {
    let li = 0
    let cancelled = false
    const step = () => {
      if (cancelled) return
      if (li >= script.length) {
        setTimeout(() => {
          if (!cancelled) {
            setLines([])
            li = 0
            step()
          }
        }, 4200)
        return
      }
      const [type, content] = script[li]
      setLines(prev => [...prev.slice(-14), `${type}|${content[0]}`])
      li++
      if (type === '#' && content.length > 1) {
        content.slice(1).forEach((extra, k) => {
          setTimeout(() => {
            if (!cancelled) setLines(prev => [...prev.slice(-14), `${type}|${extra}`])
          }, (k + 1) * 240)
        })
        setTimeout(step, 400 + content.length * 240)
      } else {
        setTimeout(step, 700)
      }
    }
    step()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl border border-edge bg-black/80 shadow-glass overflow-hidden"
    >
      {/* barra de título */}
      <div className="px-4 py-3 border-b border-edge flex items-center gap-2 bg-panel/60">
        <span className="w-3 h-3 rounded-full bg-whs-red/90" />
        <span className="w-3 h-3 rounded-full bg-edge" />
        <span className="w-3 h-3 rounded-full bg-edge" />
        <span className="ml-3 text-xs text-whs-grey font-mono">diseño@whitehatso — kitty</span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] text-whs-green font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-whs-green animate-pulse" /> live
        </span>
      </div>
      {/* cuerpo */}
      <div className="p-6 font-mono text-[13px] leading-7 min-h-[320px]">
        {lines.map((l, i) => {
          const [type, ...rest] = l.split('|')
          const content = rest.join('|')
          const isCmd = type === '$'
          return (
            <motion.p key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
              {isCmd ? (
                <>
                  <span className="text-whs-orange">◈</span> <span className="text-[#3a3a3d]">│</span>{' '}
                  <span className="text-whs-grey">~</span> <span className="text-whs-green">✓</span>{' '}
                  <span className="text-whs-red">$</span> <span className="text-white">{content}</span>
                </>
              ) : (
                <span className="text-whs-grey/90"> {content}</span>
              )}
            </motion.p>
          )
        })}
      </div>
      {/* stats footer */}
      <div className="px-6 py-3 bg-panel/70 border-t border-edge text-xs text-whs-grey flex gap-6 flex-wrap font-mono">
        <span>
          <b className="text-whs-red">RAM base</b> ~850 Mi
        </span>
        <span>
          <b className="text-whs-red">Telemetría</b> 0 paquetes
        </span>
        <span>
          <b className="text-whs-red">Snap</b> eliminado
        </span>
        <span>
          <b className="text-whs-red">zram</b> 5.3 GB zstd
        </span>
      </div>
      {/* scanline */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-whs-red/[0.04] to-transparent animate-scanline" />
      </div>
    </motion.div>
  )
}
