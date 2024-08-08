import type { Meta, StoryFn } from '@storybook/react'

import { useRouter } from 'next/router'

import { AppFooter } from '.'

export const Default: StoryFn<typeof AppFooter> = () => {
  const router = useRouter()
  router.locale = 'en'

  const props: Parameters<StoryFn<typeof AppFooter>>[0] = {
    stations: [],
  }

  return <AppFooter {...props} />
}

export default { component: AppFooter } satisfies Meta<typeof AppFooter>
