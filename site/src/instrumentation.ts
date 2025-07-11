import * as Sentry from '@sentry/nextjs'

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Node.js config
    Sentry.init({
      enabled: process.env.NODE_ENV === 'production',
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1,
      debug: false,
    })
  }

  // Edge config
  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      enabled: process.env.NODE_ENV === 'production',
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1,
      debug: false,
    })
  }
}

export const onRequestError = Sentry.captureRequestError
