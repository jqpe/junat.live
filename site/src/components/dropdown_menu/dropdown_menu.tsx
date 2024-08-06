import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'

import {
  Arrow,
  Content,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-dropdown-menu'
import { cx } from 'cva'
import React from 'react'

import CirclesHorizontal from '@junat/ui/icons/circles_horizontal.svg'

type Props = DropdownMenuProps & {
  children: React.ReactNode | React.ReactNode[]
  /**
   * Accessible label for trigger button.
   */
  triggerLabel: string
  triggerIcon?: React.ReactNode | React.ReactNode[]
}

export const TRIGGER_TEST_ID = 'dropdown-menu-trigger' as const
export const CONTENT_TEST_ID = 'dropdown-menu-content' as const

export const DropdownMenu = (props: Props) => {
  const rootProps: DropdownMenuProps = Object.fromEntries(
    Object.keys(props)
      .filter(key => !/children|triggerLabel/.test(key))
      .map(key => [key, props[key as keyof Props]]),
  )

  return (
    <Root {...rootProps}>
      <Trigger asChild>
        <button
          data-testid={TRIGGER_TEST_ID}
          className={cx(
            'relative inline-flex h-[35px] w-[35px] cursor-pointer items-center justify-center',
            'rounded-full border-2 border-transparent bg-gray-300 fill-gray-800',
            'focus-visible:outline-none dark:bg-gray-700 dark:fill-gray-400',
            'text-primary-900 focus-visible:[border:2px_solid_theme(colors.primary.500)]',
          )}
          aria-label={props.triggerLabel}
        >
          {props.triggerIcon || <CirclesHorizontal />}
        </button>
      </Trigger>

      <Portal>
        <Content
          data-testid={CONTENT_TEST_ID}
          className={cx(
            'flex min-w-[260px] flex-col gap-1 rounded-md bg-gray-200 px-1 duration-300',
            'text-gray-800 [border:1px_solid_theme(colors.gray.400)] dark:bg-gray-800',
            'py-2 data-[side=right]:animate-slideLeftAndFade dark:text-gray-300',
            'shadow-dropdown-menu data-[side=bottom]:animate-slideUpAndFade',
            'data-[side=left]:animate-slideRightAndFade dark:border-none',
          )}
          sideOffset={5}
          align="end"
          alignOffset={1}
          onCloseAutoFocus={event => event.preventDefault()}
        >
          <Arrow className="fill-gray-400 dark:fill-gray-800" />

          {props.children}
        </Content>
      </Portal>
    </Root>
  )
}
