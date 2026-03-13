// src/composables/useMovinState.ts
// Persistent favourites and reading-progress for all Movin articles.
// Module-level reactive singleton — shared across all components.

import { reactive } from "vue"

const _faves = reactive<Record<string, boolean>>({})
const _progress = reactive<Record<string, number>>({})
const _completed = reactive<Record<string, boolean>>({})

// Load from localStorage on module init
;(function init() {
  try {
    const slugs: string[] = JSON.parse(localStorage.getItem("movin-faves") ?? "[]")
    slugs.forEach((s) => { _faves[s] = true })
  } catch { /* ignore */ }
  try {
    const prog: Record<string, number> = JSON.parse(localStorage.getItem("movin-progress") ?? "{}")
    Object.assign(_progress, prog)
  } catch { /* ignore */ }
  try {
    const done: string[] = JSON.parse(localStorage.getItem("movin-completed") ?? "[]")
    done.forEach((s) => { _completed[s] = true })
  } catch { /* ignore */ }
})()

function persistFaves() {
  try {
    const slugs = Object.keys(_faves).filter((k) => _faves[k])
    localStorage.setItem("movin-faves", JSON.stringify(slugs))
  } catch { /* ignore */ }
}

function persistProgress() {
  try {
    const entries = Object.fromEntries(
      Object.entries(_progress).filter(([, v]) => v > 0)
    )
    localStorage.setItem("movin-progress", JSON.stringify(entries))
  } catch { /* ignore */ }
}

function persistCompleted() {
  try {
    const slugs = Object.keys(_completed).filter((k) => _completed[k])
    localStorage.setItem("movin-completed", JSON.stringify(slugs))
  } catch { /* ignore */ }
}

export function useMovinState() {
  function isFave(slug: string): boolean {
    return !!_faves[slug]
  }

  function toggleFave(slug: string) {
    _faves[slug] = !_faves[slug]
    persistFaves()
  }

  function getProgress(slug: string): number {
    return _progress[slug] ?? 0
  }

  function setProgress(slug: string, step: number) {
    _progress[slug] = step
    persistProgress()
  }

  function clearProgress(slug: string) {
    _progress[slug] = 0
    _completed[slug] = true
    persistProgress()
    persistCompleted()
  }

  function isCompleted(slug: string): boolean {
    return !!_completed[slug]
  }

  return { isFave, toggleFave, getProgress, setProgress, clearProgress, isCompleted }
}
