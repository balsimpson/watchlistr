import { api } from '~~/convex/_generated/api'
import type { CatalogItem, LibraryEntry, LibraryState } from '~/types/catalog'

export function useWatchlistrLibrary() {
  const { $convex } = useNuxtApp()
  const { isAuthenticated, isLoading: authLoading } = useWatchlistrAuth()
  const entries = shallowRef<LibraryEntry[]>([])
  const isLoading = ref(true)
  const error = ref('')
  let unsubscribe: (() => void) | undefined

  const stopSubscription = () => {
    unsubscribe?.()
    unsubscribe = undefined
  }

  const startSubscription = () => {
    stopSubscription()
    error.value = ''

    if (authLoading.value) return
    if (!isAuthenticated.value) {
      entries.value = []
      isLoading.value = false
      return
    }
    if (!$convex) {
      error.value = 'Convex is not configured.'
      isLoading.value = false
      return
    }

    isLoading.value = true
    unsubscribe = $convex.onUpdate(api.library.list, {}, (nextEntries) => {
      entries.value = nextEntries as LibraryEntry[]
      isLoading.value = false
    }, (nextError) => {
      error.value = nextError instanceof Error ? nextError.message : 'Could not load your library.'
      isLoading.value = false
    })
  }

  watch([authLoading, isAuthenticated], startSubscription, { immediate: true })
  onUnmounted(stopSubscription)

  const save = async (item: CatalogItem) => {
    if (!$convex || !isAuthenticated.value) return
    await $convex.mutation(api.library.upsert, {
      operationId: crypto.randomUUID(),
      item: { ...item, createdAt: item.createdAt || Date.now(), updatedAt: item.updatedAt || Date.now() },
      state: 'saved',
      addedAt: Date.now(),
    })
  }

  const updateState = async (uid: string, state: LibraryState) => {
    if (!$convex || !isAuthenticated.value) return
    await $convex.mutation(api.library.updateState, {
      operationId: crypto.randomUUID(),
      uid,
      state,
    })
  }

  const remove = async (uid: string) => {
    if (!$convex || !isAuthenticated.value) return
    await $convex.mutation(api.library.remove, {
      operationId: crypto.randomUUID(),
      uid,
    })
  }

  const activeEntries = computed<LibraryEntry[]>(() => entries.value.filter((entry: LibraryEntry) => !entry.deletedAt))
  const savedUids = computed<Set<string>>(() => new Set(activeEntries.value.map((entry: LibraryEntry) => entry.uid)))

  return {
    entries: activeEntries,
    savedUids,
    isLoading,
    error,
    save,
    updateState,
    remove,
  }
}
