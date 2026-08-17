import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const schema = await readFile(new URL('../convex/schema.ts', import.meta.url), 'utf8')

test('the web app owns the shared Watchlistr backend dependencies', () => {
  assert.match(packageJson.devDependencies.nuxt, /^\^4\./)
  assert.equal(packageJson.dependencies.convex.startsWith('^'), true)
  assert.equal(typeof packageJson.dependencies['@auth0/auth0-vue'], 'string')
  assert.match(packageJson.dependencies['@nuxt/ui'], /^\^4\./)
  assert.match(schema, /libraryEntries: defineTable/)
  assert.match(schema, /catalogItems: defineTable/)
})

test('the legacy Firebase editor is replaced by the current Tiptap extension surface', () => {
  assert.equal('firebase' in packageJson.dependencies, false)
  assert.match(packageJson.dependencies['@tiptap/core'], /^\^3\./)
  assert.match(packageJson.dependencies['@tiptap/vue-3'], /^\^3\./)
  assert.equal('@tiptap/extension-youtube' in packageJson.dependencies, false)
})
