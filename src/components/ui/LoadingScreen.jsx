import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BREW_STEPS = [
  'Grinding beans...',
  'Heating water...',
  'Pre-infusing...',
  'Extracting espresso...',
  'Steaming milk...',
  'Ready to serve ☕',
]

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 3 + 1
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          setTimeout(onComplete, 700)
        }, 600)
      }
      setProgress(Math.min(p, 100))
      setStepIndex(Math.min(Math.floor(p / 17), BREW_STEPS.length - 1))
    }, 55)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'var(--bg-primary)' }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Background rings */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {[180, 280, 380, 480].map((size, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full coffee-ring"
                style={{ width: size, height: size }}
                animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Coffee cup animation */}
          <motion.div
            className="relative z-10 mb-12"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative">
              {/* Cup SVG */}
              <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
                {/* Saucer */}
                <ellipse cx="40" cy="80" rx="36" ry="6" fill="var(--bg-surface)" />
                {/* Cup body */}
                <path
                  d="M16 35 Q14 70 24 75 L56 75 Q66 70 64 35 Z"
                  fill="var(--bg-surface)"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                />
                {/* Cup rim */}
                <ellipse cx="40" cy="35" rx="24" ry="5" fill="var(--bg-surface)" stroke="var(--accent)" strokeWidth="1.5" />
                {/* Coffee liquid */}
                <ellipse cx="40" cy="36" rx="20" ry="4" fill="#4a2008" />
                {/* Crema */}
                <ellipse cx="40" cy="35.5" rx="18" ry="3" fill="#c8762a" opacity="0.8" />
                {/* Handle */}
                <path d="M64 45 Q78 45 78 55 Q78 65 64 65" stroke="var(--accent)" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>

              {/* Steam */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={`w-1 bg-current rounded-full steam-${i + 1}`}
                    style={{
                      height: '24px',
                      color: 'var(--text-secondary)',
                      transformOrigin: 'bottom',
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Brand */}
          <motion.h1
            className="font-display text-3xl mb-2 text-gradient"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            SANJAY CHALAWARIYA
          </motion.h1>

          <motion.p
            className="font-mono text-sm mb-10 opacity-60"
            style={{ color: 'var(--text-secondary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
          >
            {BREW_STEPS[stepIndex]}
          </motion.p>

          {/* Progress bar */}
          <div
            className="relative w-64 h-1 rounded-full overflow-hidden"
            style={{ background: 'var(--bg-surface)' }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-warm))' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
            {/* Shimmer */}
            <div
              className="absolute inset-0 shimmer"
              style={{ opacity: progress < 100 ? 1 : 0, transition: 'opacity 0.3s' }}
            />
          </div>

          <motion.p
            className="mt-3 font-mono text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            {Math.round(progress)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
