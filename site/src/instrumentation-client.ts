// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [
    Sentry.captureConsoleIntegration({ levels: ['error', 'warn'] }),
  ],
  tracesSampleRate: 1,
  enableLogs: true,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
