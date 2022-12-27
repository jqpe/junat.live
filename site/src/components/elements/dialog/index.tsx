import type { ComponentProps, ReactNode } from 'react'

import { PrimaryButton } from '~/components/buttons/primary'
import Close from './close.svg'

import { Root, DialogTrigger, DialogPortal } from '@radix-ui/react-dialog'

import {
  StyledClose,
  StyledDescription,
  StyledTitle,
  StyledOverlay,
  StyledContent
} from './styles'

export type DialogProps = ComponentProps<typeof DialogPortal> & {
  description: ReactNode | ReactNode[]
  title: ReactNode | ReactNode[]
}

export function DialogProvider(props: ComponentProps<typeof Root>) {
  return <Root {...props} />
}

export function DialogButton(props: ComponentProps<typeof PrimaryButton>) {
  return (
    <DialogTrigger asChild>
      <PrimaryButton size="xs" {...props} />
    </DialogTrigger>
  )
}

export function Dialog({
  description,
  title,
  children,
  ...props
}: DialogProps) {
  return (
    <DialogPortal {...props}>
      <StyledOverlay></StyledOverlay>
      <StyledContent>
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription>{description}</StyledDescription>

        <div data-children>{children}</div>

        <StyledClose>
          <Close />
        </StyledClose>
      </StyledContent>
    </DialogPortal>
  )
}
