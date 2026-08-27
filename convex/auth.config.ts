import type { AuthConfig } from 'convex/server'

const auth0Domain = process.env.AUTH0_JWT_ISSUER_DOMAIN
// Comma-separated list of Auth0 application IDs whose tokens this deployment
// accepts. Both first-party clients authenticate against the same tenant:
// - CTWxL1lF… : "Watchlistr Web App" (Single Page Application)
// - dQyk2N6h… : "Watchlistr" (Native — Chrome extension)
const applicationIds = (process.env.AUTH0_CLIENT_ID ?? '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean)

export default {
  providers:
    auth0Domain && applicationIds.length > 0
      ? applicationIds.map((applicationID) => ({
          domain: auth0Domain,
          applicationID,
        }))
      : [],
} satisfies AuthConfig
