import { useAuth0 } from '@auth0/auth0-vue'

type Auth0State = ReturnType<typeof useAuth0>
type WatchlistrAuthState = Auth0State & { isConfigured: boolean }

export function useWatchlistrAuth(): WatchlistrAuthState {
  const config = useRuntimeConfig()
  const isConfigured = Boolean(config.public.auth0Domain && config.public.auth0ClientId)

  if (import.meta.server || !isConfigured) {
    return {
      isAuthenticated: ref(false),
      isLoading: ref(false),
      user: ref(undefined),
      isConfigured,
    } as WatchlistrAuthState
  }

  return { ...useAuth0(), isConfigured }
}
