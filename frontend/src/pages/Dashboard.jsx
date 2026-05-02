import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, MessageSquare, Zap, TrendingUp, ArrowRight,
  Plus, CheckCircle2, AlertCircle, Database, Activity,
  ArrowUpRight, Layers
} from 'lucide-react'
import { nlpApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const item = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease: [0.16,1,0.3,1] } }),
}

const PROJECT_ID = 1

export default function Dashboard() {
  const { user }    = useAuth()
  const [info, setInfo]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    nlpApi.getIndexInfo(PROJECT_ID)
      .then(r => setInfo(r.data))
      .catch(() => setInfo(null))
      .finally(() => setLoading(false))
  }, [])

  const docCount = info?.collection_info?.record_count ?? 0
  const indexed  = docCount > 0
  const name     = user?.full_name?.split(' ')[0] || user?.username || 'there'

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-7">

      {/* ── Header ─────────────────────────────────────── */}
      <motion.div custom={0} variants={item} initial="hidden" animate="show">
        <p className="text-fg-subtle text-xs mb-1 tracking-wide uppercase">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-fg tracking-tight">
          Good {greeting()}, {name}
        </h1>
        <p className="text-fg-muted text-sm mt-1">Your nutrition knowledge base at a glance.</p>
      </motion.div>

      {/* ── Stat cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Indexed chunks', icon: Layers,
            value: loading ? null : String(docCount),
            accent: 'brand', custom: 0,
          },
          {
            label: 'Index status', icon: Activity,
            value: loading ? null : indexed ? 'Ready' : 'Empty',
            accent: indexed ? 'green' : 'gray', custom: 1,
          },
          {
            label: 'AI chat', icon: MessageSquare,
            value: 'Ask now', accent: 'blue', custom: 2, link: '/chat',
          },
          {
            label: 'Documents', icon: FileText,
            value: 'Upload', accent: 'violet', custom: 3, link: '/documents',
          },
        ].map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Quick actions ──────────────────────────────── */}
      <motion.div custom={4} variants={item} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <ActionCard
          to="/chat"
          Icon={MessageSquare}
          iconClass="text-brand-400"
          iconBg="bg-brand-500/10 border-brand-500/20"
          title="Start a conversation"
          desc="Ask your AI assistant about nutrition, get answers grounded in your documents."
          hoverBorder="hover:border-brand-500/30"
        />
        <ActionCard
          to="/documents"
          Icon={FileText}
          iconClass="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
          title="Manage documents"
          desc="Upload PDFs and text files, process them into your searchable knowledge base."
          hoverBorder="hover:border-blue-500/30"
        />
      </motion.div>

      {/* ── Status panel ───────────────────────────────── */}
      <motion.div custom={5} variants={item} initial="hidden" animate="show">
        <div className="card overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-line/60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <Database className="w-3.5 h-3.5 text-brand-400" />
              </div>
              <span className="text-sm font-medium text-fg">Knowledge Base</span>
            </div>
            <Link to="/documents"
              className="flex items-center gap-1 text-xs text-fg-muted hover:text-brand-400 transition-colors">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Panel body */}
          <div className="p-5">
            {loading ? (
              <div className="space-y-2.5">
                {[1,2,3].map(i => <div key={i} className="skeleton h-10 rounded-lg" />)}
              </div>
            ) : info?.collection_info ? (
              <div className="space-y-1">
                <Row label="Collection"
                  value={info.collection_info.table_info?.tablename || 'data_chunks'}
                  mono />
                <Row label="Indexed chunks"
                  value={info.collection_info.record_count ?? 0}
                  highlight={indexed} />
                <Row label="Vector search"
                  value={indexed ? 'Active' : 'No data yet'}
                  badge={indexed ? 'green' : 'gray'} />
              </div>
            ) : (
              <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/15">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-fg mb-0.5">No index found yet</p>
                  <p className="text-xs text-fg-muted">Upload and process documents to build your knowledge base.</p>
                </div>
                <Link to="/documents" className="btn-primary text-xs py-1.5 px-3 shrink-0">
                  <Plus className="w-3 h-3" /> Upload
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Getting started checklist ──────────────────── */}
      {!indexed && !loading && (
        <motion.div custom={6} variants={item} initial="hidden" animate="show">
          <div className="card p-5">
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-4">Getting started</p>
            <div className="space-y-3">
              {[
                { done: true,  label: 'Create your account', link: null },
                { done: false, label: 'Upload your first document', link: '/documents' },
                { done: false, label: 'Process and index documents', link: '/documents' },
                { done: false, label: 'Ask your first AI question', link: '/chat' },
              ].map((step, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm ${step.done ? 'text-fg-muted' : 'text-fg'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${step.done ? 'text-brand-500' : 'text-fg-subtle'}`} strokeWidth={step.done ? 2 : 1.5} />
                  {step.link && !step.done
                    ? <Link to={step.link} className="hover:text-brand-400 transition-colors">{step.label}</Link>
                    : <span className={step.done ? 'line-through opacity-50' : ''}>{step.label}</span>
                  }
                  {!step.done && step.link && (
                    <ArrowRight className="w-3 h-3 text-fg-subtle ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────────── */
function StatCard({ label, icon: Icon, value, accent, custom: c, link }) {
  const accents = {
    brand:  { icon: 'text-brand-400 bg-brand-500/10 border-brand-500/20', ring: 'hover:border-brand-500/30' },
    green:  { icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', ring: 'hover:border-emerald-500/30' },
    blue:   { icon: 'text-blue-400 bg-blue-500/10 border-blue-500/20', ring: 'hover:border-blue-500/30' },
    violet: { icon: 'text-violet-400 bg-violet-500/10 border-violet-500/20', ring: 'hover:border-violet-500/30' },
    gray:   { icon: 'text-fg-subtle bg-ink-600/60 border-line', ring: '' },
  }
  const { icon: iconCls, ring } = accents[accent] || accents.gray

  const card = (
    <motion.div custom={c} variants={item} initial="hidden" animate="show"
      whileHover={{ y: -2 }}
      className={`card p-4 ${ring} transition-all duration-200 cursor-default ${link ? 'cursor-pointer' : ''}`}
    >
      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${iconCls}`}>
        <Icon className="w-4 h-4" strokeWidth={1.8} />
      </div>
      {value === null ? (
        <div className="skeleton h-6 w-16 mb-1 rounded" />
      ) : (
        <p className="text-xl font-bold text-fg tracking-tight">{value}</p>
      )}
      <p className="text-xs text-fg-subtle mt-0.5">{label}</p>
    </motion.div>
  )

  return link ? <Link to={link}>{card}</Link> : card
}

function ActionCard({ to, Icon, iconClass, iconBg, title, desc, hoverBorder }) {
  return (
    <Link to={to} className={`card p-5 ${hoverBorder} transition-all duration-300 group flex items-start gap-4 block hover:bg-ink-800`}>
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconBg} group-hover:scale-105 transition-transform`}>
        <Icon className={`w-5 h-5 ${iconClass}`} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-fg tracking-tight">{title}</h3>
          <ArrowRight className="w-3.5 h-3.5 text-fg-subtle group-hover:text-fg group-hover:translate-x-0.5 transition-all" />
        </div>
        <p className="text-xs text-fg-muted leading-relaxed">{desc}</p>
      </div>
    </Link>
  )
}

function Row({ label, value, mono, highlight, badge }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-ink-800 transition-colors group">
      <span className="text-xs text-fg-muted">{label}</span>
      {badge ? (
        <span className={badge === 'green' ? 'badge-green' : 'badge-gray'}>{String(value)}</span>
      ) : (
        <span className={`text-xs font-medium ${mono ? 'font-mono text-brand-300' : ''} ${highlight ? 'text-brand-400' : 'text-fg'}`}>
          {String(value)}
        </span>
      )}
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
}
