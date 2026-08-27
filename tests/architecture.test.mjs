import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const schema = await readFile(new URL('../convex/schema.ts', import.meta.url), 'utf8')
const library = await readFile(new URL('../convex/library.ts', import.meta.url), 'utf8')
const adminPage = await readFile(new URL('../app/pages/admin/index.vue', import.meta.url), 'utf8')
const writePage = await readFile(new URL('../app/pages/admin/write.vue', import.meta.url), 'utf8')

test('the web app owns the shared Watchlistr backend dependencies', () => {
  assert.match(packageJson.devDependencies.nuxt, /^\^4\./)
  assert.equal(packageJson.dependencies.convex.startsWith('^'), true)
  assert.equal(typeof packageJson.dependencies['@auth0/auth0-vue'], 'string')
  assert.match(packageJson.dependencies['@nuxt/ui'], /^\^4\./)
  assert.match(schema, /libraryEntries: defineTable\([\s\S]*?sourceUrl: v\.optional\(v\.string\(\)\)/)
  assert.match(schema, /catalogItems: defineTable/)
  assert.match(library, /sourceUrl: entry\.sourceUrl/)
  assert.match(library, /publicCatalogItem\(item, entry\.sourceUrl\)/)
})

test('the legacy Firebase editor is replaced by the current Tiptap extension surface', () => {
  assert.equal('firebase' in packageJson.dependencies, false)
  assert.match(packageJson.dependencies['@tiptap/core'], /^\^3\./)
  assert.match(packageJson.dependencies['@tiptap/vue-3'], /^\^3\./)
  assert.equal('@tiptap/extension-youtube' in packageJson.dependencies, false)
})

test('the editorial desk keeps drafts and published articles in one list', () => {
  assert.match(adminPage, /const statusFilter = ref<CollectionStatus \| 'all'>\('all'\)/)
  assert.match(adminPage, /type ArticleListItem =/)
  assert.match(adminPage, /const filteredItems = computed<ArticleListItem\[\]>/)
  assert.match(adminPage, /Manage drafts and published articles in one place\./)
  assert.doesNotMatch(adminPage, />Saved drafts</)
  assert.doesNotMatch(adminPage, />Publishing queue</)
})

test('admin mutations wait for an authenticated Auth0 session', () => {
  assert.match(adminPage, /authLoading\.value \|\| !isAuthenticated\.value/)
  assert.match(adminPage, /void syncBrowserDraft\(\)/)
  assert.match(writePage, /const \{ isAuthenticated, isLoading: authLoading \} = useWatchlistrAuth\(\)/)
  assert.match(writePage, /if \(authLoading\.value \|\| !isAuthenticated\.value\)/)
  assert.match(writePage, /watch\(\[authLoading, isAuthenticated\]/)
})
