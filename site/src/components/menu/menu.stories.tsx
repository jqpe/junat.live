import type { Meta, StoryFn } from '@storybook/nextjs'

import { useRouter } from 'next/router'

import { Menu } from './'

export const Default: StoryFn<typeof Menu> = () => {
  const router = useRouter()
  router.locale = 'en'

  return <Menu />
}

export default {
  component: Menu,
} satisfies Meta<typeof Menu>
