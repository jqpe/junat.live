import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      enabled: process.env.NODE_ENV === 'production',
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1,
      enableLogs: true,
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      enabled: process.env.NODE_ENV === 'production',
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1,
      enableLogs: true,
    })
  }
}

export const onRequestError = Sentry.captureRequestError
