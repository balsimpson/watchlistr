<script setup lang="ts">
import { api } from '~~/convex/_generated/api'
import type { Id } from '~~/convex/_generated/dataModel'
import type { PersistedEditorDraft } from '~~/shared/types/editor'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth-client',
})

type CollectionStatus = 'draft' | 'published'

type AdminArticle = {
  _id: Id<'discoverCollections'>
  slug: string
  title: string
  excerpt?: string
  status: CollectionStatus
  createdAt: number
  updatedAt: number
  publishedAt?: number
}

type BrowserDraft = PersistedEditorDraft
type CollectionAction = 'publish' | 'delete'
type DeleteTarget =
  | { kind: 'article'; article: AdminArticle }
  | { kind: 'browser'; draft: BrowserDraft }

const draftStorageKey = 'watchlistr-admin-writing-draft-v1'
const { $convex } = useNuxtApp()
const { isAuthenticated, isLoading: authLoading } = useWatchlistrAuth()
const toast = useToast()
const articles = ref<AdminArticle[]>([])
const browserDraft = ref<BrowserDraft | null>(null)
const statusFilter = ref<CollectionStatus | 'all'>('draft')
const searchTerm = ref('')
const isLoading = ref(true)
const error = ref('')
const pendingAction = ref<{ collectionId: Id<'discoverCollections'>; action: CollectionAction } | null>(null)
const deleteModalOpen = ref(false)
const deleteTarget = ref<DeleteTarget | null>(null)
let articlesLoad: Promise<void> | undefined

const draftArticles = computed(() => articles.value.filter((article) => article.status === 'draft'))
const publishedArticles = computed(() => articles.value.filter((article) => article.status === 'published'))
const filteredArticles = computed(() => {
  const term = searchTerm.value.trim().toLocaleLowerCase()

  return articles.value.filter((article) => {
    const matchesStatus = statusFilter.value === 'all' || article.status === statusFilter.value
    const matchesSearch = !term || `${article.title} ${article.slug}`.toLocaleLowerCase().includes(term)
    return matchesStatus && matchesSearch
  }).sort((left, right) => right.updatedAt - left.updatedAt)
})

const filterOptions = computed(() => [
  { value: 'draft' as const, label: 'Drafts', count: draftArticles.value.length },
  { value: 'published' as const, label: 'Published', count: publishedArticles.value.length },
  { value: 'all' as const, label: 'All articles', count: articles.value.length },
])

const errorDescription = computed(() => {
  if (error.value.includes('Administrator access required')) {
    return 'Your account is signed in but is not an administrator yet. Assign the first admin once with `npx convex run users:assignFirstAdmin` using your Auth0 subject.'
  }

  return error.value
})

const browserDraftWordCount = computed(() => countWords(browserDraft.value?.content ?? ''))

function countWords(value: string) {
  return value.replace(/[#*_>`~-]/g, ' ').trim().split(/\s+/).filter(Boolean).length
}

function hasBrowserDraftValues(draft: BrowserDraft) {
  return Boolean(draft.title?.trim() || draft.excerpt?.trim() || draft.content?.trim())
}

function loadBrowserDraft() {
  if (!import.meta.client) return

  const savedDraft = localStorage.getItem(draftStorageKey)
  if (!savedDraft) return

  try {
    const draft = JSON.parse(savedDraft) as BrowserDraft
    if (draft.collectionId) return
    if (!hasBrowserDraftValues(draft)) {
      localStorage.removeItem(draftStorageKey)
      return
    }
    browserDraft.value = draft
  } catch {
    localStorage.removeItem(draftStorageKey)
  }
}

function slugify(value: string) {
  return value.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function syncBrowserDraft() {
  const draft = browserDraft.value
  if (!$convex || !draft || draft.collectionId || !hasBrowserDraftValues(draft)) return

  try {
    const slug = draft.slug || slugify(draft.title ?? '') || `draft-${draft.savedAt ?? Date.now()}`
    const collectionId = await $convex.mutation(api.admin.saveCollection, {
      slug,
      title: draft.title?.trim() || 'Untitled draft',
      excerpt: draft.excerpt?.trim() || undefined,
      content: draft.content ?? '',
    })
    const syncedDraft = { ...draft, slug, collectionId }
    localStorage.setItem(draftStorageKey, JSON.stringify(syncedDraft))
    browserDraft.value = null
  } catch {
    // The queue error provides the actionable admin/auth state when setup is incomplete.
  }
}

function formatDate(timestamp: number | undefined) {
  if (!timestamp) return 'Not saved yet'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(timestamp)
}

function formatStatus(status: CollectionStatus) {
  return status === 'published' ? 'Published' : 'Draft'
}

function isPendingAction(collectionId: Id<'discoverCollections'>, action: CollectionAction) {
  return pendingAction.value?.collectionId === collectionId && pendingAction.value.action === action
}

async function togglePublished(article: AdminArticle) {
  if (!$convex || pendingAction.value) return

  pendingAction.value = { collectionId: article._id, action: 'publish' }
  const published = article.status === 'draft'

  try {
    await $convex.mutation(api.admin.setPublished, { collectionId: article._id, published })
    toast.add({
      title: published ? 'Article published' : 'Article moved back to drafts',
      description: published ? 'It is now visible on the Discover page.' : 'It is hidden from Discover until you publish it again.',
      color: published ? 'success' : 'neutral',
      icon: published ? 'i-lucide-globe-2' : 'i-lucide-eye-off',
    })
  } catch (publishError) {
    toast.add({
      title: 'Publication status did not change',
      description: publishError instanceof Error ? publishError.message : 'Try again in a moment.',
      color: 'error',
      icon: 'i-lucide-circle-alert',
    })
  } finally {
    pendingAction.value = null
  }
}

function removeStoredDraftForCollection(collectionId: Id<'discoverCollections'>) {
  if (!import.meta.client) return

  const savedDraft = localStorage.getItem(draftStorageKey)
  if (!savedDraft) return

  try {
    const draft = JSON.parse(savedDraft) as BrowserDraft
    if (draft.collectionId === collectionId) localStorage.removeItem(draftStorageKey)
  } catch {
    localStorage.removeItem(draftStorageKey)
  }
}

function requestDeleteArticle(article: AdminArticle) {
  if (pendingAction.value) return
  deleteTarget.value = { kind: 'article', article }
  deleteModalOpen.value = true
}

function requestDeleteBrowserDraft() {
  if (!browserDraft.value || pendingAction.value) return
  deleteTarget.value = { kind: 'browser', draft: browserDraft.value }
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  if (pendingAction.value?.action === 'delete') return
  deleteModalOpen.value = false
  deleteTarget.value = null
}

const deleteModalDescription = computed(() => {
  const target = deleteTarget.value
  if (!target) return ''
  if (target.kind === 'browser') return 'This removes the unsynced writing draft from this browser.'
  return `This permanently removes "${target.article.title}" and cannot be undone.`
})

async function confirmDelete() {
  const target = deleteTarget.value
  if (!target || pendingAction.value) return

  if (target.kind === 'browser') {
    if (import.meta.client) localStorage.removeItem(draftStorageKey)
    browserDraft.value = null
    closeDeleteModal()
    toast.add({
      title: 'Writing draft deleted',
      description: 'The unsynced draft was removed from this browser.',
      color: 'neutral',
      icon: 'i-lucide-trash-2',
    })
    return
  }

  if (!$convex) return

  pendingAction.value = { collectionId: target.article._id, action: 'delete' }
  try {
    await $convex.mutation(api.admin.deleteCollection, { collectionId: target.article._id })
    removeStoredDraftForCollection(target.article._id)
    toast.add({
      title: 'Draft deleted',
      description: 'The article was permanently removed from the publishing queue.',
      color: 'neutral',
      icon: 'i-lucide-trash-2',
    })
  } catch (deleteError) {
    toast.add({
      title: 'Draft could not be deleted',
      description: deleteError instanceof Error ? deleteError.message : 'Try again in a moment.',
      color: 'error',
      icon: 'i-lucide-circle-alert',
    })
  } finally {
    pendingAction.value = null
    closeDeleteModal()
  }
}

let stopCollections: (() => void) | undefined

async function loadCollections() {
  if (articlesLoad || authLoading.value || !isAuthenticated.value) return

  articlesLoad = (async () => {
    if (!$convex) {
      error.value = 'Content storage is not connected in this environment.'
      isLoading.value = false
      return
    }

    try {
      await $convex.mutation(api.users.initialize, {})
      stopCollections = $convex.onUpdate(api.admin.listCollections, {}, (nextCollections) => {
        articles.value = nextCollections as AdminArticle[]
        isLoading.value = false
        error.value = ''
      }, (nextError) => {
        error.value = nextError instanceof Error ? nextError.message : 'Saved articles could not be loaded. Check the admin connection and try again.'
        isLoading.value = false
      })
    } catch (nextError) {
      error.value = nextError instanceof Error ? nextError.message : 'Saved articles could not be loaded. Check the admin connection and try again.'
      isLoading.value = false
    }
  })()

  await articlesLoad
}

watch([authLoading, isAuthenticated], () => {
  void loadCollections()
}, { immediate: true })

onMounted(() => {
  loadBrowserDraft()
  void syncBrowserDraft()
})

onUnmounted(() => stopCollections?.())

useSeoMeta({
  title: 'Editorial desk — Watchlistr',
  description: 'Review and publish Watchlistr articles.',
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Editorial desk">
        <template #right>
          <UButton to="/" color="neutral" variant="ghost" icon="i-lucide-arrow-up-right">View site</UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UContainer class="max-w-6xl py-8 sm:py-10">
        <div class="flex flex-col justify-between gap-6 border-b border-default pb-8 sm:flex-row sm:items-end">
          <div>
            <h1 class="text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">Saved drafts</h1>
            <p class="mt-3 max-w-2xl text-base leading-7 text-muted">Review an article, publish it to Discover, or keep it private while you work.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton to="/admin/write" color="primary" variant="solid" icon="i-lucide-pencil">Write an article</UButton>
          </div>
        </div>

        <section v-if="browserDraft" class="mt-8 border border-primary/30 bg-primary/5 px-5 py-5 sm:px-6" aria-labelledby="browser-draft-heading">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex min-w-0 items-start gap-4">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <UIcon name="i-lucide-pencil" class="size-5" />
              </div>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 id="browser-draft-heading" class="font-semibold text-highlighted">{{ browserDraft.title || 'Untitled writing draft' }}</h2>
                  <UBadge color="primary" variant="soft" size="xs">Writing draft</UBadge>
                </div>
                <p class="mt-1 line-clamp-2 text-sm text-muted">
                  {{ browserDraft.excerpt || `${browserDraftWordCount} words · saved in this browser` }}
                </p>
              </div>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <UButton to="/admin/write" color="primary" variant="soft" trailing-icon="i-lucide-arrow-right">Continue writing</UButton>
              <UButton
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                aria-label="Delete writing draft"
                @click="requestDeleteBrowserDraft"
              />
            </div>
          </div>
        </section>

        <section class="mt-10" aria-labelledby="articles-heading">
          <div class="flex flex-col gap-5 border-b border-default pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 id="articles-heading" class="text-xl font-semibold text-highlighted">Publishing queue</h2>
              <p class="mt-1 text-sm text-muted">Drafts stay private. Published articles appear on Discover.</p>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div class="flex items-center gap-1" role="tablist" aria-label="Article status">
                <UButton
                  v-for="option in filterOptions"
                  :key="option.value"
                  :color="statusFilter === option.value ? 'primary' : 'neutral'"
                  :variant="statusFilter === option.value ? 'soft' : 'ghost'"
                  size="sm"
                  role="tab"
                  :aria-selected="statusFilter === option.value"
                  @click="statusFilter = option.value"
                >
                  {{ option.label }} <span class="ms-1 text-xs opacity-60">{{ option.count }}</span>
                </UButton>
              </div>
              <UInput v-model="searchTerm" icon="i-lucide-search" size="sm" placeholder="Find an article" aria-label="Find an article" class="w-full sm:w-48" />
            </div>
          </div>

          <UAlert v-if="error" class="mt-6" color="error" variant="soft" icon="i-lucide-circle-alert" title="The publishing queue is unavailable" :description="errorDescription" />

          <div v-else-if="isLoading" class="mt-2 divide-y divide-default border-b border-default">
            <div v-for="slot in 3" :key="slot" class="flex items-center justify-between gap-4 py-5">
              <div class="flex min-w-0 flex-1 items-center gap-4">
                <USkeleton class="size-10 shrink-0 rounded-lg" />
                <div class="min-w-0 flex-1 space-y-2">
                  <USkeleton class="h-4 w-2/5" />
                  <USkeleton class="h-3 w-1/3" />
                </div>
              </div>
              <USkeleton class="h-8 w-20" />
            </div>
          </div>

          <div v-else-if="filteredArticles.length" class="mt-2 divide-y divide-default border-b border-default">
            <article v-for="article in filteredArticles" :key="article._id" class="group flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex min-w-0 items-start gap-4">
                <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-elevated text-muted transition-colors group-hover:text-primary">
                  <UIcon :name="article.status === 'published' ? 'i-lucide-globe-2' : 'i-lucide-file-text'" class="size-5" />
                </div>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="truncate font-semibold text-highlighted">{{ article.title }}</h3>
                    <UBadge color="primary" variant="soft" size="xs">Article</UBadge>
                    <UBadge :color="article.status === 'published' ? 'success' : 'neutral'" variant="soft" size="xs">
                      {{ formatStatus(article.status) }}
                    </UBadge>
                  </div>
                  <p class="mt-1 truncate text-sm text-muted">/{{ article.slug }} · Updated {{ formatDate(article.updatedAt) }}</p>
                </div>
              </div>
              <div class="flex shrink-0 items-center gap-3 sm:ps-4">
                <span v-if="article.status === 'published'" class="hidden text-xs text-muted md:inline">Live {{ formatDate(article.publishedAt) }}</span>
                <UButton
                  :to="{ path: '/admin/write', query: { articleId: article._id } }"
                  color="neutral"
                  variant="soft"
                  size="sm"
                  icon="i-lucide-pencil"
                >
                  Edit
                </UButton>
                <UButton
                  :color="article.status === 'draft' ? 'primary' : 'neutral'"
                  :variant="article.status === 'draft' ? 'solid' : 'soft'"
                  size="sm"
                  :icon="article.status === 'draft' ? 'i-lucide-send' : 'i-lucide-eye-off'"
                  :loading="isPendingAction(article._id, 'publish')"
                  :disabled="Boolean(pendingAction)"
                  @click="togglePublished(article)"
                >
                  {{ article.status === 'draft' ? 'Publish' : 'Unpublish' }}
                </UButton>
                <UButton
                  v-if="article.status === 'draft'"
                  color="error"
                  variant="ghost"
                  size="sm"
                  icon="i-lucide-trash-2"
                  :aria-label="`Delete ${article.title}`"
                  :loading="isPendingAction(article._id, 'delete')"
                  :disabled="Boolean(pendingAction)"
                  @click="requestDeleteArticle(article)"
                />
              </div>
            </article>
          </div>

          <div v-else class="border-b border-default py-16 text-center">
            <UIcon name="i-lucide-file-text" class="mx-auto size-8 text-dimmed" />
            <h3 class="mt-4 font-semibold text-highlighted">{{ searchTerm ? 'No articles match that search' : statusFilter === 'draft' ? 'No saved drafts yet' : statusFilter === 'published' ? 'Nothing published yet' : 'No articles yet' }}</h3>
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              {{ searchTerm ? 'Try a different title or slug.' : statusFilter === 'draft' ? 'Write an article and it will appear here automatically for review.' : statusFilter === 'published' ? 'Publish a saved draft when it is ready for Discover.' : 'Write an article to start the publishing queue.' }}
            </p>
            <div class="mt-4 flex flex-wrap justify-center gap-2">
              <UButton v-if="!searchTerm" color="primary" variant="soft" icon="i-lucide-pencil" to="/admin/write">Write an article</UButton>
              <UButton v-if="searchTerm" color="neutral" variant="link" @click="searchTerm = ''">Clear search</UButton>
            </div>
          </div>
        </section>
      </UContainer>
    </template>
  </UDashboardPanel>
  <UModal
    v-model:open="deleteModalOpen"
    title="Delete draft?"
    :description="deleteModalDescription"
    :ui="{ footer: 'justify-end' }"
    @update:open="(open) => { if (!open) closeDeleteModal() }"
  >
    <template #footer>
      <UButton color="neutral" variant="outline" :disabled="pendingAction?.action === 'delete'" @click="closeDeleteModal">Cancel</UButton>
      <UButton color="error" icon="i-lucide-trash-2" :loading="pendingAction?.action === 'delete'" @click="confirmDelete">Delete draft</UButton>
    </template>
  </UModal>
</template>
