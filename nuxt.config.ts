const auth0Domain = (process.env.NUXT_PUBLIC_AUTH0_DOMAIN ?? process.env.AUTH0_JWT_ISSUER_DOMAIN ?? '')
  .trim()
  .replace(/^https?:\/\//, '')
  .replace(/\/+$/, '')

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  icon: {
    serverBundle: {
      collections: ['lucide'],
    },
    clientBundle: {
      scan: true,
    },
  },
  runtimeConfig: {
    tmdbApiKey: process.env.TMDB_API_KEY ?? process.env.NUXT_PUBLIC_TMDB_API_KEY ?? '',
    googleBooksApiKey: process.env.GOOGLE_BOOKS_API_KEY ?? process.env.NUXT_PUBLIC_GOOGLE_BOOKS_API_KEY ?? '',
    public: {
      convexUrl: process.env.NUXT_PUBLIC_CONVEX_URL ?? process.env.VITE_CONVEX_URL ?? '',
      auth0Domain,
      auth0ClientId: process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID ?? process.env.AUTH0_CLIENT_ID ?? '',
      auth0Audience: process.env.NUXT_PUBLIC_AUTH0_AUDIENCE ?? process.env.VITE_CONVEX_SITE_URL ?? '',
    },
  },
  typescript: {
    strict: true,
    // Run type checking explicitly with `npm run typecheck` instead of on every dev rebuild.
    typeCheck: false,
  },

    vite: {
    optimizeDeps: {
      include: [
        // Prevent duplicate ProseMirror plugin instances in Nuxt UI's editor.
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor'
      ]
    }
  },

  // vite: {
  //   resolve: {
  //     dedupe: ['@tiptap/core', '@tiptap/vue-3', '@tiptap/pm', 'prosemirror-state', 'prosemirror-view', 'prosemirror-model'],
  //   },
  //   optimizeDeps: {
  //     include: ['@tiptap/core', '@tiptap/vue-3', '@tiptap/markdown', '@tiptap/starter-kit'],
  //   },
  // },
})
