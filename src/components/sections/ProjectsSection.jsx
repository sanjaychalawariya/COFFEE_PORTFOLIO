import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../../hooks'

function ProjectCard({ project, index, inView }) {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      className="relative glass rounded-3xl overflow-hidden cursor-pointer project-card"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8 }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Color accent top bar */}
      <motion.div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}88)` }}
        animate={{ scaleX: hovered ? 1 : 0.3, originX: 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Background gradient */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at top left, ${project.color}12 0%, transparent 60%)` }}
        animate={{ opacity: hovered ? 1 : 0.5 }}
      />

      <div className="relative p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            {project.featured && (
              <span
                className="inline-block px-3 py-1 rounded-full font-mono text-xs mb-3"
                style={{
                  background: `${project.color}22`,
                  color: project.color,
                  border: `1px solid ${project.color}44`,
                }}
              >
                ★ Featured
              </span>
            )}
            <h3 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {project.title}
            </h3>
            <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
              {project.subtitle}
            </p>
          </div>

          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `${project.color}22` }}
            animate={{ rotate: hovered ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke={project.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

        {/* Description */}
        <AnimatePresence>
          <motion.p
            className="font-body text-sm leading-relaxed mb-5"
            style={{ color: 'var(--text-secondary)' }}
            animate={{ height: expanded ? 'auto' : '3.6em', overflow: 'hidden' }}
          >
            {project.description}
          </motion.p>
        </AnimatePresence>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md font-mono text-xs"
              style={{
                background: 'var(--bg-surface)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {project.year}
          </span>
          <div className="flex items-center gap-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1.5 font-mono text-xs transition-colors duration-200 interactive"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = project.color}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Code
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-xs transition-all duration-200 interactive"
                style={{
                  background: `${project.color}22`,
                  color: project.color,
                  border: `1px solid ${project.color}44`,
                }}
              >
                Live ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection({ data }) {
  const { ref, inView } = useInView(0.1)

  if (!data) return null

  const featured = data.projects.filter(p => p.featured)
  const others = data.projects.filter(p => !p.featured)

  return (
    <section id="projects" className="section-wrapper min-h-screen py-32">
      <div ref={ref} className="content-overlay max-w-7xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
          >
            <div className="h-px w-12" style={{ background: 'var(--accent)' }} />
            <span className="font-mono text-sm tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              My Work
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <motion.h2
              className="font-display text-5xl md:text-6xl font-bold"
              style={{ color: 'var(--text-primary)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
            >
              Crafted With Care
            </motion.h2>
            <motion.p
              className="font-body text-sm max-w-xs"
              style={{ color: 'var(--text-muted)' }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              Click any card to read more ↗
            </motion.p>
          </div>
        </div>

        {/* Featured projects — 2 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} inView={inView} />
          ))}
        </div>

        {/* Other projects — 2 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {others.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i + featured.length} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
