import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

function retrieveRelevant(query, papers, maxChunks = 20) {
  const qWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  const scored = []
  papers.forEach((paper) => {
    (paper.chunks || []).forEach((chunk, cidx) => {
      const cl = chunk.toLowerCase()
      const score = qWords.reduce((s, w) => {
        const m = cl.match(new RegExp(w, 'g'))
        return s + (m ? m.length : 0)
      }, 0)
      if (score > 0) scored.push({ chunk, paper, score })
    })
  })
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, maxChunks)
}

export async function POST(request) {
  try {
    const { question, history } = await request.json()

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    const { data: papers, error } = await supabase
      .from('papers')
      .select('*')

    if (error) throw error

    if (!papers || papers.length === 0) {
      return NextResponse.json({
        answer: 'The database is empty. Please add some papers first.',
        sources: []
      })
    }

    const relevant = retrieveRelevant(question, papers)

    if (relevant.length === 0) {
      return NextResponse.json({
        answer: `The database contains ${papers.length} papers but none appear relevant to your question. Try rephrasing or add papers on this topic.`,
        sources: []
      })
    }

    const sourceMap = {}
    relevant.forEach((r, i) => {
      const id = r.paper.id
      if (!sourceMap[id]) sourceMap[id] = { paper: r.paper, refs: [] }
      sourceMap[id].refs.push(i + 1)
    })

    const context = relevant.map((r, i) =>
      `[${i + 1}] From: "${r.paper.title}" (${r.paper.authors || 'Unknown'}, ${r.paper.year || 'n.d.'})\n${r.chunk}`
    ).join('\n\n---\n\n')

    const systemPrompt = `You are a scientific reference assistant for a curated research database called Sciengage.

CRITICAL RULES:
1. Answer ONLY using the provided source passages. Never use any outside knowledge or training data.
2. If the passages do not contain enough information, say: "The database does not contain sufficient information to answer this question."
3. Cite every claim with [N] notation referring to the numbered passages.
4. You may ask follow-up clarifying questions to help the user explore further.
5. Never speculate or extrapolate beyond what is explicitly stated in the passages.
6. Be precise, scientific, and direct.
7. You are having a dialogue — acknowledge what was said before and build on it naturally.`

    const messages = [
      ...(history || []),
      {
        role: 'user',
        content: `Question: ${question}\n\nSource passages from the Sciengage database (${papers.length} total papers):\n\n${context}`
      }
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages
      })
    })

    const data = await response.json()
    const answer = data.content?.[0]?.text || 'No response generated.'

    const sources = Object.values(sourceMap).map(({ paper, refs }) => ({
      id: paper.id,
      title: paper.title,
      authors: paper.authors,
      year: paper.year,
      refs
    }))

    return NextResponse.json({ answer, sources })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
