import * as Sentry from '@sentry/nextjs'

/**
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
})
