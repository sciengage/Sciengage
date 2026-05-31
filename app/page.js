export default function Home() {
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
          <a href="#" className="text-sm text-gray-500 hover:text-black">Submit paper</a>
          <a href="#" className="text-sm text-gray-500 hover:text-black">About</a>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="text-sm px-4 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50">Sign in</button>
          <button className="text-sm px-4 py-1.5 bg-black text-white rounded-md hover:opacity-80">Contribute</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-4 pt-20 pb-14 border-b border-gray-100">
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-4">Open · Free · Community-built</div>
        <h1 className="text-4xl font-medium tracking-tight max-w-xl mb-4">
          Science you can trace to its source
        </h1>
        <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
          Search peer-reviewed papers and ask our AI anything. Every answer cites exactly where it came from — no outside knowledge, no guessing.
        </p>
        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 w-full max-w-xl mb-6">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400" placeholder="Search papers, authors, topics, DOIs…" />
          <button className="text-sm px-4 py-1.5 bg-black text-white rounded-lg hover:opacity-80">Search</button>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {["All domains", "Biology / Medicine", "Physics", "Environmental", "Astronomy", "Chemistry"].map((d) => (
            <button key={d} className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50">
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 border-b border-gray-100">
        {[
          { num: "0", label: "Papers indexed" },
          { num: "6", label: "Domains" },
          { num: "0", label: "Contributors" },
          { num: "0", label: "Questions answered" },
        ].map((s) => (
          <div key={s.label} className="py-6 text-center border-r border-gray-100 last:border-r-0">
            <div className="text-2xl font-medium">{s.num}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="grid grid-cols-2 min-h-96">
        <div className="p-8 border-r border-gray-100">
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-6">Papers</div>
          <div className="flex flex-col items-center justify-center h-48 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
            No papers yet — be the first to contribute
          </div>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="text-xs uppercase tracking-widest text-gray-400">Ask the database</div>
            <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">Source-only</span>
          </div>
          <div className="border border-gray-100 rounded-xl p-4 text-sm text-gray-500 leading-relaxed mb-4">
            Add papers to the database, then ask me anything. I will only answer from your sources — every claim traced to a paper.
          </div>
          <div className="flex gap-2">
            <input className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none placeholder-gray-400" placeholder="Ask a question about the research…" />
            <button className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:opacity-80">Ask</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Have a paper to contribute?
        <span className="text-black font-medium cursor-pointer hover:underline">Upload your PDF</span>
        — open access only, joins the public database instantly.
      </div>
    </main>
  );
}
