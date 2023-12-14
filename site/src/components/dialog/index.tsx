import type { ComponentProps, ReactNode } from 'react'

import { PrimaryButton } from '~/components/primary_button'
import Close from '~/components/icons/close.svg'

import {
  Root,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogOverlay
} from '@radix-ui/react-dialog'
import React from 'react'

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
  props: ComponentProps<typeof PrimaryButton<'button'>>
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
      <DialogOverlay className="[backdrop-filter:blur(3px)] z-[1] fixed inset-0 bg-[hsla(0,0%,100%,0.87)] grid items-center animate-[fadein_150ms_cubic-bezier(0.16,1,0.3,1)] dark:bg-[hsla(0,0%,0%,0.87)]" />
      <DialogContent
        className={`bg-gray-100 rounded-xl shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]
        p-[25px] fixed top-[50%] left-[50%] [transform:translate(-50%,_-50%)] overflow-clip w-[90vw] max-w-[450px] max-h-[85vh] overflow-y-auto
        animate-[dialog-content_150ms_cubic-bezier(0.16,_1,_0.3,_1)] dark:bg-gray-800 [&_>_[data-children]]:overflow-auto z-[1]`}
        onOpenAutoFocus={onOpenAutoFocus}
      >
        <DialogTitle className="text-gray-900 text-[1.21rem] lg:text-[1.44rem] dark:text-gray-100">
          {title}
        </DialogTitle>
        <DialogDescription className="m-[10px_0_20px] text-gray-700 dark:text-gray-500">
          {description}
        </DialogDescription>

        <div data-children>{children}</div>

        <DialogClose className="rounded-full flex absolute right-[10px] top-[10px] ">
          <Close className="fill-gray-600" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  )
}
