import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../../hooks'

function TimelineItem({ exp, index, inView, isLast }) {
  const [expanded, setExpanded] = useState(false)
  const isEven = index % 2 === 0

  return (
    <div className={`relative flex items-start gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'} md:flex-row`}>
      {/* Content */}
      <motion.div
        className={`flex-1 ${isEven ? 'md:text-right md:pr-8' : 'md:pl-8'} md:w-[calc(50%-2rem)]`}
        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.15 }}
      >
        <motion.div
          className="glass rounded-2xl p-6 cursor-pointer group"
          whileHover={{ scale: 1.02, y: -4 }}
          onClick={() => setExpanded(!expanded)}
          style={{ borderColor: expanded ? 'var(--accent)' : 'var(--border)' }}
        >
          {/* Duration badge */}
          <span
            className="inline-block px-3 py-1 rounded-full font-mono text-xs mb-3"
            style={{
              background: 'var(--bg-surface)',
              color: 'var(--text-muted)',
            }}
          >
            {exp.duration}
          </span>

          <h3 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {exp.role}
          </h3>
          <p className="font-body text-sm font-medium mb-3" style={{ color: 'var(--accent)' }}>
            @ {exp.company}
          </p>
          <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {exp.description}
          </p>

          {/* Expandable highlights */}
          <motion.div
            animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
            style={{ overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="font-mono text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                KEY HIGHLIGHTS
              </p>
              <ul className="space-y-2">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span style={{ color: 'var(--accent)' }}>→</span>
                    <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{h}</span>
                  </li>
                ))}
              </ul>
              {/* Tech used */}
              <div className="flex flex-wrap gap-2 mt-4">
                {exp.tech.map(t => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded font-mono text-xs"
                    style={{
                      background: 'var(--bg-surface)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-3 font-mono text-xs flex items-center gap-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {expanded ? 'Show less ↑' : 'See highlights ↓'}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Timeline dot — hidden on mobile, shown md+ */}
      <motion.div
        className="hidden md:flex flex-col items-center"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.15 + 0.1 }}
      >
        <div
          className="w-4 h-4 rounded-full border-2 flex-shrink-0"
          style={{
            background: 'var(--bg-primary)',
            borderColor: 'var(--accent)',
            boxShadow: '0 0 12px var(--glow)',
          }}
        />
        {!isLast && (
          <motion.div
            className="w-px flex-1 mt-1"
            style={{ background: 'linear-gradient(to bottom, var(--accent), var(--border))' }}
            initial={{ height: 0 }}
            animate={inView ? { height: '100%' } : {}}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
          />
        )}
      </motion.div>

      {/* Spacer for opposite side */}
      <div className="hidden md:block flex-1" />
    </div>
  )
}

export default function ExperienceSection({ data }) {
  const { ref, inView } = useInView(0.1)

  if (!data) return null

  return (
    <section id="experience" className="section-wrapper min-h-screen py-32">
      <div ref={ref} className="content-overlay max-w-5xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
          >
            <div className="h-px w-12" style={{ background: 'var(--accent)' }} />
            <span className="font-mono text-sm tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              Career
            </span>
            <div className="h-px w-12" style={{ background: 'var(--accent)' }} />
          </motion.div>

          <motion.h2
            className="font-display text-5xl md:text-6xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            The Journey
          </motion.h2>

          <motion.p
            className="font-body text-lg"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            From junior dev to senior engineer — one commit at a time.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {data.experience.map((exp, i) => (
            <TimelineItem
              key={exp.id}
              exp={exp}
              index={i}
              inView={inView}
              isLast={i === data.experience.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
