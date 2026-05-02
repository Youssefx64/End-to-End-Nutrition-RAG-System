import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Edit3, Save, X, Shield, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

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
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="mb-7">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Profile</h1>
        <p className="text-slate-400">Manage your account details.</p>
      </motion.div>

      {/* Avatar card */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
        className="card p-6 mb-5"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              {user?.full_name || user?.username}
            </h2>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <span className="badge badge-green mt-1.5">Active account</span>
          </div>
        </div>
      </motion.div>

      {/* Details card */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
        className="card p-6 mb-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">Account details</h3>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-ghost text-sm gap-1.5">
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="btn-ghost text-sm gap-1.5">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-1.5 px-3 gap-1.5">
                {saving ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Field
            Icon={User} label="Full name"
            value={editing ? undefined : (user?.full_name || '—')}
            editValue={form.full_name}
            editing={editing}
            onChange={v => setForm(f => ({ ...f, full_name: v }))}
            placeholder="Your full name"
          />
          <Field
            Icon={User} label="Username"
            value={editing ? undefined : user?.username}
            editValue={form.username}
            editing={editing}
            onChange={v => setForm(f => ({ ...f, username: v }))}
            placeholder="username"
            prefix="@"
          />
          <Field
            Icon={Mail} label="Email"
            value={user?.email}
            editing={false}
            readOnly
          />
        </div>
      </motion.div>

      {/* Security card */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
        className="card p-6 mb-5"
      >
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-400" /> Security
        </h3>
        <div className="py-3 px-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300 font-medium">Password</p>
            <p className="text-xs text-slate-500">••••••••••</p>
          </div>
          <span className="badge badge-green">Protected</span>
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        className="card p-6 border-red-500/10"
      >
        <h3 className="font-semibold text-white mb-4">Sign out</h3>
        <p className="text-slate-400 text-sm mb-4">
          You'll need to sign back in to access your knowledge base.
        </p>
        <button
          onClick={() => { logout(); window.location.href = '/' }}
          className="px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/8 text-sm font-medium transition-all duration-200"
        >
          Sign out
        </button>
      </motion.div>
    </div>
  )
}

function Field({ Icon, label, value, editValue, editing, onChange, placeholder, prefix, readOnly }) {
  return (
    <div>
      <label className="label flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
        {label}
      </label>
      {editing && !readOnly ? (
        <div className="relative">
          {prefix && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{prefix}</span>
          )}
          <input
            type="text"
            value={editValue}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`input ${prefix ? 'pl-7' : ''}`}
          />
        </div>
      ) : (
        <div className="py-2.5 px-4 rounded-xl bg-surface border border-surface-border text-sm text-slate-300">
          {value}
        </div>
      )}
    </div>
  )
}
