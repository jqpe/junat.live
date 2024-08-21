import type { Meta, StoryFn } from '@storybook/react'

import { useState } from 'react'
import { expect, userEvent, within } from '@storybook/test'

import { CheckboxItem, CONTENT_TEST_ID, DropdownMenu, Item } from '.'
import Menu from '../../icons/circles_horizontal.svg?react'

export const Default: StoryFn<typeof DropdownMenu> = () => {
  const [didConsumeFood, setDidConsumeFood] = useState(false)

  return (
    <DropdownMenu triggerLabel="open menu" triggerIcon={<Menu />}>
      <Item>Banana 🍌</Item>
      <Item>Pizza 🍕</Item>
      <CheckboxItem
        checked={didConsumeFood}
        onCheckedChange={setDidConsumeFood}
      >
        {didConsumeFood ? (
          <>
            <div>You ate all the food silly. Undo?</div>
            <div>⏮️</div>
          </>
        ) : (
          <>
            <div>Consume food</div>
            <div>👄</div>
          </>
        )}{' '}
      </CheckboxItem>
    </DropdownMenu>
  )
}

// Can toggle checkbox
Default.play = async ctx => {
  const canvas = within(ctx.canvasElement)

  const openMenuAndGetContent = async () => {
    const button = await canvas.findByRole('button')
    await userEvent.click(button)
    return document.querySelector(
      `[data-testId=${CONTENT_TEST_ID}]`,
    ) as HTMLElement
  }

  const getCheckboxItem = async (content: HTMLElement) => {
    return within(content).findByRole('menuitemcheckbox')
  }

  {
    const content = await openMenuAndGetContent()
    const checkboxItem = await getCheckboxItem(content)
    await userEvent.click(checkboxItem)
  }

  {
    const content = await openMenuAndGetContent()
    const checkboxItem = await getCheckboxItem(content)
    expect(checkboxItem.textContent).toMatch(/you ate all the food/i)
  }
}

export default {
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>
