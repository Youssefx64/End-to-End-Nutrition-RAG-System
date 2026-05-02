import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Send, User, Trash2, MessageSquare, Sparkles, ChevronDown } from 'lucide-react'
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
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [limit, setLimit]         = useState(5)
  const bottomRef                 = useRef(null)
  const inputRef                  = useRef(null)
  const textareaRef               = useRef(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  const sendMessage = async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return

    const userMsg = { id: Date.now(), role: 'user', content: q }
    setMessages(m => [...m, userMsg])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setLoading(true)

    try {
      const { data } = await nlpApi.answer(PROJECT_ID, { text: q, limit })
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: data.answer || 'No answer returned.',
        sources: data.full_prompt,
      }
      setMessages(m => [...m, aiMsg])
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        role: 'error',
        content: err.response?.data?.Signal || 'Could not get an answer. Make sure you have uploaded and indexed documents first.',
      }
      setMessages(m => [...m, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    toast.success('Chat cleared')
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-card/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600/15 border border-brand-500/20 flex items-center justify-center">
            <MessageSquare className="w-4.5 h-4.5 text-brand-400" />
          </div>
          <div>
            <h1 className="font-semibold text-white text-sm">AI Nutrition Assistant</h1>
            <p className="text-xs text-slate-500">Powered by RAG · Project #{PROJECT_ID}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Results:</label>
            <select
              value={limit}
              onChange={e => setLimit(Number(e.target.value))}
              className="bg-surface-card border border-surface-border text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
            >
              {[3, 5, 8, 10].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat} className="btn-ghost text-xs gap-1.5 text-slate-500">
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">
        {messages.length === 0 ? (
          <EmptyState onSuggest={sendMessage} />
        ) : (
          <>
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageBubble msg={msg} />
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center shrink-0">
                  <Leaf className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-surface-card border border-surface-border rounded-2xl rounded-tl-sm">
                  <span className="flex gap-1">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                  <span className="text-slate-400 text-sm">Thinking…</span>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 md:px-6 py-4 border-t border-surface-border bg-surface-card/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => { setInput(e.target.value); autoResize() }}
                onKeyDown={handleKey}
                placeholder="Ask about nutrition, health, or your documents…"
                disabled={loading}
                className="w-full bg-surface-card border border-surface-border rounded-2xl px-4 py-3 pr-4
                           text-slate-100 placeholder-slate-500 text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50
                           transition-all duration-200 min-h-[46px] max-h-40"
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed
                         flex items-center justify-center transition-all duration-200 active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-2 text-center">
            Answers are grounded in your indexed documents · Press Enter to send
          </p>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="flex gap-3 items-end max-w-[80%] md:max-w-[65%]">
          <div className="px-4 py-3 bg-brand-600/20 border border-brand-500/25 rounded-2xl rounded-br-sm text-slate-200 text-sm leading-relaxed">
            {msg.content}
          </div>
          <div className="w-7 h-7 rounded-full bg-surface-card border border-surface-border flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    )
  }

  if (msg.role === 'error') {
    return (
      <div className="flex gap-3 max-w-[80%]">
        <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
          <Leaf className="w-3.5 h-3.5 text-red-400" />
        </div>
        <div className="px-4 py-3 bg-red-500/8 border border-red-500/20 rounded-2xl rounded-tl-sm text-red-300 text-sm leading-relaxed">
          {msg.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 max-w-[90%] md:max-w-[75%]">
      <div className="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center shrink-0 mt-1">
        <Leaf className="w-3.5 h-3.5 text-brand-400" />
      </div>
      <div className="px-4 py-3 bg-surface-card border border-surface-border rounded-2xl rounded-tl-sm text-slate-200 text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
        <ReactMarkdown>{msg.content}</ReactMarkdown>
      </div>
    </div>
  )
}

function EmptyState({ onSuggest }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full py-16 px-4 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-600/15 border border-brand-500/20 flex items-center justify-center mb-5">
        <Sparkles className="w-6 h-6 text-brand-400" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Ask your nutrition AI</h2>
      <p className="text-slate-400 text-sm mb-8 max-w-sm">
        Ask questions about your uploaded documents. The AI will retrieve relevant context and generate accurate answers.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg w-full">
        {SUGGESTIONS.map((s, i) => (
          <button key={i} onClick={() => onSuggest(s)}
            className="text-left text-sm text-slate-300 px-4 py-3 rounded-xl bg-surface-card border border-surface-border hover:border-brand-500/30 hover:text-slate-100 transition-all duration-200"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
