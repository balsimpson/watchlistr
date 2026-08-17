<script setup lang="ts">
const route = useRoute()
const { isAuthenticated, isLoading, isConfigured, loginWithRedirect } = useWatchlistrAuth()
const isClientReady = ref(false)

const redirectTarget = computed(() => {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/admin'
})

watch([isLoading, isAuthenticated], ([loading, authenticated]) => {
  if (!loading && authenticated) {
    void navigateTo(redirectTarget.value, { replace: true })
  }
}, { immediate: true })

const signIn = () => loginWithRedirect({ appState: { target: redirectTarget.value } })

onMounted(() => {
  isClientReady.value = true
})

useSeoMeta({
  title: 'Admin sign in — Watchlistr',
  description: 'Sign in to manage Watchlistr content.',
})
</script>

<template>
  <main class="relative isolate flex min-h-dvh items-center justify-center overflow-hidden px-5 py-16">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgb(120_53_15_/_0.22),transparent_32rem)]" />

    <UCard class="w-full max-w-md" :ui="{ body: 'p-7 sm:p-9' }">
      <div class="space-y-8">
        <div>
          <NuxtLink to="/" class="inline-flex" aria-label="Back to Watchlistr">
            <img src="/watchlistr_logo_white.png" alt="Watchlistr" class="h-8 w-auto" />
          </NuxtLink>
          <h1 class="mt-10 text-3xl font-semibold tracking-tight text-highlighted">Sign in to your workspace</h1>
          <p class="mt-3 leading-7 text-muted">Use your Watchlistr account to open the admin area.</p>
        </div>

        <div v-if="!isClientReady || isLoading" class="space-y-3" aria-live="polite">
          <USkeleton class="h-12 w-full rounded-md" />
          <p class="text-center text-sm text-muted">Checking your session…</p>
        </div>

        <UAlert
          v-else-if="!isConfigured"
          color="warning"
          variant="soft"
          icon="i-lucide-info"
          title="Auth0 still needs configuration"
          description="Add the Auth0 domain and client ID to the web app environment before signing in."
        />

        <div v-else-if="isAuthenticated" class="flex items-center justify-center gap-2 text-sm text-muted" aria-live="polite">
          <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
          Opening your workspace…
        </div>

        <UButton
          v-else
          color="primary"
          variant="solid"
          size="lg"
          block
          icon="i-lucide-arrow-right"
          @click="signIn"
        >
          Continue with Auth0
        </UButton>

        <p class="text-sm leading-6 text-muted">
          After signing in, open Write to start an editorial draft.
        </p>
      </div>
    </UCard>
  </main>
</template>
