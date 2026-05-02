import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Leaf, MessageSquare, FileText, Zap, Shield, BarChart3,
  ArrowRight, Sparkles, Brain, Upload, ChevronRight,
  Database, Search, Bot
} from 'lucide-react'

/* ── Animation variants ───────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] } },
})

const stagger = (delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: delay } },
})

export default function Landing() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const mockupY  = useTransform(scrollYProgress, [0, 1], [0, 80])
  const mockupOp = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <div className="min-h-screen bg-ink overflow-x-hidden">

      {/* ── Background ──────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]
                        bg-gradient-radial from-brand-600/[0.08] via-transparent to-transparent
                        rounded-full blur-3xl" />
        <div className="absolute -top-24 -left-48 w-[500px] h-[500px]
                        bg-brand-600/[0.05] rounded-full blur-[100px]" />
        <div className="absolute top-1/3 -right-48 w-[400px] h-[400px]
                        bg-blue-600/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px]
                        bg-emerald-600/[0.04] rounded-full blur-[80px]" />
      </div>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20"
      >
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center shadow-glow-sm">
              <Leaf className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-fg tracking-tight">NutriAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it works'].map(l => (
              <button key={l} className="text-sm text-fg-muted hover:text-fg transition-colors">{l}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
            <Link to="/register"
              className="btn-primary text-sm gap-1.5 py-2 px-4"
            >
              Get started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-8 text-center">
        <motion.div variants={stagger(0.1)} initial="hidden" animate="show">

          {/* Pill badge */}
          <motion.div variants={fadeUp(0)} className="inline-flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full
                            bg-brand-500/[0.08] border border-brand-500/20
                            text-brand-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
              RAG-powered AI for nutrition intelligence
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp(0.05)}
            className="text-5xl md:text-7xl font-bold tracking-tightest leading-[1.0] mb-6 text-fg"
          >
            Your AI nutrition
            <br />
            <span className="text-gradient">knowledge base</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p variants={fadeUp(0.1)}
            className="text-fg-muted text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Upload documents, ask questions in plain English, get precise answers
            grounded in evidence — not hallucinations.
          </motion.p>

          {/* CTA row */}
          <motion.div variants={fadeUp(0.15)} className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-4">
            <Link to="/register"
              className="btn-primary px-7 py-3 text-base gap-2 glow"
            >
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary px-7 py-3 text-base">
              Sign in
            </Link>
          </motion.div>
          <motion.p variants={fadeUp(0.18)} className="text-fg-subtle text-xs">
            No credit card required · Free to start
          </motion.p>
        </motion.div>

        {/* ── App Mockup ───────────────────────────────────── */}
        <motion.div
          style={{ y: mockupY, opacity: mockupOp }}
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16 max-w-4xl mx-auto"
        >
          {/* Glow behind mockup */}
          <div className="absolute -inset-8 bg-brand-600/[0.06] rounded-3xl blur-3xl" />

          {/* Browser chrome */}
          <div className="relative rounded-2xl overflow-hidden border border-line bg-ink-900 shadow-float">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-ink-950/80">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-brand-500/60" />
              </div>
              <div className="flex-1 mx-3">
                <div className="h-5 rounded-md bg-ink-700 flex items-center px-3 max-w-xs mx-auto">
                  <span className="text-fg-subtle text-[11px] font-mono">app.nutriai.com/chat</span>
                </div>
              </div>
            </div>

            {/* App chrome */}
            <div className="flex h-[400px] md:h-[440px]">
              {/* Fake sidebar */}
              <div className="w-14 border-r border-line bg-ink-950/60 flex flex-col items-center py-4 gap-3 shrink-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center mb-2">
                  <Leaf className="w-3.5 h-3.5 text-white" />
                </div>
                {[BarChart3, MessageSquare, FileText].map((Icon, i) => (
                  <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 1 ? 'bg-brand-600/15 text-brand-400' : 'text-fg-subtle'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                ))}
              </div>

              {/* Chat area */}
              <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 p-5 space-y-4 overflow-hidden">
                  <MockMessage role="user"    text="What are the best plant-based complete protein sources?" />
                  <MockMessage role="ai"      text="Based on your uploaded nutrition documents, the top complete plant proteins are **quinoa** (all 9 essential amino acids), **edamame** (18g per cup), and **tempeh** (31g per cup). Soy-based foods consistently rank highest for bioavailability and amino acid completeness." delay={0.6} />
                  <MockMessage role="user"    text="How does fiber affect gut microbiome diversity?" delay={0.9} />
                  <MockTyping delay={1.1} />
                </div>

                {/* Input */}
                <div className="px-4 pb-4 shrink-0">
                  <div className="flex items-center gap-2 bg-ink-800 border border-line rounded-xl px-4 py-2.5">
                    <span className="flex-1 text-fg-subtle text-sm">Ask a question about your documents…</span>
                    <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Social proof strip ────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-12"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          <p className="text-fg-subtle text-sm">Trusted technology stack</p>
          {['Cohere', 'OpenAI', 'pgvector', 'FastAPI', 'Qdrant'].map(name => (
            <span key={name} className="text-fg-subtle/60 text-sm font-medium tracking-wide">{name}</span>
          ))}
        </div>
      </motion.section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          variants={stagger()} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp()} className="text-brand-400 text-sm font-medium tracking-widest uppercase mb-3">
            Everything included
          </motion.p>
          <motion.h2 variants={fadeUp(0.05)}
            className="text-4xl md:text-5xl font-bold tracking-tight text-fg mb-4"
          >
            Built for precision
          </motion.h2>
          <motion.p variants={fadeUp(0.1)} className="text-fg-muted max-w-md mx-auto text-lg">
            Every feature designed to give you accurate, grounded answers from your own knowledge.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger()} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={fadeUp(i * 0.05)}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="card p-6 group hover:border-line-bright transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-ink-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`relative w-10 h-10 rounded-xl ${f.iconBg} border ${f.iconBorder} flex items-center justify-center mb-4 shadow-card`}>
                <f.Icon className={`w-5 h-5 ${f.iconColor}`} strokeWidth={1.8} />
              </div>
              <h3 className="relative font-semibold text-fg mb-2 tracking-tight">{f.title}</h3>
              <p className="relative text-fg-muted text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          variants={stagger()} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp()} className="text-brand-400 text-sm font-medium tracking-widest uppercase mb-3">
            Simple workflow
          </motion.p>
          <motion.h2 variants={fadeUp(0.05)} className="text-4xl md:text-5xl font-bold tracking-tight text-fg mb-4">
            Three steps to insight
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-line-bright to-transparent" />

          {steps.map((s, i) => (
            <motion.div key={i}
              variants={fadeUp(i * 0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-ink-800 border border-line flex items-center justify-center shadow-card">
                  <s.Icon className="w-7 h-7 text-brand-400" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-ink-950 border border-line flex items-center justify-center">
                  <span className="text-brand-400 text-2xs font-bold">{i + 1}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-fg text-lg tracking-tight mb-2">{s.title}</h3>
                <p className="text-fg-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950" />
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48
                          bg-brand-600/[0.12] rounded-full blur-3xl" />
          <div className="absolute -inset-px rounded-3xl border border-gradient" style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,.2), rgba(14,165,233,.1), rgba(168,85,247,.1)) border-box',
          }} />

          <div className="relative px-8 py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-700
                            flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Leaf className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-fg tracking-tight mb-4">
              Start building your knowledge base
            </h2>
            <p className="text-fg-muted mb-8 max-w-md mx-auto">
              Join and get precise, evidence-based answers from your own documents in minutes.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/register" className="btn-primary px-8 py-3 text-base glow">
                Create free account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3 text-base">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-line/60 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-brand-600" />
            <span className="text-fg-muted text-sm font-medium">NutriAI</span>
          </div>
          <p className="text-fg-subtle text-xs">© 2026 NutriAI · AI-powered nutrition intelligence</p>
        </div>
      </footer>
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────────── */
function MockMessage({ role, text, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-2.5 items-end ${role === 'user' ? 'justify-end' : ''}`}
    >
      {role === 'ai' && (
        <div className="w-6 h-6 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center shrink-0">
          <Leaf className="w-3 h-3 text-brand-400" />
        </div>
      )}
      <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed
        ${role === 'user'
          ? 'bg-brand-600/20 border border-brand-500/20 text-fg/90 rounded-br-sm'
          : 'bg-ink-800 border border-line text-fg-muted rounded-tl-sm'}`}
      >
        {text}
      </div>
    </motion.div>
  )
}

function MockTyping({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay }}
      className="flex gap-2.5 items-end"
    >
      <div className="w-6 h-6 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center shrink-0">
        <Leaf className="w-3 h-3 text-brand-400" />
      </div>
      <div className="px-3.5 py-3 bg-ink-800 border border-line rounded-2xl rounded-tl-sm flex gap-1">
        {[0,1,2].map(i => (
          <span key={i} className="w-1.5 h-1.5 bg-brand-400/60 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
    </motion.div>
  )
}

const features = [
  {
    Icon: Brain, title: 'RAG-Powered Answers',
    iconBg: 'bg-brand-500/10', iconBorder: 'border-brand-500/20', iconColor: 'text-brand-400',
    desc: 'Retrieval-augmented generation grounds every answer in your actual documents — no hallucinations.',
  },
  {
    Icon: Upload, title: 'Smart Document Processing',
    iconBg: 'bg-blue-500/10', iconBorder: 'border-blue-500/20', iconColor: 'text-blue-400',
    desc: 'Upload PDFs and text files. Automatic chunking, embedding, and vector indexing in seconds.',
  },
  {
    Icon: Search, title: 'Semantic Search',
    iconBg: 'bg-violet-500/10', iconBorder: 'border-violet-500/20', iconColor: 'text-violet-400',
    desc: 'Search semantically — find relevant content even when you use different words or phrasing.',
  },
  {
    Icon: MessageSquare, title: 'Conversational AI',
    iconBg: 'bg-cyan-500/10', iconBorder: 'border-cyan-500/20', iconColor: 'text-cyan-400',
    desc: 'Chat naturally with your knowledge base. Follow-ups, clarifications, deep exploration.',
  },
  {
    Icon: Shield, title: 'Private by Design',
    iconBg: 'bg-emerald-500/10', iconBorder: 'border-emerald-500/20', iconColor: 'text-emerald-400',
    desc: 'Your documents stay in your private project space. Full control, no shared knowledge.',
  },
  {
    Icon: Database, title: 'Vector Database',
    iconBg: 'bg-amber-500/10', iconBorder: 'border-amber-500/20', iconColor: 'text-amber-400',
    desc: 'Powered by pgvector or Qdrant for lightning-fast similarity search at any scale.',
  },
]

const steps = [
  { Icon: Upload,  title: 'Upload documents',   desc: 'Drop in PDFs and text files — research papers, guidelines, nutrition data.' },
  { Icon: Zap,     title: 'Process & index',     desc: 'Your content is chunked, embedded, and stored in a high-performance vector database.' },
  { Icon: Bot,     title: 'Ask & get answers',   desc: 'Query your knowledge base in plain English, get precise sourced answers instantly.' },
]
