'use client'
import { useState } from 'react'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [form, setForm] = useState({ title: '', authors: '', year: '', domain: 'Biology / Medicine', doi: '', abstract: '' })
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')

  async function handleAsk() {
    if (!question.trim() || loading) return
    const q = question.trim()
    setQuestion('')
    setLoading(true)
    const newMessages = [...messages, { role: 'user', text: q }]
    setMessages(newMessages)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, history })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessages([...newMessages, { role: 'bot', text: data.answer, sources: data.sources }])
      setHistory([...history, { role: 'user', content: q }, { role: 'assistant', content: data.answer }].slice(-10))
    } catch (e) {
      setMessages([...newMessages, { role: 'bot', text: 'Error: ' + e.message, sources: [] }])
    }
    setLoading(false)
  }

  async function handleUpload() {
    if (!form.title || !form.abstract) { setUploadMsg('Title and abstract are required.'); return }
    setUploading(true)
    setUploadMsg('')
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setUploadMsg('Paper added successfully!')
      setForm({ title: '', authors: '', year: '', domain: 'Biology / Medicine', doi: '', abstract: '' })
      setTimeout(() => { setShowUpload(false); setUploadMsg('') }, 1500)
    } catch (e) {
      setUploadMsg('Error: ' + e.message)
    }
    setUploading(false)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center px-8 h-14 border-b border-gray-100">
        <div className="flex items-center gap-2 font-medium text-lg">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          Sciengage
        </div>
        <div className="flex gap-8 ml-12">
          <a href="#" className="text-sm text-gray-500 hover:text-black">Browse</a>
          <button onClick={() => setShowUpload(!showUpload)} className="text-sm text-gray-500 hover:text-black">Submit paper</button>
          <a href="#" className="text-sm text-gray-500 hover:text-black">About</a>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="text-sm px-4 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50">Sign in</button>
          <button onClick={() => setShowUpload(!showUpload)} className="text-sm px-4 py-1.5 bg-black text-white rounded-md hover:opacity-80">Contribute</button>
        </div>
      </nav>

      {/* Upload Panel */}
      {showUpload && (
        <div className="border-b border-gray-100 bg-gray-50 px-8 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">Add a paper</h2>
              <button onClick={() => setShowUpload(false)} className="text-sm text-gray-400 hover:text-black">Close</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="col-span-2">
                <label className="text-xs text-gray-500 block mb-1">Title *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="Full paper title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Authors</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="Smith et al., 2024" value={form.authors} onChange={e => setForm({...form, authors: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Year</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="2024" value={form.year} onChange={e => setForm({...form, year: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Domain</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white" value={form.domain} onChange={e => setForm({...form, domain: e.target.value})}>
                  <option>Biology / Medicine</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Environmental / Climate</option>
                  <option>Astronomy / Space</option>
                  <option>General</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">DOI</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="10.xxxx/..." value={form.doi} onChange={e => setForm({...form, doi: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 block mb-1">Abstract *</label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none resize-none h-24" placeholder="Paste abstract here..." value={form.abstract} onChange={e => setForm({...form, abstract: e.target.value})} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:opacity-80 disabled:opacity-50">
                {uploading ? 'Adding...' : 'Add to database'}
              </button>
              {uploadMsg && <span className="text-sm text-gray-500">{uploadMsg}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-4 pt-20 pb-14 border-b border-gray-100">
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-4">Open · Free · Community-built</div>
        <h1 className="text-4xl font-medium tracking-tight max-w-xl mb-4">Science you can trace to its source</h1>
        <p className="text-gray-500 max-w-md mb-8 leading-relaxed">Search peer-reviewed papers and ask our AI anything. Every answer cites exactly where it came from — no outside knowledge, no guessing.</p>
        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 w-full max-w-xl mb-6">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400" placeholder="Search papers, authors, topics, DOIs…" />
          <button className="text-sm px-4 py-1.5 bg-black text-white rounded-lg hover:opacity-80">Search</button>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {["All domains", "Biology / Medicine", "Physics", "Environmental", "Astronomy", "Chemistry"].map((d) => (
            <button key={d} className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50">{d}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-2 min-h-96">
        <div className="p-8 border-r border-gray-100">
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-6">Papers</div>
          <div className="flex flex-col items-center justify-center h-48 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
            No papers yet — <button onClick={() => setShowUpload(true)} className="underline ml-1">be the first to contribute</button>
          </div>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-xs uppercase tracking-widest text-gray-400">Ask the database</div>
            <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">Source-only</span>
          </div>
          <div className="flex flex-col gap-3 mb-4 max-h-80 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-sm text-gray-400 leading-relaxed">Add papers then ask me anything. I only answer from your sources — every claim traced to a paper.</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`text-sm rounded-xl px-4 py-3 ${m.role === 'user' ? 'bg-gray-100 self-end max-w-xs' : 'border border-gray-100'}`}>
                <div className="leading-relaxed">{m.text}</div>
                {m.sources?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
                    {m.sources.map(s => <div key={s.id}>[{s.refs.join(',')}] {s.title} — {s.authors} ({s.year})</div>)}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-sm text-gray-400 italic">Searching database…</div>}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none placeholder-gray-400"
              placeholder="Ask a question about the research…"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
            />
            <button onClick={handleAsk} disabled={loading} className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:opacity-80 disabled:opacity-50">Ask</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Have a paper to contribute?
        <button onClick={() => setShowUpload(true)} className="text-black font-medium hover:underline">Upload your PDF</button>
        — open access only, joins the public database instantly.
      </div>
    </main>
  )
}
