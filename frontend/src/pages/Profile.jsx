import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Edit3, Save, X, Shield, LogOut, Key } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16,1,0.3,1] },
})

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const [editing, setEditing]        = useState(false)
  const [form, setForm]              = useState({ full_name: user?.full_name || '', username: user?.username || '' })
  const [saving, setSaving]          = useState(false)

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.username?.[0] || '?').toUpperCase()

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateUser(form)
      toast.success('Profile updated')
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({ full_name: user?.full_name || '', username: user?.username || '' })
    setEditing(false)
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-5">

      {/* ── Header ─────────────────────────────────────── */}
      <motion.div {...fadeIn(0)}>
        <h1 className="text-2xl font-bold text-fg tracking-tight">Profile</h1>
        <p className="text-fg-muted text-sm mt-1">Manage your account information.</p>
      </motion.div>

      {/* ── Avatar card ──────────────────────────────────── */}
      <motion.div {...fadeIn(0.05)}>
        <div className="card p-6 flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold shadow-glow">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-brand-500 border-2 border-ink-900 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-fg tracking-tight truncate">
              {user?.full_name || user?.username}
            </h2>
            <p className="text-fg-muted text-sm truncate">{user?.email}</p>
            <div className="mt-2">
              <span className="badge-green">Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Account details ──────────────────────────────── */}
      <motion.div {...fadeIn(0.1)}>
        <div className="card overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-line/60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.8} />
              </div>
              <span className="text-sm font-medium text-fg">Account details</span>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn-ghost text-xs gap-1.5 py-1.5">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="btn-ghost text-xs gap-1 py-1.5">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-1.5 px-3 gap-1.5">
                  {saving
                    ? <span className="w-3.5 h-3.5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                    : <Save className="w-3.5 h-3.5" />
                  }
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="p-5 space-y-4">
            <ProfileField
              Icon={User} label="Full name"
              value={user?.full_name || '—'}
              editValue={form.full_name}
              editing={editing}
              onChange={v => setForm(f => ({ ...f, full_name: v }))}
              placeholder="Your full name"
            />
            <ProfileField
              Icon={User} label="Username"
              value={`@${user?.username}`}
              editValue={form.username}
              editing={editing}
              onChange={v => setForm(f => ({ ...f, username: v }))}
              placeholder="username"
              prefix="@"
            />
            <ProfileField
              Icon={Mail} label="Email address"
              value={user?.email}
              readOnly
            />
          </div>
        </div>
      </motion.div>

      {/* ── Security ─────────────────────────────────────── */}
      <motion.div {...fadeIn(0.15)}>
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-line/60">
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-violet-400" strokeWidth={1.8} />
            </div>
            <span className="text-sm font-medium text-fg">Security</span>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-ink-800 border border-line">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-fg-subtle" strokeWidth={1.8} />
                <div>
                  <p className="text-sm font-medium text-fg">Password</p>
                  <p className="text-xs text-fg-subtle font-mono tracking-widest">••••••••••••</p>
                </div>
              </div>
              <span className="badge-green">Protected</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Sign out ─────────────────────────────────────── */}
      <motion.div {...fadeIn(0.2)}>
        <div className="card p-5 border-red-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fg">Sign out</p>
              <p className="text-xs text-fg-muted mt-0.5">You'll need to sign in again to access your account.</p>
            </div>
            <button
              onClick={() => { logout(); window.location.href = '/' }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/25 text-red-400 text-sm font-medium hover:bg-red-500/[0.08] hover:border-red-500/40 transition-all duration-200 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ── ProfileField ──────────────────────────────────────────── */
function ProfileField({ Icon, label, value, editValue, editing, onChange, placeholder, prefix, readOnly }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-fg-muted mb-1.5 tracking-wide">
        <Icon className="w-3.5 h-3.5" strokeWidth={1.8} /> {label}
      </label>
      {editing && !readOnly ? (
        <div className="relative">
          {prefix && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle text-sm pointer-events-none">{prefix}</span>
          )}
          <input
            type="text"
            value={editValue}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`input ${prefix ? 'pl-8' : ''}`}
          />
        </div>
      ) : (
        <div className="px-4 py-2.5 rounded-xl bg-ink-800 border border-line text-sm text-fg">
          {value}
        </div>
      )}
    </div>
  )
}
