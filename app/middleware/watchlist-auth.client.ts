export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated, isLoading, isConfigured, loginWithRedirect } = useWatchlistrAuth()

  if (isLoading.value) return
  if (!isConfigured) return navigateTo('/')
  if (!isAuthenticated.value) {
    return loginWithRedirect({ appState: { target: '/user/watchlist' } })
  }
})
