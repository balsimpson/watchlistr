<template>
  <section class="mx-auto max-w-6xl px-5 py-16 lg:px-8">
    <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div>
        <p class="text-sm font-medium text-primary">Your library</p>
        <h1 class="mt-2 text-4xl font-semibold tracking-tight text-highlighted">Saved for later</h1>
        <p class="mt-3 max-w-xl text-muted">One list for the movies, shows, and books you do not want to lose.</p>
      </div>
      <UButton to="/" color="primary" variant="solid" icon="i-lucide-plus">Find something to save</UButton>
    </div>

    <UAlert v-if="error" class="mt-8" color="error" variant="soft" title="Your library could not be loaded" :description="error" />
    <div v-else-if="isLoading" class="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <USkeleton v-for="slot in 5" :key="slot" class="aspect-[2/3] rounded-lg" />
    </div>
    <EmptyState v-else-if="!entries.length" icon="i-lucide-bookmark" title="Your library is empty" description="Search for a title and save it here when you find one worth keeping." class="mt-16">
      <template #actions>
        <UButton to="/" color="primary" variant="solid">Start exploring</UButton>
      </template>
    </EmptyState>
    <div v-else class="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <MediaTile v-for="entry in entries" :key="entry.uid" :item="entry.item" :saved="true" :pending="pendingUid === entry.uid" @remove="removeEntry(entry.uid)" />
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'watchlist-auth-client' })

useSeoMeta({
  title: 'My library — Watchlistr',
  description: 'Your saved movies, shows, and books.',
})

const { entries, isLoading, error, remove } = useWatchlistrLibrary()
const pendingUid = ref('')

const removeEntry = async (uid: string) => {
  pendingUid.value = uid
  try {
    await remove(uid)
  } finally {
    pendingUid.value = ''
  }
}
</script>
