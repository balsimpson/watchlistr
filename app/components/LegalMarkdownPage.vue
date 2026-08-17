<script setup lang="ts">
import { marked } from 'marked'

const props = defineProps<{ source: string }>()
const route = useRoute()

const renderedMarkdown = computed(() => {
  const html = marked.parse(props.source, { async: false }) as string

  return html
    .replace(/href="(?:\.\/)?PRIVACY\.md"/gi, 'href="/privacy"')
    .replace(/href="(?:\.\/)?TERMS\.md"/gi, 'href="/terms"')
})
</script>

<template>
  <UContainer class="max-w-4xl px-5 py-12 sm:py-16 lg:px-8">
    <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
      <UButton to="/" color="neutral" variant="link" size="sm" icon="i-lucide-arrow-left">
        Back to Discover
      </UButton>

      <nav class="flex items-center gap-1" aria-label="Legal navigation">
        <UButton to="/terms" color="neutral" :variant="route.path === '/terms' ? 'soft' : 'ghost'" size="xs">Terms</UButton>
        <UButton to="/privacy" color="neutral" :variant="route.path === '/privacy' ? 'soft' : 'ghost'" size="xs">Privacy</UButton>
      </nav>
    </div>

    <!-- The rendered source is committed Markdown, not user input. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <article class="legal-document" v-html="renderedMarkdown" />
  </UContainer>
</template>

<style scoped>
.legal-document {
  color: var(--ui-text-muted);
  font-size: 1rem;
  line-height: 1.8;
}

.legal-document :deep(h1) {
  margin: 0 0 1.25rem;
  color: var(--ui-text-highlighted);
  font-size: clamp(2.25rem, 5vw, 3.75rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.08;
}

.legal-document :deep(h2) {
  margin: 3rem 0 0.75rem;
  color: var(--ui-text-highlighted);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.legal-document :deep(p) {
  margin: 1rem 0;
}

.legal-document :deep(ul),
.legal-document :deep(ol) {
  margin: 1rem 0;
  padding-inline-start: 1.5rem;
}

.legal-document :deep(li) {
  margin: 0.45rem 0;
  padding-inline-start: 0.25rem;
}

.legal-document :deep(a) {
  color: var(--ui-primary);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.legal-document :deep(a:hover) {
  color: var(--ui-primary);
}

.legal-document :deep(strong) {
  color: var(--ui-text-default);
  font-weight: 600;
}

.legal-document :deep(hr) {
  margin: 2rem 0;
  border: 0;
  border-top: 1px solid var(--ui-border);
}
</style>
