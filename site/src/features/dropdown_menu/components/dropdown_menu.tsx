import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'

import {
  Arrow,
  Content,
  Portal,
  Root,
  Trigger
} from '@radix-ui/react-dropdown-menu'

import React from 'react'

import CirclesHorizontal from '~/components/icons/circles_horizontal.svg'

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
      .map(key => [key, props[key as keyof Props]])
  )

  return (
    <Root {...rootProps}>
      <Trigger asChild>
        <button
          data-testid={TRIGGER_TEST_ID}
          className="relative rounded-full h-[35px] w-[35px] inline-flex items-center justify-center text-primary-900 bg-gray-300 cursor-pointer fill-gray-800
          dark:fill-gray-400 dark:bg-gray-700 focus:outline-none focus:[border:2px_solid_theme(colors.primary.500)] border-2 border-transparent"
          aria-label={props.triggerLabel}
        >
          {props.triggerIcon || <CirclesHorizontal />}
        </button>
      </Trigger>

      <Portal>
        <Content
          data-testid={CONTENT_TEST_ID}
          className="rounded-md py-2 px-1 min-w-[260px] bg-gray-200 dark:bg-gray-800  [box-shadow:hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_-5px_-10px_25px_-15px]
            duration-300 flex flex-col gap-1 text-gray-800 dark:text-gray-300 data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade
            data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade [border:1px_solid_theme(colors.gray.400)] dark:border-none"
          sideOffset={5}
          align="end"
          alignOffset={1}
          onCloseAutoFocus={event => event.preventDefault()}
        >
          <Arrow className="dark:fill-gray-800 fill-gray-400" />

          {props.children}
        </Content>
      </Portal>
    </Root>
  )
}
