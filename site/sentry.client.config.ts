import { CaptureConsole } from '@sentry/integrations'
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [new CaptureConsole({ levels: ['error', 'warn'] })],
  tracesSampleRate: 1,
  debug: false
})
