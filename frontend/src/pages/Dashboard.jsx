import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, MessageSquare, Zap, TrendingUp, ArrowRight,
  Plus, Clock, CheckCircle, AlertCircle
} from 'lucide-react'
import { nlpApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

const PROJECT_ID = 1

export default function Dashboard() {
  const { user }         = useAuth()
  const [info, setInfo]  = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    nlpApi.getIndexInfo(PROJECT_ID)
      .then(r => setInfo(r.data))
      .catch(() => setInfo(null))
      .finally(() => setLoading(false))
  }, [])

  const docCount    = info?.collection_info?.record_count ?? '—'
  const indexed     = info?.collection_info?.record_count > 0

  const name = user?.full_name?.split(' ')[0] || user?.username || 'there'

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="mb-8">
        <motion.div variants={fadeUp}>
          <p className="text-slate-500 text-sm mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Good {getGreeting()}, {name} 👋
          </h1>
          <p className="text-slate-400 mt-1">Your nutrition knowledge base at a glance.</p>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <StatCard icon={FileText}    label="Indexed Chunks" value={loading ? '…' : docCount}       color="brand"  delay={0}   />
        <StatCard icon={CheckCircle} label="Index Status"   value={loading ? '…' : indexed ? 'Ready' : 'Empty'} color={indexed ? 'green' : 'gray'} delay={0.05} />
        <StatCard icon={MessageSquare} label="Ask Questions" value="AI Chat"  color="blue"   delay={0.1}  link="/chat" />
        <StatCard icon={Zap}         label="Process Docs"   value="Upload"   color="yellow" delay={0.15} link="/documents" />
      </motion.div>

      {/* Quick actions */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8"
      >
        <motion.div variants={fadeUp}>
          <Link to="/chat" className="card p-6 hover:border-brand-500/30 transition-all duration-300 group flex items-start gap-4 block">
            <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0 group-hover:bg-brand-500/20 transition-colors">
              <MessageSquare className="w-5 h-5 text-brand-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white">Start a conversation</h3>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-slate-400 text-sm">Ask your AI assistant about nutrition, get answers grounded in your documents.</p>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Link to="/documents" className="card p-6 hover:border-blue-500/30 transition-all duration-300 group flex items-start gap-4 block">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white">Manage documents</h3>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-slate-400 text-sm">Upload PDFs and text files, process them into your searchable knowledge base.</p>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Status panel */}
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-400" />
              Knowledge Base Status
            </h2>
            <Link to="/documents" className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1 transition-colors">
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}
            </div>
          ) : info?.collection_info ? (
            <div className="space-y-3">
              <InfoRow label="Collection"     value={info.collection_info.table_info?.tablename || 'N/A'} />
              <InfoRow label="Indexed chunks" value={info.collection_info.record_count ?? 0} />
              <InfoRow label="Vector search"  value={info.collection_info.record_count > 0 ? 'Active' : 'No data yet'} />
            </div>
          ) : (
            <div className="flex items-center gap-3 py-4 px-4 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
              <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <p className="text-slate-300 text-sm font-medium">No index found yet</p>
                <p className="text-slate-500 text-xs mt-0.5">Upload documents and process them to get started.</p>
              </div>
              <Link to="/documents" className="ml-auto btn-primary text-xs py-1.5 px-3">
                Upload <Plus className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, delay, link }) {
  const colors = {
    brand:  'bg-brand-500/10 border-brand-500/20 text-brand-400',
    green:  'bg-brand-500/10 border-brand-500/20 text-brand-400',
    blue:   'bg-blue-500/10 border-blue-500/20 text-blue-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    gray:   'bg-slate-500/10 border-slate-500/20 text-slate-400',
  }
  const card = (
    <div className="card p-5 hover:border-opacity-60 transition-all duration-300 group cursor-default">
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-slate-500 text-xs mt-0.5">{label}</p>
    </div>
  )
  return (
    <motion.div variants={{ hidden: { opacity:0, y:16 }, show: { opacity:1, y:0, transition:{ delay, duration:0.4 } } }}>
      {link ? <Link to={link}>{card}</Link> : card}
    </motion.div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-slate-200 text-sm font-medium">{String(value)}</span>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
