import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation({ scrollProgress, theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    setScrolled(scrollProgress > 0.02)
  }, [scrollProgress])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { threshold: 0.4 }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const isDark = theme === 'espresso'

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className={`mx-auto max-w-7xl px-6 flex items-center justify-between ${
          scrolled ? 'glass rounded-2xl mx-4' : ''
        } transition-all duration-500 py-3`}>
          {/* Logo */}
          <motion.button
            onClick={() => handleNavClick('#hero')}
            className="font-display text-xl font-bold flex items-center gap-2"
            style={{ color: 'var(--accent)' }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">☕</span>
            <span>SoftwareJAY</span>
          </motion.button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="relative font-body text-sm font-medium transition-colors duration-200"
                  style={{
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-px"
                      style={{ background: 'var(--accent)' }}
                      layoutId="activeNav"
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              className="relative w-10 h-10 rounded-full flex items-center justify-center glass-warm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={isDark ? 'Switch to Latte mode' : 'Switch to Espresso mode'}
            >
              <motion.span
                key={theme}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                className="text-lg"
              >
                {isDark ? '☀️' : '🌙'}
              </motion.span>
            </motion.button>

            {/* CTA */}
            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick('#contact') }}
              className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full font-body text-sm font-medium transition-all duration-200"
              style={{
                background: 'var(--accent)',
                color: 'var(--bg-primary)',
              }}
              whileHover={{ scale: 1.05, brightness: 1.1 }}
              whileTap={{ scale: 0.98 }}
            >
              Hire Me
            </motion.a>

            {/* Mobile menu button */}
            <button
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="block h-0.5 rounded-full"
                  style={{ background: 'var(--accent)' }}
                  animate={{
                    width: i === 1 ? (menuOpen ? '50%' : '75%') : '100%',
                    opacity: i === 1 ? (menuOpen ? 0 : 1) : 1,
                    rotate: menuOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                    y: menuOpen ? (i === 0 ? 8 : i === 2 ? -8 : 0) : 0,
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: 'var(--bg-primary)' }}
            initial={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at top right)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="font-display text-4xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ color: 'var(--accent)', x: 8 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
            <div
              className="absolute bottom-12 font-mono text-sm opacity-40"
              style={{ color: 'var(--text-muted)' }}
            >
              ☕ fueled by espresso
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-0.5 z-[60] origin-left"
        style={{
          background: 'linear-gradient(90deg, var(--accent), var(--accent-warm))',
          scaleX: scrollProgress,
        }}
      />
    </>
  )
}
