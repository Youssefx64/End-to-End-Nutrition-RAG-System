import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, delay, ease: [0.16,1,0.3,1] } },
})

const PERKS = [
  'Upload unlimited documents',
  'AI-powered RAG question answering',
  'Semantic vector search',
  'Private knowledge base',
]

export default function Register() {
  const [form, setForm]       = useState({ email: '', username: '', password: '', full_name: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const { register }          = useAuth()
  const navigate              = useNavigate()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form.email, form.username, form.password, form.full_name || undefined)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed. Try a different email or username.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex overflow-hidden">

      {/* ── Left panel ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-950 to-ink" />
        <div className="absolute inset-0 bg-grid opacity-25" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-80 h-80 bg-brand-600/[0.1] rounded-full blur-[80px]" />
        <div className="absolute -inset-px border-r border-line/40" />

        <div className="relative flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center shadow-glow">
            <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-fg tracking-tight">NutriAI</span>
        </div>

        <div className="relative">
          <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-6">
            What you get for free
          </p>
          <ul className="space-y-3">
            {PERKS.map((p, i) => (
              <motion.li key={p}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.16,1,0.3,1] }}
                className="flex items-center gap-3 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" strokeWidth={2} />
                <span className="text-fg-muted">{p}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-500/20 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-fg">NutriAI</p>
                <p className="text-2xs text-fg-subtle">AI Answer</p>
              </div>
            </div>
            <p className="text-xs text-fg-muted leading-relaxed">
              "Based on your nutrition documents, quinoa provides all 9 essential amino acids with 8g protein per cup cooked, making it an ideal complete plant protein…"
            </p>
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
        <div className="absolute inset-0 bg-ink" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-600/[0.04] rounded-full blur-3xl" />

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden" animate="show"
          className="relative w-full max-w-sm py-6"
        >
          {/* Mobile logo */}
          <motion.div variants={fadeUp(0)} className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-fg tracking-tight">NutriAI</span>
          </motion.div>

          <motion.div variants={fadeUp(0)} className="mb-7">
            <h1 className="text-2xl font-bold text-fg tracking-tight mb-1.5">Create your account</h1>
            <p className="text-fg-muted text-sm">Start building your nutrition knowledge base</p>
          </motion.div>

          <motion.form variants={fadeUp(0.05)} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Full name <span className="text-fg-subtle font-normal normal-case">(optional)</span></label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle pointer-events-none" />
                <input type="text" placeholder="Jane Doe" value={form.full_name} onChange={set('full_name')} className="input pl-10" />
              </div>
            </div>

            <div>
              <label className="input-label">Username</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle text-sm pointer-events-none">@</span>
                <input type="text" required placeholder="janedoe" value={form.username} onChange={set('username')} className="input pl-8" />
              </div>
            </div>

            <div>
              <label className="input-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle pointer-events-none" />
                <input type="email" required autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} className="input pl-10" />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'} required autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={form.password} onChange={set('password')}
                  className="input pl-10 pr-10"
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                      form.password.length >= i * 4 ? 'bg-brand-500' : 'bg-line'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3 text-sm mt-2 glow"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create free account <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </motion.button>
          </motion.form>

          <motion.p variants={fadeUp(0.1)} className="text-center text-fg-subtle text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
