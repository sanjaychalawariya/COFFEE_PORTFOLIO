import { motion } from 'framer-motion'

export default function MobileLayout({ data }) {
  if (!data) return null
  const { personal, about, skills, projects, experience, contact } = data

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-6 pt-20 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: 'var(--accent)' }} />
            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              Hello World ☕
            </span>
          </div>
          <h1 className="font-display text-6xl font-black leading-none mb-4" style={{ color: 'var(--text-primary)' }}>
            {personal.name.split(' ')[0]}<br />
            <span className="text-gradient">{personal.name.split(' ')[1]}</span>
          </h1>
          <p className="font-body text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>{personal.title}</p>
          <p className="font-body text-base leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>{personal.tagline}</p>
          <div className="flex gap-4">
            <a href="#projects" className="px-6 py-3 rounded-full font-body text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
              View Work
            </a>
            <a href={`mailto:${personal.email}`} className="px-6 py-3 rounded-full font-body text-sm font-medium glass-warm" style={{ color: 'var(--accent)' }}>
              Contact
            </a>
          </div>
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-16">
        <div className="h-px w-8 mb-4" style={{ background: 'var(--accent)' }} />
        <h2 className="font-display text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>About</h2>
        {about.paragraphs.map((p, i) => (
          <p key={i} className="font-body text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{p}</p>
        ))}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {about.stats.map(stat => (
            <div key={stat.label} className="glass-warm rounded-xl p-4">
              <p className="font-display text-3xl font-black mb-1" style={{ color: 'var(--accent)' }}>{stat.value}</p>
              <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="px-6 py-16">
        <div className="h-px w-8 mb-4" style={{ background: 'var(--accent)' }} />
        <h2 className="font-display text-4xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Skills</h2>
        <div className="space-y-4">
          {skills.map(skill => (
            <div key={skill.category} className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{skill.icon}</span>
                <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{skill.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.items.map(item => (
                  <span key={item} className="px-2.5 py-1 rounded-md font-mono text-xs" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="px-6 py-16">
        <div className="h-px w-8 mb-4" style={{ background: 'var(--accent)' }} />
        <h2 className="font-display text-4xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Projects</h2>
        <div className="space-y-5">
          {projects.map(p => (
            <div key={p.id} className="glass rounded-2xl p-5 overflow-hidden">
              <div className="h-0.5 -mx-5 -mt-5 mb-5" style={{ background: p.color }} />
              <h3 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
              <p className="font-mono text-xs mb-3" style={{ color: 'var(--accent)' }}>{p.subtitle}</p>
              <p className="font-body text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded font-mono text-xs" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>{t}</span>
                ))}
              </div>
              {p.links.live && (
                <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="font-mono text-xs" style={{ color: p.color }}>
                  View Live ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="px-6 py-16">
        <div className="h-px w-8 mb-4" style={{ background: 'var(--accent)' }} />
        <h2 className="font-display text-4xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Experience</h2>
        <div className="space-y-5">
          {experience.map(exp => (
            <div key={exp.id} className="glass rounded-xl p-5">
              <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{exp.duration}</span>
              <h3 className="font-display text-xl font-bold mt-1 mb-0.5" style={{ color: 'var(--text-primary)' }}>{exp.role}</h3>
              <p className="font-body text-sm font-medium mb-3" style={{ color: 'var(--accent)' }}>@ {exp.company}</p>
              <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 py-16">
        <div className="h-px w-8 mb-4" style={{ background: 'var(--accent)' }} />
        <h2 className="font-display text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{contact.headline}</h2>
        <p className="font-body text-base mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{contact.subtext}</p>
        <a
          href={`mailto:${personal.email}`}
          className="block w-full py-4 rounded-xl text-center font-body text-sm font-semibold"
          style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
        >
          Email Me ☕
        </a>
        <div className="mt-8 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="font-mono text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} {personal.name}. Built with ☕
          </p>
        </div>
      </section>
    </div>
  )
}
