<template>
  <header class="border-b border-muted/70 bg-default/75 backdrop-blur-xl">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-3" aria-label="Watchlistr home">
        <img src="/watchlistr_logo_white.png" alt="Watchlistr" class="h-7 w-auto" />
      </NuxtLink>

      <nav class="flex items-center gap-1" aria-label="Primary navigation">
        <UButton to="/" color="neutral" variant="ghost" size="sm">Discover</UButton>
        <UButton to="/user/watchlist" color="neutral" variant="ghost" size="sm">My library</UButton>

        <template v-if="isAuthenticated">
          <UButton to="/admin" color="neutral" variant="ghost" size="sm">Admin</UButton>
          <UAvatar v-if="user?.picture" :src="user.picture" :alt="user.name ?? 'Account'" size="sm" class="ml-2" />
          <UButton color="neutral" variant="ghost" size="sm" :loading="isLoading" @click="logoutUser">
            Sign out
          </UButton>
        </template>
        <UButton v-else-if="isConfigured" color="primary" variant="solid" size="sm" :loading="isLoading" @click="login">
          Sign in
        </UButton>
        <UBadge v-else color="neutral" variant="soft" size="sm" class="ml-2">Auth0 setup required</UBadge>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const { isAuthenticated, isLoading, user, isConfigured, loginWithRedirect, logout } = useWatchlistrAuth()

const login = () => loginWithRedirect()
const logoutUser = () => logout({ logoutParams: { returnTo: window.location.origin } })
</script>
