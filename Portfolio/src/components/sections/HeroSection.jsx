import { motion } from 'framer-motion'
import { useTypingEffect } from '../../hooks'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import { API_URL } from '../../config'

const TYPING_WORDS = [
  'Full-Stack Engineer',
  'Coffee Connoisseur',
  'Open Source Contributor',
  'Performance Obsessive',
  'Creative Problem Solver',
]

export default function HeroSection({ data }) {
  const typed = useTypingEffect(TYPING_WORDS, 80, 40, 2200)

  if (!data) return null

  const { personal } = data

  return (
    <section id="hero" className="section-wrapper min-h-screen">
      <div className="content-overlay max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="flex flex-col items-start justify-center min-h-screen">
          {/* Pre-title */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <div
              className="h-px w-12"
              style={{ background: 'var(--accent)' }}
            />
            <span
              className="font-mono text-sm tracking-widest uppercase"
              style={{ color: 'var(--accent)' }}
            >
              Hello, World ☕
            </span>
          </motion.div>

          {/* Main name */}
          <motion.h1
            className="font-display font-black leading-none mb-4"
            style={{
              fontSize: 'clamp(3.5rem, 10vw, 9rem)',
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            {personal.name.split(' ').map((word, i) => (
              <span key={i} className="block">
                {i === 0 ? word : (
                  <span className="text-gradient">{word}</span>
                )}
              </span>
            ))}
          </motion.h1>

          {/* Typing effect */}
          <motion.div
            className="flex items-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span
              className="font-body text-xl md:text-2xl font-light"
              style={{ color: 'var(--text-secondary)' }}
            >
              {typed}
            </span>
            <span className="typing-cursor" />
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="font-body text-lg md:text-xl max-w-lg mb-10 leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
          >
            {personal.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <a
              href="#projects"
              onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="px-8 py-3.5 rounded-full font-body font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg interactive"
              style={{
                background: 'var(--accent)',
                color: 'var(--bg-primary)',
                boxShadow: '0 0 30px rgba(198, 132, 66, 0.3)',
              }}
            >
              View My Work
            </a>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`${API_URL}/resume`)
                  const blob = await res.blob()
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'Sanjay_Chalawariya_Resume.pdf'
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  window.URL.revokeObjectURL(url)
                } catch (err) {
                  console.error('Download failed:', err)
                }
              }}
              className="px-8 py-3.5 rounded-full font-body font-medium text-sm glass-warm transition-all duration-300 hover:scale-105 interactive cursor-pointer border-0"
              style={{ color: 'var(--accent)' }}
            >
              Download CV
            </button>
          </motion.div>

          {/* Social links */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            {[
              { icon: <FaGithub size={20} />, href: data.personal.github, label: 'GitHub' },
              { icon: <FaLinkedin size={20} />, href: data.personal.linkedin, label: 'LinkedIn' },
              { icon: <SiLeetcode size={20} />, href: data.personal.leetcode, label: 'LeetCode' },
            ].map(social => (
              <a
                key={social.label}
                href={social.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs tracking-widest interactive transition-colors duration-200 hover:text-amber-400"
                style={{ color: 'var(--text-muted)' }}
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
            <span
              className="h-px w-8"
              style={{ background: 'var(--border)' }}
            />
            <span
              className="font-mono text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              {personal.location}
            </span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            SCROLL
          </span>
          <div
            className="w-px h-12 rounded-full relative overflow-hidden"
            style={{ background: 'var(--border)' }}
          >
            <div
              className="scroll-indicator-dot absolute top-0 left-0 w-full h-1/3 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
