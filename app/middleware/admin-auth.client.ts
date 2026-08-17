export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isLoading, isConfigured } = useWatchlistrAuth()

  if (isLoading.value || !isConfigured || isAuthenticated.value) return

  return navigateTo({
    path: '/admin/sign-in',
    query: { redirect: to.fullPath },
  })
})
