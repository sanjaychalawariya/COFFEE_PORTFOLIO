import { useState, useEffect, useRef, useCallback } from 'react'

// ── useScrollProgress ──────────────────────────────────────────────────────────
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const el = document.documentElement
        const scrollTop = window.scrollY
        const maxScroll = el.scrollHeight - el.clientHeight
        const progress = maxScroll > 0 ? scrollTop / maxScroll : 0
        setScrollProgress(Math.min(1, Math.max(0, progress)))
        setScrollY(scrollTop)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { scrollProgress, scrollY }
}

// ── useData ────────────────────────────────────────────────────────────────────
export function useData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/portfolio-data')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e); setLoading(false) })
  }, [])

  return { data, loading, error }
}

// ── useTheme ───────────────────────────────────────────────────────────────────
export function useTheme() {
  const [theme, setTheme] = useState('espresso') // 'espresso' | 'latte'

  useEffect(() => {
    const saved = localStorage.getItem('coffee-theme') || 'espresso'
    setTheme(saved)
    document.documentElement.classList.toggle('theme-latte', saved === 'latte')
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'espresso' ? 'latte' : 'espresso'
      localStorage.setItem('coffee-theme', next)
      document.documentElement.classList.toggle('theme-latte', next === 'latte')
      return next
    })
  }, [])

  return { theme, toggleTheme, isDark: theme === 'espresso' }
}

// ── useTypingEffect ────────────────────────────────────────────────────────────
export function useTypingEffect(words, speed = 100, deleteSpeed = 50, pause = 2000) {
  const [displayed, setDisplayed] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!words || words.length === 0) return
    const current = words[wordIndex % words.length]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, charIndex + 1))
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pause)
        } else {
          setCharIndex(c => c + 1)
        }
      } else {
        setDisplayed(current.slice(0, charIndex - 1))
        if (charIndex - 1 === 0) {
          setIsDeleting(false)
          setWordIndex(w => w + 1)
          setCharIndex(0)
        } else {
          setCharIndex(c => c - 1)
        }
      }
    }, isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, wordIndex, words, speed, deleteSpeed, pause])

  return displayed
}

// ── useInView ──────────────────────────────────────────────────────────────────
export function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

// ── useMouse ──────────────────────────────────────────────────────────────────
export function useMouse() {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handler = e => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return mouse
}

// ── useIsMobile ───────────────────────────────────────────────────────────────
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}
