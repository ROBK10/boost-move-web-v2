import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { mkdtemp, rm } from 'node:fs/promises'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'

const workdir = await mkdtemp(path.join(tmpdir(), 'boost-move-tests-'))
const outfile = path.join(workdir, 'minHelseStore.mjs')

try {
  await build({
    entryPoints: ['src/stores/minHelseStore.ts'],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    sourcemap: false,
    target: 'node20',
    alias: {
      '@/services/api': path.resolve(process.cwd(), 'src/services/api.ts'),
    },
    define: {
      'import.meta.env.VITE_API_BASE': '"http://localhost:3001"',
    },
  })

  const mod = await import(pathToFileURL(outfile).href)

  // todayISO should use local date parts
  const localDate = new Date(2026, 2, 3, 23, 30, 0)
  assert.equal(mod.todayISO(localDate), '2026-03-03')

  // normalizeMovement threshold checks
  assert.deepEqual(mod.normalizeMovement(299), {
    raw: 299,
    interpretedAs: 'minutes',
    minutes: 299,
  })

  assert.deepEqual(mod.normalizeMovement(300), {
    raw: 300,
    interpretedAs: 'steps',
    steps: 300,
  })

  assert.equal(mod.normalizeMovement(0), undefined)
  assert.equal(mod.normalizeMovement('bad-value'), undefined)

  console.log('All minHelseStore checks passed.')
} finally {
  await rm(workdir, { recursive: true, force: true })
}
