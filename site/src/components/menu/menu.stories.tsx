import type { Meta, StoryFn } from '@storybook/react'
import { Menu } from './'

import { useRouter } from 'next/router'

export const Default: StoryFn<typeof Menu> = () => {
  const router = useRouter()
  router.locale = 'en'

  return <Menu />
}

export default {
  component: Menu
} satisfies Meta<typeof Menu>
