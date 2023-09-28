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
  /**
   * In some cases the autofocus can lead to confusing user experience.
   *
   * @example
   * ```tsx
   * <Dialog onOpenAutoFocus={event => event.preventDefault()} />
   * ```
   */
  onOpenAutoFocus?: (event: Event) => unknown
}

export function DialogProvider(props: ComponentProps<typeof Root>) {
  return <Root {...props} />
}

export function DialogButton(props: ComponentProps<typeof PrimaryButton>) {
  return <PrimaryButton as={DialogTrigger} {...props} />
}

export function Dialog({
  description,
  title,
  children,
  onOpenAutoFocus,

  ...props
}: DialogProps) {
  return (
    <DialogPortal {...props}>
      <StyledOverlay></StyledOverlay>
      <StyledContent onOpenAutoFocus={onOpenAutoFocus}>
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
