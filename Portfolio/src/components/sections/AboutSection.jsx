import { motion } from 'framer-motion'
import { useInView } from '../../hooks'

export default function AboutSection({ data }) {
  const { ref, inView } = useInView(0.2)

  if (!data) return null
  const { about, personal } = data

  return (
    <section id="about" className="section-wrapper min-h-screen py-32">
      <div ref={ref} className="content-overlay max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <div>
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="h-px w-12" style={{ background: 'var(--accent)' }} />
              <span className="font-mono text-sm tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
                About Me
              </span>
            </motion.div>

            <motion.h2
              className="font-display text-5xl md:text-6xl font-bold mb-8 leading-tight"
              style={{ color: 'var(--text-primary)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {about.headline}
            </motion.h2>

            {about.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                className="font-body text-base leading-relaxed mb-5"
                style={{ color: 'var(--text-secondary)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              >
                {p}
              </motion.p>
            ))}

            {/* Coffee order badge */}
            <motion.div
              className="inline-flex items-center gap-3 glass-warm px-5 py-3 rounded-full mt-4"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              <span className="text-xl">☕</span>
              <div>
                <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>My order:</p>
                <p className="font-body text-sm font-medium" style={{ color: 'var(--accent)' }}>
                  {personal.coffeeOrder}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Stats grid */}
          <div className="grid grid-cols-2 gap-5">
            {about.stats.map((stat, i) => (
              <motion.div
                key={i}
                className="glass-warm rounded-2xl p-6 group hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                <p
                  className="font-display text-5xl font-black mb-2"
                  style={{ color: 'var(--accent)' }}
                >
                  {stat.value}
                </p>
                <p
                  className="font-body text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {stat.label}
                </p>
                {/* Decorative ring */}
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full opacity-20 coffee-ring"
                  style={{ borderColor: 'var(--accent)' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
