import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Mail, Lock, ArrowRight, Eye, EyeOff, Brain, Zap, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, delay, ease: [0.16,1,0.3,1] } },
})

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex overflow-hidden">

      {/* ── Left decorative panel ─────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-950 to-ink" />
        <div className="absolute inset-0 bg-grid opacity-25" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-96 h-96 bg-brand-600/[0.1] rounded-full blur-[80px]" />
        <div className="absolute -inset-px border-r border-line/40" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center shadow-glow">
            <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-fg tracking-tight">NutriAI</span>
        </div>

        {/* Feature pills */}
        <motion.div
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="relative space-y-4"
        >
          {[
            { Icon: Brain,  label: 'RAG-powered answers', sub: 'Grounded in your documents' },
            { Icon: Zap,    label: 'Instant semantic search', sub: 'Find anything, fast' },
            { Icon: Shield, label: 'Private & secure',    sub: 'Your data, your control' },
          ].map(({ Icon, label, sub }) => (
            <motion.div key={label}
              variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16,1,0.3,1] } } }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-ink-800/60 border border-line/60 backdrop-blur-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-brand-400" strokeWidth={1.8} size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-fg">{label}</p>
                <p className="text-xs text-fg-muted">{sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quote */}
        <div className="relative">
          <p className="text-fg-muted text-sm italic leading-relaxed">
            "The best nutrition advice is evidence-based. NutriAI brings that to every query."
          </p>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-ink" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/[0.04] rounded-full blur-3xl" />

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden" animate="show"
          className="relative w-full max-w-sm"
        >
          {/* Mobile logo */}
          <motion.div variants={fadeUp(0)} className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-fg tracking-tight">NutriAI</span>
          </motion.div>

          {/* Header */}
          <motion.div variants={fadeUp(0)} className="mb-8">
            <h1 className="text-2xl font-bold text-fg tracking-tight mb-1.5">Welcome back</h1>
            <p className="text-fg-muted text-sm">Sign in to your account to continue</p>
          </motion.div>

          {/* Form */}
          <motion.form variants={fadeUp(0.05)} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle pointer-events-none" />
                <input
                  type="email" required autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email} onChange={set('email')}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'} required autoComplete="current-password"
                  placeholder="Your password"
                  value={form.password} onChange={set('password')}
                  className="input pl-10 pr-10"
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3 text-sm mt-2 glow"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign in <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.p variants={fadeUp(0.1)} className="text-center text-fg-subtle text-sm mt-6">
            No account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one free
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
