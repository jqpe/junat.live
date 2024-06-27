import type { Meta, StoryFn } from '@storybook/react'

import { useRouter } from 'next/router'

import { AppFooter } from '.'

export const Default: StoryFn<typeof AppFooter> = args => {
  const router = useRouter()
  router.locale = 'en'

  const props = {
    stations: [],
  } satisfies typeof args

  return <AppFooter {...props} />
}

export default { component: AppFooter } satisfies Meta<typeof AppFooter>
