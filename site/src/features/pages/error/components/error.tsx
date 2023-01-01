import type { ErrorProps } from 'next/error'
import type { NextPageContext } from 'next'

import * as Sentry from '@sentry/nextjs'
import NextErrorComponent from 'next/error'

export function Error(props: ErrorProps) {
  return <NextErrorComponent statusCode={props.statusCode} />
}

Error.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData)

  return NextErrorComponent.getInitialProps(contextData)
}
