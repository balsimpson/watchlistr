import { ConvexClient } from 'convex/browser'
import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const auth0Configured = Boolean(config.public.auth0Domain && config.public.auth0ClientId)

  const convex = config.public.convexUrl
    ? new ConvexClient(config.public.convexUrl, auth0Configured ? { expectAuth: true } : undefined)
    : null

  if (!auth0Configured) {
    return {
      provide: {
        convex,
      },
    }
  }

  const auth0 = createAuth0({
    domain: config.public.auth0Domain,
    clientId: config.public.auth0ClientId,
    cacheLocation: 'localstorage',
    // Always renew via the refresh-token grant (no third-party cookies needed),
    // so silent renewal never depends on the hidden authorize iframe, which
    // Brave's shields block and which otherwise stalls renewal for 60s.
    useRefreshTokens: true,
    authorizationParams: {
      redirect_uri: window.location.origin,
      // offline_access enables the refresh-token flow, so silent renewal works
      // even when third-party cookies are blocked (Brave shields, etc.)
      scope: 'openid profile email offline_access',
      ...(config.public.auth0Audience ? { audience: config.public.auth0Audience } : {}),
    },
  })

  const fetchAuthToken = async ({ forceRefreshToken = false }: { forceRefreshToken?: boolean } = {}) => {
    // No session → no token. Returning null quietly lets Convex proceed
    // unauthenticated instead of burning a renewal attempt (and console noise)
    // against a session that doesn't exist.
    if (!auth0.isAuthenticated) return null
    try {
      const response = await auth0.getAccessTokenSilently({
        detailedResponse: true,
        cacheMode: forceRefreshToken ? 'off' : 'on',
      })
      return response.id_token ?? null
    } catch (error) {
      // First failure is often the silent-iframe being blocked (Brave shields).
      // Retry bypassing the cache — this exercises the refresh-token grant,
      // which needs no third-party cookies.
      console.warn('[watchlistr] silent token renewal failed, retrying without cache:', error)
      try {
        const retried = await auth0.getAccessTokenSilently({
          detailedResponse: true,
          cacheMode: 'off',
        })
        return retried.id_token ?? null
      } catch (retryError) {
        // Never silently swallow: a null token here means every Convex call
        // arrives unauthenticated and fails with 'Authentication required'.
        console.error('[watchlistr] token renewal failed after retry:', retryError)
        return null
      }
    }
  }

  nuxtApp.vueApp.use(auth0)

  watch([auth0.isLoading, auth0.isAuthenticated], ([isLoading]) => {
    if (isLoading) return
    // Only attach the fetcher once a session exists; while logged out,
    // fetchAuthToken short-circuits to null so Convex stays unauthenticated.
    if (!auth0.isAuthenticated) return
    convex?.setAuth(fetchAuthToken)
  }, { immediate: true })

  return {
    provide: {
      convex,
    },
  }
})
