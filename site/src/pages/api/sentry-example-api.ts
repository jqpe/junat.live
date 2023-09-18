/* eslint-disable unicorn/filename-case*/

// A faulty API route to test Sentry's error monitoring
export default function handler() {
  throw new Error('Sentry Example API Route Error')
}
