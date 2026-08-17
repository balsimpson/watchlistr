import { ConvexClient } from 'convex/browser'
import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const convex = config.public.convexUrl ? new ConvexClient(config.public.convexUrl) : null

  if (!config.public.auth0Domain || !config.public.auth0ClientId) {
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
    authorizationParams: {
      redirect_uri: window.location.origin,
      ...(config.public.auth0Audience ? { audience: config.public.auth0Audience } : {}),
    },
  })

  const fetchAuthToken = async () => {
    if (!auth0.isAuthenticated.value) return null
    try {
      const response = await auth0.getAccessTokenSilently({ detailedResponse: true })
      return response.id_token ?? null
    } catch {
      return null
    }
  }

  nuxtApp.vueApp.use(auth0)

  // Auth0 resolves its stored session asynchronously. Rebind Convex after that
  // transition so subscriptions created during app startup do not stay anonymous.
  watch([auth0.isLoading, auth0.isAuthenticated], () => {
    convex?.setAuth(fetchAuthToken)
  }, { immediate: true })

  return {
    provide: {
      convex,
    },
  }
})
