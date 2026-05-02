import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  Upload, FileText, CheckCircle2, XCircle, Loader2, Zap,
  Search, AlertCircle, RefreshCw, Layers, File, X, Sparkles
} from 'lucide-react'
import { dataApi, nlpApi } from '../services/api'
import toast from 'react-hot-toast'

const PROJECT_ID = 1

export default function Documents() {
  const [files, setFiles]   = useState([])
  const [search, setSearch] = useState('')

  const addFiles = useCallback((accepted) => {
    const newItems = accepted.map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      name: f.name,
      size: f.size,
      step: 'idle',
      progress: 0,
      fileId: null,
      error: null,
    }))
    setFiles(prev => [...prev, ...newItems])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: addFiles,
    accept: { 'text/plain': ['.txt'], 'application/pdf': ['.pdf'] },
    maxSize: 20 * 1024 * 1024,
    onDropRejected: (r) => toast.error(`${r[0]?.file?.name}: ${r[0]?.errors[0]?.message}`),
  })

  const updateFile = (id, patch) =>
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f))

  const processFile = async (item) => {
    if (!['idle','error'].includes(item.step)) return
    updateFile(item.id, { step: 'uploading', progress: 0, error: null })
    try {
      const fd = new FormData(); fd.append('file', item.file)
      const upRes = await dataApi.uploadFile(PROJECT_ID, fd)
      const fileId = upRes.data.file_id || upRes.data.asset_id || upRes.data.id
      updateFile(item.id, { step: 'processing', fileId, progress: 100 })

      await dataApi.processFile(PROJECT_ID, fileId)
      updateFile(item.id, { step: 'indexing' })

      await nlpApi.pushIndex(PROJECT_ID)
      updateFile(item.id, { step: 'done' })
      toast.success(`${item.name} indexed!`)
    } catch (err) {
      const msg = err.response?.data?.Signal || err.response?.data?.detail || 'Processing failed'
      updateFile(item.id, { step: 'error', error: msg })
      toast.error(`Failed: ${item.name}`)
    }
  }

  const processAll = () => {
    const pending = files.filter(f => ['idle','error'].includes(f.step))
    if (!pending.length) { toast('No files to process'); return }
    pending.forEach(processFile)
  }

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id))

  const filtered    = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
  const doneCount   = files.filter(f => f.step === 'done').length
  const pendingCount = files.filter(f => ['idle','error'].includes(f.step)).length
  const activeCount  = files.filter(f => ['uploading','processing','indexing'].includes(f.step)).length

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">

      {/* ── Header ─────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}>
        <h1 className="text-2xl font-bold text-fg tracking-tight">Documents</h1>
        <p className="text-fg-muted text-sm mt-1">Upload and index documents to power your AI knowledge base.</p>
      </motion.div>

      {/* ── Stats strip ──────────────────────────────────── */}
      {files.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex gap-3 flex-wrap"
        >
          {[
            { label: 'Total', value: files.length, cls: '' },
            { label: 'Indexed', value: doneCount, cls: 'text-brand-400' },
            { label: 'Pending', value: pendingCount, cls: 'text-amber-400' },
            { label: 'Active', value: activeCount, cls: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-800 border border-line">
              <span className={`text-sm font-semibold ${s.cls || 'text-fg'}`}>{s.value}</span>
              <span className="text-xs text-fg-subtle">{s.label}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── Dropzone ────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.16,1,0.3,1] }}
      >
        <div {...getRootProps()}
          className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer
            outline-none transition-all duration-300
            ${isDragActive
              ? 'border-brand-500/60 bg-brand-500/[0.06] scale-[1.01]'
              : 'border-line hover:border-line-bright hover:bg-ink-800/40'
            }`}
        >
          <input {...getInputProps()} />
          <motion.div animate={isDragActive ? { y: -4 } : { y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
              isDragActive ? 'bg-brand-500/15 border-brand-500/40 shadow-glow-sm' : 'bg-ink-800 border-line'
            }`}>
              <Upload className={`w-6 h-6 ${isDragActive ? 'text-brand-400' : 'text-fg-subtle'}`} strokeWidth={1.5} />
            </div>
            <div>
              <p className={`font-medium text-sm mb-1 ${isDragActive ? 'text-brand-300' : 'text-fg'}`}>
                {isDragActive ? 'Drop to upload' : 'Drop files here or click to browse'}
              </p>
              <p className="text-fg-subtle text-xs">PDF and TXT files · max 20 MB each</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Actions bar ─────────────────────────────────── */}
      {files.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fg-subtle" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search files…"
              className="input pl-9 py-2 text-sm"
            />
          </div>
          {pendingCount > 0 && (
            <button onClick={processAll} className="btn-primary text-sm py-2 gap-1.5 shrink-0">
              <Zap className="w-3.5 h-3.5" />
              Process all ({pendingCount})
            </button>
          )}
        </motion.div>
      )}

      {/* ── File list ────────────────────────────────────── */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map(item => (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16,1,0.3,1] }}
            >
              <FileRow item={item} onProcess={() => processFile(item)} onRemove={() => removeFile(item.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Empty state ──────────────────────────────────── */}
      {files.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="card p-12 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-ink-800 border border-line flex items-center justify-center mx-auto mb-4">
            <Layers className="w-5 h-5 text-fg-subtle" strokeWidth={1.5} />
          </div>
          <p className="text-fg font-medium text-sm">No documents yet</p>
          <p className="text-fg-subtle text-xs mt-1">Drop files above to get started</p>
        </motion.div>
      )}
    </div>
  )
}

/* ── FileRow component ──────────────────────────────────────── */
function FileRow({ item, onProcess, onRemove }) {
  const stepMeta = {
    idle:       { badge: 'badge-gray',  label: 'Ready',     iconCls: 'text-fg-subtle bg-ink-800 border-line' },
    uploading:  { badge: 'badge-blue',  label: 'Uploading…',iconCls: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    processing: { badge: 'badge-amber', label: 'Chunking…', iconCls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    indexing:   { badge: 'badge-blue',  label: 'Indexing…', iconCls: 'text-brand-400 bg-brand-500/10 border-brand-500/20' },
    done:       { badge: 'badge-green', label: 'Indexed',   iconCls: 'text-brand-400 bg-brand-500/10 border-brand-500/20' },
    error:      { badge: 'badge-red',   label: 'Failed',    iconCls: 'text-red-400 bg-red-500/10 border-red-500/20' },
  }

  const { badge, label, iconCls } = stepMeta[item.step] || stepMeta.idle
  const isWorking = ['uploading','processing','indexing'].includes(item.step)
  const pct = item.progress

  return (
    <div className={`card p-4 flex items-center gap-4 transition-all duration-300 ${
      item.step === 'done'  ? 'border-brand-500/20' :
      item.step === 'error' ? 'border-red-500/20'   : ''
    }`}>
      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${iconCls}`}>
        {isWorking
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : item.step === 'done'
            ? <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
            : item.step === 'error'
              ? <XCircle className="w-4 h-4" />
              : <File className="w-4 h-4" strokeWidth={1.8} />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-fg truncate">{item.name}</p>
          <span className={`${badge} shrink-0`}>{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-fg-subtle">{fmtBytes(item.size)}</span>
          {isWorking && (
            <div className="flex-1 h-0.5 bg-ink-600 rounded-full overflow-hidden max-w-[120px]">
              <motion.div
                className="h-full bg-brand-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: pct ? `${pct}%` : '40%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}
          {item.error && <span className="text-xs text-red-400 truncate">{item.error}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {['idle','error'].includes(item.step) && (
          <button onClick={onProcess} className="btn-primary text-xs py-1.5 px-3 gap-1.5">
            {item.step === 'error' ? <RefreshCw className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
            {item.step === 'error' ? 'Retry' : 'Process'}
          </button>
        )}
        {!isWorking && (
          <button onClick={onRemove} className="btn-icon w-7 h-7 hover:text-red-400 hover:bg-red-500/10">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

function fmtBytes(b) {
  if (b < 1024) return `${b} B`
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 ** 2).toFixed(1)} MB`
}
