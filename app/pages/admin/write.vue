<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { api } from '~~/convex/_generated/api'
import type { Id } from '~~/convex/_generated/dataModel'
import type { CatalogItem } from '~/types/catalog'
import type { CatalogEditorController, CatalogEmbedData, EditorNodeUpdate, PersistedEditorDraft, YouTubeEmbedData } from '~~/shared/types/editor'
import { encodeEditorPayload } from '~~/shared/types/editor'
import InsertMediaModal from '~/components/editor/InsertMediaModal.vue'
import { editorExtensions } from '~/utils/editor-extensions'

type InsertKind = 'youtube' | 'catalog'
type ArticleStatus = 'draft' | 'published'

type EditableArticle = {
  _id: Id<'discoverCollections'>
  slug: string
  title: string
  excerpt?: string
  content: string
  status: ArticleStatus
  updatedAt: number
}

const draftStorageKey = 'watchlistr-admin-writing-draft-v1'
const route = useRoute()

const title = ref('')
const excerpt = ref('')
const content = ref('')
const slug = ref('')
const collectionId = ref<Id<'discoverCollections'> | null>(null)
const articleStatus = ref<ArticleStatus>('draft')
const isReady = ref(false)
const isLoadingArticle = ref(false)
const articleLoadError = ref('')
const lastSavedAt = ref<number | null>(null)
const isSaving = ref(false)
const isPublishing = ref(false)
const isClearing = ref(false)
const toast = useToast()
const { $convex } = useNuxtApp()
const activeEditor = shallowRef<Editor>()
const dragHandleReady = ref(false)
const insertModalOpen = ref(false)
const insertKind = ref<InsertKind>('youtube')
const youtubeInitial = ref<YouTubeEmbedData | null>(null)
const catalogInitial = ref<CatalogEmbedData | null>(null)
let pendingNodeUpdate: EditorNodeUpdate | null = null
let stopArticle: (() => void) | undefined

const AUTO_SAVE_DELAY_MS = 800
const AUTO_SAVE_RETRY_MS = 400
let autoSaveTimer: ReturnType<typeof setTimeout> | undefined
let activeSave: Promise<boolean> | undefined
let draftGeneration = 0
let lastSavedSnapshot = { title: '', excerpt: '', content: '' }
const hasUnsavedChanges = ref(false)

const articleId = computed(() => {
  const value = route.query.articleId
  return typeof value === 'string' && value ? value as Id<'discoverCollections'> : null
})

const isEditing = computed(() => Boolean(articleId.value))

const toolbarItems = [
  [
    { kind: 'undo', icon: 'i-lucide-undo-2', 'aria-label': 'Undo' },
    { kind: 'redo', icon: 'i-lucide-redo-2', 'aria-label': 'Redo' },
  ],
  [
    {
      icon: 'i-lucide-heading',
      'aria-label': 'Text style',
      items: [
        { label: 'Paragraph', kind: 'paragraph', icon: 'i-lucide-type' },
        { label: 'Heading 1', kind: 'heading', level: 1, icon: 'i-lucide-heading-1' },
        { label: 'Heading 2', kind: 'heading', level: 2, icon: 'i-lucide-heading-2' },
        { label: 'Heading 3', kind: 'heading', level: 3, icon: 'i-lucide-heading-3' },
      ],
    },
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', 'aria-label': 'Bold' },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', 'aria-label': 'Italic' },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', 'aria-label': 'Strikethrough' },
  ],
  [
    { kind: 'bulletList', icon: 'i-lucide-list', 'aria-label': 'Bullet list' },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered', 'aria-label': 'Numbered list' },
    { kind: 'blockquote', icon: 'i-lucide-quote', 'aria-label': 'Quote' },
    { kind: 'horizontalRule', icon: 'i-lucide-minus', 'aria-label': 'Divider' },
  ],
  [
    { kind: 'insertYoutube', icon: 'i-lucide-youtube', 'aria-label': 'Insert YouTube video', tooltip: { text: 'Insert YouTube video' } },
    { kind: 'insertCatalog', icon: 'i-lucide-library', 'aria-label': 'Insert movie, TV show, or book', tooltip: { text: 'Insert movie, TV show, or book' } },
  ],
]

const suggestionItems = [
  { type: 'label' as const, label: 'Insert into article' },
  { kind: 'insertYoutube', label: 'YouTube video', description: 'Paste a link and add a rich preview', icon: 'i-lucide-youtube' },
  { kind: 'insertCatalog', label: 'Movie, TV show, or book', description: 'Search the Watchlistr catalogue', icon: 'i-lucide-library' },
]

function openInsert(kind: InsertKind, initial: YouTubeEmbedData | CatalogEmbedData | null = null, update: EditorNodeUpdate | null = null) {
  insertKind.value = kind
  youtubeInitial.value = kind === 'youtube' ? initial as YouTubeEmbedData | null : null
  catalogInitial.value = kind === 'catalog' ? initial as CatalogEmbedData | null : null
  pendingNodeUpdate = update
  insertModalOpen.value = true
}

function closeInsert() {
  insertModalOpen.value = false
  pendingNodeUpdate = null
  youtubeInitial.value = null
  catalogInitial.value = null
}

function insertYouTube(data: YouTubeEmbedData) {
  const attrs = { payload: encodeEditorPayload(data) }
  if (pendingNodeUpdate) pendingNodeUpdate(attrs)
  else activeEditor.value?.chain().focus().insertContent({ type: 'youtubeEmbed', attrs }).run()
  closeInsert()
}

function insertCatalog(item: CatalogItem) {
  const data: CatalogEmbedData = {
    uid: item.uid,
    kind: item.kind,
    source: item.source,
    sourceId: item.sourceId,
    title: item.title,
    creators: item.creators,
    year: item.year,
    imageUrl: item.imageUrl,
    description: item.description,
    externalUrl: item.externalUrl,
  }
  const attrs = { payload: encodeEditorPayload(data) }
  if (pendingNodeUpdate) pendingNodeUpdate(attrs)
  else activeEditor.value?.chain().focus().insertContent({ type: 'catalogCard', attrs }).run()
  closeInsert()
}

function handleEditorCreate({ editor }: { editor: Editor }) {
  registerEditor(editor)
  // Register the drag handle after the editor menus so its drag events win.
  nextTick(() => {
    dragHandleReady.value = true
  })
}

function registerEditor(editor: Editor) {
  activeEditor.value = editor
  ;(editor.storage as { watchlistr?: CatalogEditorController }).watchlistr = {
    openCatalog: (initial, update) => openInsert('catalog', initial, update),
  }
}

function handleModalOpenChange(open: boolean) {
  if (!open) closeInsert()
}

const editorHandlers = {
  insertYoutube: {
    canExecute: () => true,
    execute: (editor: Editor) => {
      registerEditor(editor)
      openInsert('youtube')
      return editor.chain()
    },
    isActive: () => false,
  },
  insertCatalog: {
    canExecute: () => true,
    execute: (editor: Editor) => {
      registerEditor(editor)
      openInsert('catalog')
      return editor.chain()
    },
    isActive: () => false,
  },
}

const wordCount = computed(() => {
  const words = content.value
    .replace(/[#*_>`~-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  return words.length
})

const saveLabel = computed(() => lastSavedAt.value ? `Saved ${formatSavedTime(lastSavedAt.value)}` : 'Not saved yet')
const publicationActionLabel = computed(() => articleStatus.value === 'published' ? 'Unpublish' : 'Publish')
const publicationActionIcon = computed(() => articleStatus.value === 'published' ? 'i-lucide-eye-off' : 'i-lucide-send')
const publicationActionColor = computed(() => articleStatus.value === 'published' ? 'neutral' : 'primary')
const publicationActionVariant = computed(() => articleStatus.value === 'published' ? 'soft' : 'solid')

function formatSavedTime(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(timestamp)
}

function hasDraftValues() {
  return Boolean(title.value.trim() || excerpt.value.trim() || content.value.trim())
}

function slugify(value: string) {
  return value.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function persistBrowserDraft() {
  if (!import.meta.client) return

  const savedAt = Date.now()
  localStorage.setItem(draftStorageKey, JSON.stringify({
    title: title.value,
    excerpt: excerpt.value,
    content: content.value,
    slug: slug.value,
    collectionId: collectionId.value,
    status: articleStatus.value,
    savedAt,
  }))
  lastSavedAt.value = savedAt
}

function currentSnapshot() {
  return { title: title.value, excerpt: excerpt.value, content: content.value }
}

function isChangedSinceRefresh() {
  const snap = currentSnapshot()
  return snap.title !== lastSavedSnapshot.title || snap.excerpt !== lastSavedSnapshot.excerpt || snap.content !== lastSavedSnapshot.content
}

function scheduleAutoSave() {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  autoSaveTimer = setTimeout(runAutoSave, AUTO_SAVE_DELAY_MS)
}

function runAutoSave() {
  autoSaveTimer = undefined
  if (isSaving.value) {
    autoSaveTimer = setTimeout(runAutoSave, AUTO_SAVE_RETRY_MS)
    return
  }
  void saveDraft(false)
}

async function saveDraft(showToast = false): Promise<boolean> {
  if (activeSave) return activeSave

  const operation = saveDraftInternal(showToast)
  activeSave = operation

  try {
    return await operation
  } finally {
    if (activeSave === operation) activeSave = undefined
  }
}

async function saveDraftInternal(showToast: boolean): Promise<boolean> {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
    autoSaveTimer = undefined
  }

  if (isReady.value && !showToast && collectionId.value && !isChangedSinceRefresh()) return true

  if (!collectionId.value && !hasDraftValues()) {
    if (import.meta.client) localStorage.removeItem(draftStorageKey)
    lastSavedSnapshot = currentSnapshot()
    hasUnsavedChanges.value = false
    return true
  }

  persistBrowserDraft()

  if (!$convex) {
    if (showToast) {
      toast.add({
        title: articleStatus.value === 'published' ? 'Changes saved locally' : 'Draft saved locally',
        description: 'Convex is not connected, so these changes remain in this browser.',
        color: 'warning',
        icon: 'i-lucide-hard-drive',
      })
    }
    return false
  }

  isSaving.value = true
  const snapshot = currentSnapshot()
  const saveGeneration = draftGeneration
  try {
    await $convex.mutation(api.users.initialize, {})
    const nextSlug = slug.value || slugify(title.value) || `draft-${Date.now()}`
    const nextCollectionId = await $convex.mutation(api.admin.saveCollection, {
      collectionId: collectionId.value ?? undefined,
      slug: nextSlug,
      title: title.value.trim() || 'Untitled draft',
      excerpt: excerpt.value.trim() || undefined,
      content: content.value,
    })

    if (saveGeneration !== draftGeneration) return true

    slug.value = nextSlug
    collectionId.value = nextCollectionId
    persistBrowserDraft()
    if (currentSnapshot().content === snapshot.content && currentSnapshot().title === snapshot.title && currentSnapshot().excerpt === snapshot.excerpt) {
      lastSavedSnapshot = snapshot
      hasUnsavedChanges.value = false
    }
    if (showToast) {
      toast.add({
        title: articleStatus.value === 'published' ? 'Article updated' : 'Draft saved',
        description: articleStatus.value === 'published' ? 'The published article now includes your changes.' : 'It is now in the publishing queue as a private draft.',
        color: 'success',
        icon: 'i-lucide-check',
      })
    }
    return true
  } catch (saveError) {
    if (showToast) {
      toast.add({
        title: 'Draft could not be saved to the queue',
        description: saveError instanceof Error ? saveError.message : 'Try again in a moment.',
        color: 'error',
        icon: 'i-lucide-circle-alert',
      })
    }
    return false
  } finally {
    isSaving.value = false
  }
}

function applyArticle(article: EditableArticle) {
  title.value = article.title
  excerpt.value = article.excerpt ?? ''
  content.value = article.content
  slug.value = article.slug
  collectionId.value = article._id
  articleStatus.value = article.status
  lastSavedAt.value = article.updatedAt
  lastSavedSnapshot = currentSnapshot()
}

function loadBrowserDraft() {
  if (!import.meta.client) return

  const savedDraft = localStorage.getItem(draftStorageKey)
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft) as PersistedEditorDraft
      title.value = draft.title ?? ''
      excerpt.value = draft.excerpt ?? ''
      content.value = draft.content ?? ''
      slug.value = draft.slug ?? ''
      collectionId.value = draft.collectionId ? draft.collectionId as Id<'discoverCollections'> : null
      articleStatus.value = draft.status ?? 'draft'
      lastSavedAt.value = draft.savedAt ?? Date.now()
    } catch {
      localStorage.removeItem(draftStorageKey)
    }
  }

  lastSavedSnapshot = currentSnapshot()
  isReady.value = true
}

function loadArticle() {
  if (!articleId.value) {
    loadBrowserDraft()
    return
  }

  if (!$convex) {
    articleLoadError.value = 'Content storage is not connected in this environment.'
    return
  }

  isLoadingArticle.value = true
  articleLoadError.value = ''
  stopArticle = $convex.onUpdate(api.admin.getArticle, { collectionId: articleId.value }, (nextArticle) => {
    if (!nextArticle) {
      articleLoadError.value = 'This article could not be found or is no longer available.'
      isLoadingArticle.value = false
      return
    }

    if (isReady.value && hasUnsavedChanges.value) return

    applyArticle(nextArticle as EditableArticle)
    isReady.value = true
    isLoadingArticle.value = false
  }, (nextError) => {
    articleLoadError.value = nextError instanceof Error ? nextError.message : 'This article could not be loaded.'
    isLoadingArticle.value = false
  })
}

async function clearDraft() {
  if (isClearing.value || isPublishing.value) return
  isClearing.value = true

  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
    autoSaveTimer = undefined
  }

  try {
    const hasCurrentDraft = isReady.value && hasDraftValues()
    if (hasCurrentDraft && !(await saveDraft(false))) {
      toast.add({
        title: 'Draft could not be saved',
        description: 'Your current writing is still open. Try again when the connection is available.',
        color: 'error',
        icon: 'i-lucide-circle-alert',
      })
      return
    }

    draftGeneration += 1
    stopArticle?.()
    title.value = ''
    excerpt.value = ''
    content.value = ''
    slug.value = ''
    collectionId.value = null
    articleStatus.value = 'draft'
    lastSavedAt.value = null
    lastSavedSnapshot = currentSnapshot()
    hasUnsavedChanges.value = false

    if (import.meta.client) localStorage.removeItem(draftStorageKey)
    toast.add({
      title: hasCurrentDraft ? 'Draft saved and cleared' : 'Draft cleared',
      description: 'The writing space is ready for a new piece.',
      color: 'neutral',
      icon: 'i-lucide-rotate-ccw',
    })

    if (articleId.value) await navigateTo('/admin/write')
  } finally {
    isClearing.value = false
  }
}

async function togglePublished() {
  if (!$convex || isPublishing.value || !isReady.value || articleLoadError.value) return

  const published = articleStatus.value === 'draft'
  isPublishing.value = true

  try {
    const saved = await saveDraft(false)
    if (!saved || !collectionId.value) {
      throw new Error(title.value.trim() ? 'The article could not be saved before publication.' : 'Give the article a title before publishing it.')
    }

    await $convex.mutation(api.admin.setPublished, { collectionId: collectionId.value, published })
    articleStatus.value = published ? 'published' : 'draft'
    lastSavedAt.value = Date.now()
    persistBrowserDraft()
    toast.add({
      title: published ? 'Article published' : 'Article unpublished',
      description: published ? 'It is now visible on the Discover page.' : 'It is hidden from Discover until you publish it again.',
      color: published ? 'success' : 'neutral',
      icon: published ? 'i-lucide-globe-2' : 'i-lucide-eye-off',
    })
  } catch (publishError) {
    toast.add({
      title: published ? 'Article could not be published' : 'Article could not be unpublished',
      description: publishError instanceof Error ? publishError.message : 'Try again in a moment.',
      color: 'error',
      icon: 'i-lucide-circle-alert',
    })
  } finally {
    isPublishing.value = false
  }
}

watch([title, excerpt, content], () => {
  if (!isReady.value) return
  if (!collectionId.value && !hasDraftValues()) {
    hasUnsavedChanges.value = false
    lastSavedSnapshot = currentSnapshot()
    return
  }
  hasUnsavedChanges.value = true
  scheduleAutoSave()
})

defineShortcuts({
  meta_s: () => saveDraft(true),
})

onMounted(loadArticle)

onUnmounted(() => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  stopArticle?.()
})

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth-client',
})

useSeoMeta({
  title: 'Write — Watchlistr',
  description: 'Write and publish a Watchlistr editorial article.',
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="isEditing ? 'Edit article' : 'Write'">
        <template #left>
          <UButton to="/admin" color="neutral" variant="ghost" icon="i-lucide-arrow-left" aria-label="Back to overview" />
        </template>
        <template #right>
          <span class="hidden text-xs text-muted sm:inline-flex sm:items-center sm:gap-1.5">
            <UIcon name="i-lucide-file" class="size-3.5" />
            {{ saveLabel }}
          </span>
          <UButton color="neutral" variant="ghost" icon="i-lucide-circle-x" aria-label="Clear draft" :loading="isClearing" :disabled="isPublishing" @click="clearDraft" />
          <UButton
            :color="publicationActionColor"
            :variant="publicationActionVariant"
            :icon="publicationActionIcon"
            :loading="isPublishing"
            :disabled="!isReady || Boolean(articleLoadError) || isClearing"
            @click="togglePublished"
          >
            {{ publicationActionLabel }}
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UContainer class="max-w-6xl py-6 sm:py-10">
        <div class="grid gap-8 xl:grid-cols-[minmax(0,1fr)_15rem]">
          <section class="min-w-0">
            <div v-if="!isEditing" class="mb-8 max-w-3xl">
              <p class="text-sm font-medium text-primary">Editorial workspace</p>
              <h1 class="mt-2 text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">Make something worth reading.</h1>
              <p class="mt-3 text-base leading-7 text-muted">Shape a note, a recommendation, or the next Watchlistr story.</p>
            </div>

            <div v-if="isLoadingArticle" class="flex min-h-[32rem] items-center justify-center text-sm text-muted">
              Loading article…
            </div>

            <UAlert v-else-if="articleLoadError" color="error" variant="soft" icon="i-lucide-circle-alert" title="Article could not be loaded" :description="articleLoadError" />

            <div v-else-if="isReady" class="space-y-6">
              <UFormField label="Title" name="title">
                <UInput v-model="title" size="xl" placeholder="Give your piece a title" class="w-full" :ui="{ base: 'text-2xl font-semibold sm:text-3xl' }" />
              </UFormField>

              <UFormField label="Short introduction" name="excerpt" hint="Optional">
                <UTextarea v-model="excerpt" :rows="2" autoresize placeholder="Set the scene in a sentence or two" class="w-full" />
              </UFormField>

              <div class="overflow-clip rounded-xl border border-default bg-default shadow-sm">
                <ClientOnly>
                  <UEditor
                    v-slot="{ editor }"
                    v-model="content"
                    content-type="markdown"
                    :starter-kit="{ dropcursor: false, gapcursor: false }"
                    :extensions="editorExtensions"
                    :handlers="editorHandlers"
                    :on-create="handleEditorCreate"
                    placeholder="Start writing… Type / for commands or : for emoji."
                    :ui="{ root: 'min-h-[32rem]', content: 'min-h-[32rem] p-5 sm:p-8', base: 'min-h-[28rem] max-w-3xl sm:px-0' }"
                  >
                    <div class="sticky top-0 z-10 -mx-5 mb-5 border-b border-default bg-default/95 px-4 py-2 backdrop-blur sm:-mx-8 sm:px-7">
                      <UEditorToolbar :editor="editor" :items="toolbarItems" class="justify-center overflow-x-auto" />
                    </div>
                    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
                    <UEditorEmojiMenu :editor="editor" />
                    <UEditorDragHandle v-if="dragHandleReady" :editor="editor" />
                  </UEditor>
                  <template #fallback>
                    <div class="flex min-h-[32rem] items-center justify-center text-sm text-muted">Opening the writing space…</div>
                  </template>
                </ClientOnly>
              </div>
            </div>
          </section>

          <aside class="hidden xl:block">
            <div class="sticky top-6 space-y-6 border-s border-default ps-6">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-dimmed">Draft details</p>
                <dl class="mt-4 space-y-4 text-sm">
                  <div>
                    <dt class="text-muted">Words</dt>
                    <dd class="mt-1 font-medium text-highlighted">{{ wordCount }}</dd>
                  </div>
                  <div>
                    <dt class="text-muted">Format</dt>
                    <dd class="mt-1 font-medium text-highlighted">Markdown</dd>
                  </div>
                  <div>
                    <dt class="text-muted">Storage</dt>
                    <dd class="mt-1 font-medium text-highlighted">Auto-saved</dd>
                  </div>
                </dl>
              </div>

              <USeparator />

              <div class="space-y-3 text-sm leading-6 text-muted">
                <p><span class="font-medium text-default">Tip:</span> Select text to format it, or use the toolbar above the page.</p>
                <p><span class="font-medium text-default">Autosave:</span> Your work is saved as you type. Press <UKbd value="meta" /> <UKbd value="S" /> to force a save when needed.</p>
              </div>
            </div>
          </aside>
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
  <InsertMediaModal
    :open="insertModalOpen"
    :kind="insertKind"
    :youtube-initial="youtubeInitial"
    :catalog-initial="catalogInitial"
    @update:open="handleModalOpenChange"
    @insert-youtube="insertYouTube"
    @insert-catalog="insertCatalog"
  />
</template>
