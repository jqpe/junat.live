import React from 'react'

interface Umami {
  /**
   * Send a pageview event (this is done automatically)
   */
  track(): void
  /**
   * Send a event without payload, e.g. 'signup'
   */
  track(eventName: string): void
  /**
   * Send an event with a payload, e.g ('signup', {date: "2020-01-01"})
   */
  track(eventName: string, payload: Record<string, unknown> | string): void
  /**
   * Send an event with payload created with props collected by umami
   */
  track(
    props: (
      props: Props
    ) => { website: string } & Partial<Props> & Record<string, unknown>
  ): void
}

type Props = {
  hostname: string
  language: string
  referrer: string
  screen: string
  title: string
  url: string
  website: string
}

/**
 * Returns an analytics object to track events.
 */
export const useAnalytics = () => {
  const [umami, setUmami] = React.useState<Umami>()

  React.useEffect(() => {
    if ('umami' in window) {
      setUmami(window.umami as Umami)
    }
  }, [])

  return umami
}
