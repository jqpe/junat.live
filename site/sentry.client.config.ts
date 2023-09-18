import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1,
  debug: false,
  replaysOnErrorSampleRate: 1,
  replaysSessionSampleRate: process.env.NODE_ENV === 'development' ? 1 : 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true
    })
  ]
})
