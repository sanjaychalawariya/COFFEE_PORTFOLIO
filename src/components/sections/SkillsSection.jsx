import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../../hooks'

function SkillCard({ skill, index, inView }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative glass rounded-2xl p-6 overflow-hidden cursor-pointer group"
      style={{ borderColor: hovered ? skill.color : 'var(--border)' }}
      initial={{ opacity: 0, y: 40, rotateX: -15 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.4, 0, 0.2, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${skill.color}18 0%, transparent 70%)` }}
        animate={{ opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
      />

      {/* Top row */}
      <div className="relative flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{skill.icon}</span>
          <h3
            className="font-display text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {skill.category}
          </h3>
        </div>
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: skill.color, boxShadow: `0 0 8px ${skill.color}` }}
        />
      </div>

      {/* Skills tags */}
      <div className="relative flex flex-wrap gap-2">
        {skill.items.map((item, i) => (
          <motion.span
            key={item}
            className="px-3 py-1 rounded-full font-mono text-xs font-medium"
            style={{
              background: hovered ? `${skill.color}22` : 'var(--bg-surface)',
              color: hovered ? skill.color : 'var(--text-secondary)',
              border: `1px solid ${hovered ? skill.color + '44' : 'var(--border)'}`,
              transition: `all 0.2s ease ${i * 0.03}s`,
            }}
          >
            {item}
          </motion.span>
        ))}
      </div>

      {/* Count */}
      <div className="relative mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          {skill.items.length} technologies
        </span>
      </div>
    </motion.div>
  )
}

export default function SkillsSection({ data }) {
  const { ref, inView } = useInView(0.1)

  if (!data) return null

  return (
    <section id="skills" className="section-wrapper min-h-screen py-32">
      <div ref={ref} className="content-overlay max-w-7xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="h-px w-12" style={{ background: 'var(--accent)' }} />
            <span className="font-mono text-sm tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              Tech Stack
            </span>
            <div className="h-px w-12" style={{ background: 'var(--accent)' }} />
          </motion.div>

          <motion.h2
            className="font-display text-5xl md:text-6xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The Blend
          </motion.h2>

          <motion.p
            className="font-body text-lg max-w-xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            Like a master barista's toolkit — every technology chosen for precision and purpose.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.skills.map((skill, i) => (
            <SkillCard key={skill.category} skill={skill} index={i} inView={inView} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <span className="text-xl">🫘</span>
          <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
            Always learning. Always brewing.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
