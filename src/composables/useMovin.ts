// src/composables/useMovin.ts
import { marked } from "marked"

export type MovinCategory = "knowzone" | "fordeler" | "maler" | "programmer" | "komgang"

// Split rendered HTML into readable steps (exported for reuse in list + detail views)
// One heading-section per step; merges only if the section is very short (<300 chars).
export function splitSteps(html: string): string[] {
  // Split into blocks starting at each h2/h3
  const blocks = html.split(/(?=<h[23][^>]*>)/i).filter(s => s.trim())

  if (blocks.length > 1) {
    const MIN_CHARS = 300  // merge short sections into next
    const MAX_CHARS = 900  // hard cap before forcing a new step
    const steps: string[] = []
    let current = ""

    for (const block of blocks) {
      if (!current) {
        current = block
      } else if (current.length < MIN_CHARS && current.length + block.length <= MAX_CHARS) {
        // current step is too short — merge this block in
        current += block
      } else {
        steps.push(current)
        current = block
      }
    }
    if (current) steps.push(current)
    return steps
  }

  // Fallback: hr separators
  const byHr = html.split(/<hr\s*\/?>/i).filter(s => s.trim())
  if (byHr.length > 1) return byHr

  // Fallback: group paragraphs — 2 per step for more balanced boxes
  const paras = html.match(/<p[\s\S]*?<\/p>/gi) ?? []
  if (paras.length > 3) {
    const PER_STEP = 2
    const steps: string[] = []
    for (let i = 0; i < paras.length; i += PER_STEP) {
      steps.push(paras.slice(i, i + PER_STEP).join(""))
    }
    return steps
  }

  return [html]
}

export type MovinArticle = {
  slug: string
  title: string
  category: MovinCategory
  image: string | null
  pdf: string | null
  partner: string
  partner_logo: string | null
  content: string // rendered HTML
}

// Lightweight frontmatter parser — no Node.js dependencies, browser-safe.
// Handles simple key: value pairs with optional double-quote wrapping and null.
function parseFrontmatter(raw: string): { data: Record<string, string | null>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const data: Record<string, string | null> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(":")
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const raw_val = line.slice(colon + 1).trim()
    if (raw_val === "null" || raw_val === "") {
      data[key] = null
    } else {
      // Strip surrounding double quotes if present
      data[key] = raw_val.replace(/^"(.*)"$/, "$1")
    }
  }
  return { data, content: match[2] }
}

const rawModules = import.meta.glob("../content/movin/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

function parseArticles(): MovinArticle[] {
  return Object.entries(rawModules).map(([, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    return {
      slug: String(data.slug ?? ""),
      title: String(data.title ?? ""),
      category: (data.category ?? "knowzone") as MovinCategory,
      image: data.image ? `/movin/images/${data.image}` : null,
      pdf: data.pdf ? `/movin/pdfs/${data.pdf}` : null,
      partner: String(data.partner ?? "Boost Move"),
      partner_logo: data.partner_logo ? `/movin/partners/${data.partner_logo}` : null,
      content: String(marked.parse(content)),
    }
  })
}

const _articles = parseArticles()

export function useMovin() {
  const articles = _articles
  const getBySlug = (slug: string): MovinArticle | null =>
    articles.find((a) => a.slug === slug) ?? null
  const getByCategory = (cat: MovinCategory): MovinArticle[] =>
    articles.filter((a) => a.category === cat)

  return { articles, getBySlug, getByCategory }
}
