<template>
  <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted px-6 py-12 text-center">
    <UIcon v-if="icon" :name="icon" class="size-7 text-primary" />
    <h2 class="mt-4 text-lg font-semibold text-highlighted">{{ title }}</h2>
    <p class="mt-2 max-w-md text-sm text-muted">{{ description }}</p>
    <div v-if="$slots.actions" class="mt-6">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon?: string; title: string; description: string }>()
</script>
