import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Leaf, MessageSquare, FileText, Zap, Shield, BarChart3,
  ArrowRight, CheckCircle, Sparkles, Brain, Upload
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-teal-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-600/8 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">NutriAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/register" className="btn-primary text-sm">Get started <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 text-center">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Powered by RAG technology
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-white">Your AI-Powered</span>
            <br />
            <span className="text-gradient">Nutrition Assistant</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload nutrition documents, ask questions in plain English, and get
            precise, evidence-based answers grounded in your own knowledge base.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary px-7 py-3 text-base glow-green">
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary px-7 py-3 text-base">
              Sign in
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero card mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="card p-1 glow-green">
            <div className="bg-surface rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-brand-500/70" />
                <div className="flex-1 mx-4 h-6 bg-surface-card rounded-lg flex items-center px-3">
                  <span className="text-slate-600 text-xs font-mono">nutriai.app/chat</span>
                </div>
              </div>
              <div className="space-y-3">
                <ChatBubble role="user" text="What are the best plant-based sources of complete protein?" />
                <ChatBubble role="ai"   text="Based on your uploaded nutrition documents, the top complete plant proteins are: quinoa (all 9 essential amino acids), edamame (18g per cup), and tempeh (31g per cup). Soy-based foods consistently rank highest for bioavailability…" />
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex-1 h-10 bg-surface-card border border-surface-border rounded-xl flex items-center px-4">
                    <span className="text-slate-600 text-sm">Ask about nutrition…</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-lg mx-auto">
            Built for nutritionists, researchers, and health enthusiasts who want AI-powered answers from their own knowledge base.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={fadeUp}
              className="card p-6 hover:border-brand-500/30 hover:bg-surface-hover transition-all duration-300 group"
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                <f.Icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-white mb-2 text-lg">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
            How it works
          </motion.h2>
        </motion.div>
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-600/15 border border-brand-500/20 flex items-center justify-center mb-5">
                <s.Icon className="w-6 h-6 text-brand-400" />
              </div>
              <span className="text-brand-500 text-xs font-bold uppercase tracking-widest mb-2">Step {i + 1}</span>
              <h3 className="font-semibold text-white text-lg mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="card p-12 text-center bg-gradient-to-br from-brand-600/10 via-surface-card to-surface-card border-brand-500/20"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-7 h-7 text-brand-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Join and start querying your nutrition knowledge base in minutes.
          </p>
          <Link to="/register" className="btn-primary px-8 py-3 text-base glow-green">
            Create free account <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-surface-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-brand-500" />
            <span className="text-slate-500 text-sm">NutriAI</span>
          </div>
          <p className="text-slate-600 text-xs">AI-powered nutrition intelligence</p>
        </div>
      </footer>
    </div>
  )
}

function ChatBubble({ role, text }) {
  return (
    <div className={`flex gap-3 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'ai' && (
        <div className="w-7 h-7 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center shrink-0">
          <Leaf className="w-3.5 h-3.5 text-brand-400" />
        </div>
      )}
      <div className={`max-w-xs md:max-w-sm px-4 py-2.5 rounded-2xl text-sm text-left leading-relaxed ${
        role === 'user'
          ? 'bg-brand-600/20 border border-brand-500/20 text-slate-200'
          : 'bg-surface-card border border-surface-border text-slate-300'
      }`}>
        {text}
      </div>
    </div>
  )
}

const features = [
  {
    Icon: Brain, title: 'RAG-Powered Answers', bg: 'bg-brand-500/10', color: 'text-brand-400',
    desc: 'Get answers grounded in your own uploaded documents using state-of-the-art retrieval-augmented generation.',
  },
  {
    Icon: Upload, title: 'Document Processing', bg: 'bg-blue-500/10', color: 'text-blue-400',
    desc: 'Upload PDFs and text files. Our pipeline automatically chunks, embeds, and indexes your content.',
  },
  {
    Icon: Zap, title: 'Instant Semantic Search', bg: 'bg-yellow-500/10', color: 'text-yellow-400',
    desc: 'Search across your knowledge base semantically. Find relevant information even with different phrasing.',
  },
  {
    Icon: MessageSquare, title: 'Conversational AI', bg: 'bg-purple-500/10', color: 'text-purple-400',
    desc: 'Chat naturally with your data. Ask follow-up questions and explore nutrition topics in depth.',
  },
  {
    Icon: Shield, title: 'Your Data, Your Control', bg: 'bg-teal-500/10', color: 'text-teal-400',
    desc: 'All documents stay in your private project space. Your knowledge base is yours alone.',
  },
  {
    Icon: BarChart3, title: 'Usage Dashboard', bg: 'bg-orange-500/10', color: 'text-orange-400',
    desc: 'Track documents processed, queries asked, and insights gained through an intuitive dashboard.',
  },
]

const steps = [
  { Icon: Upload,        title: 'Upload Documents',  desc: 'Upload your nutrition PDFs, research papers, or text files to your private project.' },
  { Icon: Zap,           title: 'Process & Index',   desc: 'Our pipeline chunks your content, generates embeddings, and stores them in a vector database.' },
  { Icon: MessageSquare, title: 'Ask & Discover',    desc: 'Chat with your knowledge base, search semantically, and get AI-generated answers.' },
]
