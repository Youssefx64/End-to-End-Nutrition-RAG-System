import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, FileText, User,
  LogOut, Menu, X, Leaf, ChevronRight, Settings
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard', label: 'Dashboard',  Icon: LayoutDashboard, desc: 'Overview & stats' },
  { to: '/chat',      label: 'AI Chat',    Icon: MessageSquare,   desc: 'Ask questions' },
  { to: '/documents', label: 'Documents',  Icon: FileText,        desc: 'Manage files' },
  { to: '/profile',   label: 'Profile',    Icon: User,            desc: 'Account settings' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const location         = useLocation()
  const [mobile, setMobile] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.username?.[0] || '?').toUpperCase()

  return (
    <div className="flex h-screen overflow-hidden bg-ink">

      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[220px] shrink-0 border-r border-line/60 bg-ink-950/80 backdrop-blur-xl">
        <Sidebar user={user} initials={initials} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile overlay ──────────────────────────────── */}
      <AnimatePresence>
        {mobile && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm md:hidden"
              onClick={() => setMobile(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[220px] flex flex-col
                         border-r border-line bg-ink-950 md:hidden"
            >
              <Sidebar user={user} initials={initials} onLogout={handleLogout} onClose={() => setMobile(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Content ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between h-14 px-4 border-b border-line/60 bg-ink-950/80 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center">
              <Leaf className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-fg text-sm tracking-tight">NutriAI</span>
          </div>
          <button onClick={() => setMobile(true)}
            className="btn-icon">
            <Menu className="w-4.5 h-4.5" size={18} />
          </button>
        </header>

        {/* Page content with animated route transition */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function Sidebar({ user, initials, onLogout, onClose }) {
  return (
    <div className="flex flex-col h-full">

      {/* Logo row */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-line/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center shadow-glow-sm">
            <Leaf className="w-3 h-3 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-fg text-sm tracking-tight">NutriAI</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn-icon w-7 h-7">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(({ to, label, Icon, desc }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => `
              group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
              font-medium transition-all duration-150 cursor-pointer
              ${isActive
                ? 'text-fg bg-ink-700 shadow-card'
                : 'text-fg-muted hover:text-fg hover:bg-ink-800'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon size={16} className={isActive ? 'text-brand-400' : 'text-fg-subtle group-hover:text-fg-muted'} strokeWidth={1.8} />
                <span className="flex-1 text-[13px]">{label}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="px-4 shrink-0"><div className="border-t border-line/60" /></div>

      {/* User footer */}
      <div className="p-3 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-ink-800 transition-colors group cursor-default">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-emerald-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-glow-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-fg truncate leading-tight">
              {user?.full_name || user?.username}
            </p>
            <p className="text-[11px] text-fg-subtle truncate leading-tight">{user?.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center text-fg-subtle hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
