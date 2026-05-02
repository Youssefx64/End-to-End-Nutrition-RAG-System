import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  Upload, FileText, CheckCircle, XCircle, Loader, Zap,
  Search, AlertCircle, RefreshCw, Layers
} from 'lucide-react'
import { dataApi, nlpApi } from '../services/api'
import toast from 'react-hot-toast'

const PROJECT_ID = 1

const STEPS = ['idle', 'uploading', 'processing', 'indexing', 'done', 'error']

export default function Documents() {
  const [files, setFiles]   = useState([])
  const [search, setSearch] = useState('')

  const addFiles = useCallback((accepted) => {
    const newFiles = accepted.map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      name: f.name,
      size: f.size,
      step: 'idle',
      progress: 0,
      fileId: null,
      error: null,
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: addFiles,
    accept: { 'text/plain': ['.txt'], 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (r) => toast.error(`${r[0]?.file?.name}: ${r[0]?.errors[0]?.message}`),
  })

  const updateFile = (id, patch) =>
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f))

  const processFile = async (item) => {
    if (item.step !== 'idle' && item.step !== 'error') return
    updateFile(item.id, { step: 'uploading', progress: 0, error: null })

    try {
      // Upload
      const upRes = await dataApi.upload(PROJECT_ID, item.file, (p) =>
        updateFile(item.id, { progress: p })
      )
      const fileId = upRes.data.file_id
      updateFile(item.id, { step: 'processing', fileId, progress: 100 })

      // Process (chunk)
      await dataApi.process(PROJECT_ID, {
        file_id: fileId,
        chunk_size: 512,
        overlap_size: 50,
        do_reset: 0,
      })
      updateFile(item.id, { step: 'indexing' })

      // Index into vector DB
      await nlpApi.pushIndex(PROJECT_ID, { do_reset: false })
      updateFile(item.id, { step: 'done' })
      toast.success(`${item.name} indexed successfully`)
    } catch (err) {
      const msg = err.response?.data?.signal || err.response?.data?.Signal || 'Processing failed'
      updateFile(item.id, { step: 'error', error: msg })
      toast.error(`Failed: ${item.name}`)
    }
  }

  const processAll = () => {
    const pending = files.filter(f => f.step === 'idle' || f.step === 'error')
    if (!pending.length) { toast('No files to process'); return }
    pending.forEach(processFile)
  }

  const removeFile = (id) =>
    setFiles(prev => prev.filter(f => f.id !== id))

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const doneCount    = files.filter(f => f.step === 'done').length
  const pendingCount = files.filter(f => f.step === 'idle' || f.step === 'error').length

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="mb-7">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Documents</h1>
        <p className="text-slate-400">Upload and index documents into your knowledge base.</p>
      </motion.div>

      {/* Drop zone */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
        className="mb-6"
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-brand-500 bg-brand-500/8'
              : 'border-surface-border hover:border-brand-500/40 hover:bg-surface-card'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              isDragActive ? 'bg-brand-500/15 border border-brand-500/30' : 'bg-surface-card border border-surface-border'
            }`}>
              <Upload className={`w-5 h-5 ${isDragActive ? 'text-brand-400' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className={`font-medium ${isDragActive ? 'text-brand-300' : 'text-slate-300'}`}>
                {isDragActive ? 'Drop files here' : 'Drag & drop files, or click to browse'}
              </p>
              <p className="text-slate-500 text-sm mt-1">PDF and TXT files up to 10MB</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions bar */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="flex items-center justify-between gap-4 mb-5"
        >
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search files…"
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">{doneCount}/{files.length} indexed</span>
            {pendingCount > 0 && (
              <button onClick={processAll} className="btn-primary text-sm py-2 gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Process all ({pendingCount})
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* File list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredFiles.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity:0, height:0 }}
              animate={{ opacity:1, height:'auto' }}
              exit={{ opacity:0, height:0 }}
              transition={{ duration:0.25 }}
            >
              <FileRow
                item={item}
                onProcess={() => processFile(item)}
                onRemove={() => removeFile(item.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {files.length === 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          className="card p-12 text-center"
        >
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No documents yet</p>
          <p className="text-slate-600 text-sm mt-1">Drop files above to get started</p>
        </motion.div>
      )}
    </div>
  )
}

function FileRow({ item, onProcess, onRemove }) {
  const icons = {
    idle:       { Icon: FileText,    color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
    uploading:  { Icon: Loader,      color: 'text-blue-400 animate-spin', bg: 'bg-blue-500/10 border-blue-500/20' },
    processing: { Icon: RefreshCw,   color: 'text-yellow-400 animate-spin', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    indexing:   { Icon: Zap,         color: 'text-brand-400 animate-pulse', bg: 'bg-brand-500/10 border-brand-500/20' },
    done:       { Icon: CheckCircle, color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20' },
    error:      { Icon: XCircle,     color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  }
  const stepLabels = {
    idle: 'Ready to process', uploading: 'Uploading…',
    processing: 'Chunking…', indexing: 'Indexing vectors…',
    done: 'Indexed', error: 'Failed',
  }

  const { Icon, color, bg } = icons[item.step]
  const isWorking = ['uploading','processing','indexing'].includes(item.step)

  return (
    <div className={`card p-4 flex items-center gap-4 transition-all duration-300 ${
      item.step === 'done' ? 'border-brand-500/15' :
      item.step === 'error' ? 'border-red-500/15' : ''
    }`}>
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
          <span className={`badge shrink-0 ${
            item.step === 'done' ? 'badge-green' :
            item.step === 'error' ? 'badge-red' :
            isWorking ? 'badge-blue' : 'badge-gray'
          }`}>{stepLabels[item.step]}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-500">{formatBytes(item.size)}</span>
          {isWorking && item.progress > 0 && (
            <div className="flex-1 h-1 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          )}
          {item.error && <span className="text-xs text-red-400 truncate">{item.error}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {(item.step === 'idle' || item.step === 'error') && (
          <button onClick={onProcess} className="btn-primary text-xs py-1.5 px-3">
            <Zap className="w-3.5 h-3.5" />
            {item.step === 'error' ? 'Retry' : 'Process'}
          </button>
        )}
        {!isWorking && (
          <button onClick={onRemove} className="btn-ghost text-xs p-1.5 text-slate-600 hover:text-red-400">
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

function formatBytes(b) {
  if (b < 1024) return `${b} B`
  if (b < 1024**2) return `${(b/1024).toFixed(1)} KB`
  return `${(b/1024**2).toFixed(1)} MB`
}
