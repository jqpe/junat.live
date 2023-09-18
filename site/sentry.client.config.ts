import * as Sentry from '@sentry/nextjs'

if (process.env.NODE_ENV === 'production' && !process.env.SENTRY_DSN) {
  throw 'SENTRY_DSN was not configured which was probably unintended'
}

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
