import type { Meta, StoryFn } from '@storybook/react'

import { AppFooter } from '.'
import { useRouter } from 'next/router'

export const Default: StoryFn<typeof AppFooter> = args => {
  const router = useRouter()
  router.locale = 'en'

  const props = {
    router,
    stations: []
  } satisfies typeof args

  return <AppFooter {...props} />
}

export default { component: AppFooter } satisfies Meta<typeof AppFooter>
