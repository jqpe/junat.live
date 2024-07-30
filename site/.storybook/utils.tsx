import type { Locale } from '~/types/common'

import { useRouter } from 'next/router'

import { LocaleProvider } from '~/i18n'
import Page from '../src/layouts/page'

export const withPageLayout = () => (Story: () => JSX.Element) => (
  <Page>
    <Story />
  </Page>
)

export const withI18n = () => (Story: () => JSX.Element) => {
  const router = useRouter()

  return (
    <LocaleProvider locale={router.locale as Locale}>
      <Story />
    </LocaleProvider>
  )
}
