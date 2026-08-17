<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { isLoading, user, logout } = useWatchlistrAuth()

const navigation = computed<NavigationMenuItem[][]>(() => [[{
  label: 'Editorial desk',
  icon: 'i-lucide-layout-dashboard',
  to: '/admin',
}, {
  label: 'Write',
  icon: 'i-lucide-pencil',
  to: '/admin/write',
}]])

const logoutUser = () => logout({ logoutParams: { returnTo: window.location.origin } })
</script>

<template>
  <UDashboardGroup storage="cookie" storage-key="watchlistr-admin">
    <UDashboardSidebar collapsible resizable>
      <template #header="{ collapsed }">
        <NuxtLink to="/" class="flex items-center gap-3 px-1" aria-label="Back to Watchlistr">
          <img src="/watchlistr_logo_white.png" alt="Watchlistr" class="h-7 w-auto" />
          <span v-if="!collapsed" class="text-xs font-medium text-muted">Admin</span>
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu :collapsed="collapsed" :items="navigation" orientation="vertical" />
      </template>

      <template #footer="{ collapsed }">
        <div class="space-y-2">
          <div v-if="!collapsed && user" class="truncate px-2 text-xs text-muted">
            {{ user.name || user.email || 'Signed-in account' }}
          </div>
          <UButton
            :icon="collapsed ? 'i-lucide-arrow-left' : undefined"
            :label="collapsed ? undefined : 'Sign out'"
            color="neutral"
            variant="ghost"
            block
            :loading="isLoading"
            @click="logoutUser"
          />
        </div>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
