import { CaptureConsole } from '@sentry/integrations'
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  replaysOnErrorSampleRate: 1,
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
  integrations: [
    new CaptureConsole({ levels: ['error', 'warn'] }),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1,
  debug: false
})
