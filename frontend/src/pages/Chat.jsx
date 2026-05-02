import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Send, User, Trash2, Sparkles, ChevronDown, CornerDownLeft } from 'lucide-react'
import { nlpApi } from '../services/api'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

const PROJECT_ID = 1

const SUGGESTIONS = [
  'What are the best sources of plant-based protein?',
  'How does fiber intake affect gut health?',
  'What vitamins are found in leafy greens?',
  'Explain the role of omega-3 fatty acids',
]

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [limit, setLimit]       = useState(5)
  const [atBottom, setAtBottom] = useState(true)
  const bottomRef               = useRef(null)
  const textareaRef             = useRef(null)
  const scrollRef               = useRef(null)

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 60)
  }

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  const sendMessage = async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return
    setMessages(m => [...m, { id: Date.now(), role: 'user', content: q }])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setLoading(true)
    try {
      const { data } = await nlpApi.answer(PROJECT_ID, { text: q, limit })
      setMessages(m => [...m, {
        id: Date.now() + 1, role: 'ai',
        content: data.answer || 'No answer returned.',
      }])
    } catch (err) {
      setMessages(m => [...m, {
        id: Date.now() + 1, role: 'error',
        content: err.response?.data?.Signal || 'Could not get an answer. Make sure you have uploaded and indexed documents.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const clearChat = () => { setMessages([]); toast.success('Chat cleared') }

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-line/60 bg-ink-950/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-400" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-fg tracking-tight leading-none">AI Nutrition Assistant</h1>
            <p className="text-2xs text-fg-subtle mt-0.5">RAG-powered · Project #{PROJECT_ID}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-2xs text-fg-subtle">Context</span>
            <select
              value={limit} onChange={e => setLimit(Number(e.target.value))}
              className="bg-ink-800 border border-line text-fg-muted text-xs rounded-lg
                         px-2 py-1 focus:outline-none focus:border-brand-500/40 cursor-pointer"
            >
              {[3,5,8,10].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {messages.length > 0 && (
            <button onClick={clearChat}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-fg-subtle hover:text-red-400 hover:bg-red-500/10 transition-all">
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ────────────────────────────────────── */}
      <div ref={scrollRef} onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4"
        style={{ scrollbarGutter: 'stable' }}
      >
        {messages.length === 0 ? (
          <EmptyState onSuggest={sendMessage} />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
              >
                <MessageBubble msg={msg} />
              </motion.div>
            ))}

            {loading && (
              <motion.div key="typing"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 items-end"
              >
                <AiAvatar />
                <div className="px-4 py-3 bg-ink-800 border border-line rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1 items-center">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-brand-400/60 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.18}s` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Scroll-to-bottom button */}
      <AnimatePresence>
        {!atBottom && messages.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-[88px] left-1/2 -translate-x-1/2
                       flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-ink-700 border border-line text-xs text-fg-muted
                       hover:text-fg hover:border-line-bright shadow-card transition-all z-10"
          >
            <ChevronDown className="w-3.5 h-3.5" /> Latest
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Input ───────────────────────────────────────── */}
      <div className="shrink-0 px-4 md:px-6 py-4 border-t border-line/60 bg-ink-950/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2.5 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => { setInput(e.target.value); autoResize() }}
                onKeyDown={handleKey}
                placeholder="Ask about nutrition, health, or your documents…"
                disabled={loading}
                className="w-full bg-ink-800 border border-line rounded-2xl px-4 py-3
                           text-fg placeholder:text-fg-subtle text-sm resize-none
                           focus:outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/10
                           transition-all duration-200 min-h-[46px] max-h-40
                           disabled:opacity-60"
              />
            </div>
            <motion.button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              whileTap={{ scale: 0.92 }}
              className="w-[46px] h-[46px] rounded-2xl bg-brand-600 hover:bg-brand-500
                         disabled:opacity-30 disabled:cursor-not-allowed
                         flex items-center justify-center transition-all duration-200
                         shadow-glow-sm hover:shadow-glow shrink-0"
            >
              <Send className="w-4 h-4 text-white" strokeWidth={2} />
            </motion.button>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <CornerDownLeft className="w-3 h-3 text-fg-subtle" />
            <p className="text-2xs text-fg-subtle">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────────── */
function AiAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600/30 to-emerald-600/30 border border-brand-500/30 flex items-center justify-center shrink-0">
      <Leaf className="w-3.5 h-3.5 text-brand-400" />
    </div>
  )
}

function UserAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-ink-700 border border-line flex items-center justify-center shrink-0">
      <User className="w-3.5 h-3.5 text-fg-subtle" />
    </div>
  )
}

function MessageBubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end gap-2.5 items-end">
        <div className="max-w-[82%] md:max-w-[65%] px-4 py-3 rounded-2xl rounded-br-sm
                        bg-brand-600/15 border border-brand-500/20 text-fg text-sm leading-relaxed">
          {msg.content}
        </div>
        <UserAvatar />
      </div>
    )
  }

  if (msg.role === 'error') {
    return (
      <div className="flex gap-3 items-end">
        <AiAvatar />
        <div className="max-w-[82%] px-4 py-3 rounded-2xl rounded-tl-sm
                        bg-red-500/[0.08] border border-red-500/20 text-red-300 text-sm leading-relaxed">
          {msg.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 items-end max-w-[92%] md:max-w-[78%]">
      <AiAvatar />
      <div className="px-4 py-3 bg-ink-800 border border-line rounded-2xl rounded-tl-sm">
        <div className="prose-chat">
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onSuggest }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
      className="flex flex-col items-center justify-center min-h-full py-12 px-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5 shadow-glow-sm"
      >
        <Sparkles className="w-6 h-6 text-brand-400" strokeWidth={1.5} />
      </motion.div>

      <h2 className="text-xl font-semibold text-fg tracking-tight mb-2">Ask your nutrition AI</h2>
      <p className="text-fg-muted text-sm mb-8 max-w-sm leading-relaxed">
        Ask questions about your uploaded documents. The AI retrieves relevant context to generate accurate, grounded answers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
        {SUGGESTIONS.map((s, i) => (
          <motion.button key={i}
            onClick={() => onSuggest(s)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.16,1,0.3,1] }}
            whileHover={{ y: -1 }}
            className="text-left text-xs text-fg-muted px-4 py-3 rounded-xl
                       bg-ink-800 border border-line hover:border-brand-500/30
                       hover:text-fg hover:bg-ink-700 transition-all duration-200"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
