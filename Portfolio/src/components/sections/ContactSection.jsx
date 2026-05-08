import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../../hooks'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import { FiMail } from 'react-icons/fi'
import { API_URL } from '../../config'

async function sendEmail({ name, email, message }) {
  const response = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to send message')
  }
  return response.json()
}

function InputField({ label, name, type = 'text', value, onChange, placeholder, error, rows }) {
  const Tag = rows ? 'textarea' : 'input'
  return (
    <div>
      <label
        className="block font-mono text-xs mb-2 uppercase tracking-widest"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </label>
      <Tag
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        rows={rows}
        className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all duration-200"
        style={{
          background: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          border: `1px solid ${error ? '#ef4444' : 'var(--border)'}`,
          resize: rows ? 'none' : undefined,
          boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.15)' : undefined,
        }}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1.5 font-mono text-xs text-red-400"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContactSection({ data }) {
  const { ref, inView } = useInView(0.1)
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [errors, setErrors]   = useState({})
  const [status, setStatus]   = useState(null) // null | 'sending' | 'sent' | 'error'
  const [errMsg, setErrMsg]   = useState('')



  if (!data) return null

  const { contact, personal } = data

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())                          errs.name    = 'Name is required'
    if (!form.email.trim())                         errs.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))     errs.email   = 'Enter a valid email'
    if (form.message.trim().length < 10)            errs.message = 'Message must be at least 10 characters'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setStatus('sending')
    setErrMsg('')

    try {

      await sendEmail(form)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error('EmailJS error:', err)
      setErrMsg(
        err?.text ||
        'Something went wrong. Please email me directly at ' + personal.email
      )
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section-wrapper min-h-screen py-32">
      <div ref={ref} className="content-overlay max-w-6xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
          >
            <div className="h-px w-12" style={{ background: 'var(--accent)' }} />
            <span className="font-mono text-sm tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              Contact
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
            {contact.headline}
          </motion.h2>

          <motion.p
            className="font-body text-base max-w-xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            {contact.subtext}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left side info */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            {/* Availability */}
            <div className="glass-warm rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                  Status
                </span>
              </div>
              <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
                {contact.availability}
              </p>
            </div>

            {/* Contact links */}
            {[
              { label: 'Email', value: personal.email, href: `mailto:${personal.email}`, icon: <FiMail /> },
              { label: 'GitHub', value: 'sanjaychalawariya', href: personal.github, icon: <FaGithub /> },
              { label: 'LinkedIn', value: 'sanjaychalawariya', href: personal.linkedin, icon: <FaLinkedin /> },
              { label: 'LeetCode', value: 'sanjaychalawariya', href: personal.leetcode, icon: <SiLeetcode /> },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass rounded-xl p-4 group interactive transition-all duration-200 hover:scale-102"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
                style={{ textDecoration: 'none' }}
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-mono text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                  <p className="font-body text-sm font-medium group-hover:text-amber-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    {item.value}
                  </p>
                </div>
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }}>↗</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  className="glass-warm rounded-3xl p-12 flex flex-col items-center justify-center text-center"
                  style={{ minHeight: 420 }}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                >
                  <motion.div
                    className="text-7xl mb-6"
                    animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.12, 1] }}
                    transition={{ duration: 0.6 }}
                  >
                    ☕
                  </motion.div>
                  <h3 className="font-display text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Message sent!
                  </h3>
                  <p className="font-body text-base mb-6" style={{ color: 'var(--text-secondary)' }}>
                    I'll respond within 24 hours, coffee in hand.
                  </p>
                  <button
                    onClick={() => setStatus(null)}
                    className="font-mono text-sm underline"
                    style={{ color: 'var(--accent)' }}
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                /* ── Form state ── */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="glass rounded-3xl p-8 space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  noValidate
                >
                  <InputField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={contact.formPlaceholders.name}
                    error={errors.name}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={contact.formPlaceholders.email}
                    error={errors.email}
                  />
                  <InputField
                    label="Message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder={contact.formPlaceholders.message}
                    error={errors.message}
                    rows={5}
                  />

                  {/* Server error banner */}
                  <AnimatePresence>
                    {status === 'error' && errMsg && (
                      <motion.div
                        className="flex items-start gap-3 px-4 py-3 rounded-xl"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <span className="text-red-400 mt-0.5">⚠</span>
                        <p className="font-body text-sm text-red-400">{errMsg}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-4 rounded-xl font-body text-sm font-semibold transition-all duration-200 interactive flex items-center justify-center gap-3"
                    style={{
                      background: status === 'error' ? '#9B1C1C' : 'var(--accent)',
                      color: 'var(--bg-primary)',
                      opacity: status === 'sending' ? 0.75 : 1,
                      cursor: status === 'sending' ? 'wait' : 'pointer',
                    }}
                    whileHover={status !== 'sending' ? { scale: 1.02 } : {}}
                    whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
                  >
                    {status === 'sending' ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{ display: 'inline-block' }}
                        >
                          ☕
                        </motion.span>
                        Brewing your message…
                      </>
                    ) : status === 'error' ? (
                      'Try again →'
                    ) : (
                      'Send Message ☕'
                    )}
                  </motion.button>


                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-24 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border)' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} {personal.name}. Brewed with ☕ + React + Three.js
          </p>
          <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {personal.location}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
