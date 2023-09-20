import * as P from '@radix-ui/react-popover'
import React, { ReactNode } from 'react'

import {
  CirclesHorizontal,
  Close,
  Flex,
  IconButton,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  Text
} from './styles'

type Props = {
  label: string
  children: ReactNode | ReactNode[]
  triggerLabel: string
  closeLabel: string
}

export const Popover = (props: Props) => {
  return (
    <P.Root>
      <P.Trigger asChild>
        <IconButton aria-label={props.triggerLabel}>
          <CirclesHorizontal />
        </IconButton>
      </P.Trigger>
      <P.Portal>
        <PopoverContent
          sideOffset={5}
          // Disables focus moving to trigger when closing popover
          onCloseAutoFocus={event => event.preventDefault()}
        >
          <Flex css={{ flexDirection: 'column', gap: 10 }}>
            <Text css={{ marginBottom: 10 }}>{props.label}</Text>
            {props.children}
          </Flex>
          <PopoverClose aria-label={props.closeLabel}>
            <Close />
          </PopoverClose>
          <PopoverArrow />
        </PopoverContent>
      </P.Portal>
    </P.Root>
  )
}
