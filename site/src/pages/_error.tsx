import type { NextPageContext } from 'next'
import type { ErrorProps } from 'next/error'

import NextErrorComponent from 'next/error'
import * as Sentry from '@sentry/nextjs'

export default function Error(props: ErrorProps) {
  return <NextErrorComponent statusCode={props.statusCode} />
}

Error.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData)

  return NextErrorComponent.getInitialProps(contextData)
}
