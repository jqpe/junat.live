import type { ComponentProps, ReactNode } from 'react'

import React from 'react'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Root,
} from '@radix-ui/react-dialog'

import Close from '~/components/icons/close.svg'
import { PrimaryButton } from '~/components/primary_button'

export type DialogProps = ComponentProps<typeof DialogPortal> & {
  description: ReactNode | ReactNode[]
  title: ReactNode | ReactNode[]
  /**
   * If this dialog is used inside another modal (e.g. Dropdown) scrollbar is programmatically removed twice, which might lead to unintended layout shift.
   * Set to true to fix this behavior.
   */
  fixModal?: boolean
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

export function DialogButton(
  props: ComponentProps<typeof PrimaryButton<'button'>>,
) {
  return <PrimaryButton as={DialogTrigger} {...props} />
}

export function Dialog({
  description,
  title,
  children,
  onOpenAutoFocus,
  fixModal,

  ...props
}: DialogProps) {
  // JUN-227 — using two components which both use https://www.npmjs.com/package/react-remove-scroll causes
  // both to calculate removed scrollbar. Since the first one sets margin-right the other will instead apply to padding,
  // effectively offsetting body by --removed-body-scroll-bar-size
  React.useEffect(() => {
    if (!fixModal) return

    const body = document.querySelector('body')
    const margin = body?.style.getPropertyValue('margin-right')
    const padding = body?.style.getPropertyValue('padding-right')

    if (![margin, padding].includes(undefined) && padding === margin) {
      body?.style.setProperty('padding-right', '0px')
    }
  }, [fixModal])

  return (
    <DialogPortal {...props}>
      {/** TODO: https://tailwindcss.com/docs/backdrop-blur does not work here for some reason */}
      <DialogOverlay className="fixed inset-0 -top-[var(--header-height)] z-[2] grid animate-[fadein_150ms_cubic-bezier(0.16,1,0.3,1)] items-center bg-[hsla(0,0%,100%,0.87)] [backdrop-filter:blur(3px)] dark:bg-[hsla(0,0%,0%,0.87)]" />
      <DialogContent
        className={`fixed left-[50%] top-[50%] z-[2] max-h-[85vh] w-[90vw] max-w-[450px] animate-[dialog-content_150ms_cubic-bezier(0.16,_1,_0.3,_1)] overflow-clip overflow-y-auto rounded-xl bg-gray-100 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [transform:translate(-50%,_-50%)] dark:bg-gray-800 [&_>_[data-children]]:overflow-auto`}
        onOpenAutoFocus={onOpenAutoFocus}
      >
        <DialogTitle className="text-[1.21rem] text-gray-900 dark:text-gray-100 lg:text-[1.44rem]">
          {title}
        </DialogTitle>
        <DialogDescription className="m-[10px_0_20px] text-gray-700 dark:text-gray-500">
          {description}
        </DialogDescription>

        <div data-children>{children}</div>

        <DialogClose className="absolute right-[10px] top-[10px] flex rounded-full">
          <Close className="fill-gray-600" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  )
}
