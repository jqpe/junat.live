import type { ComponentProps, ReactNode } from 'react'

import { PrimaryButton } from '~/components/buttons/primary'
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
      {/** TODO: https://tailwindcss.com/docs/backdrop-blur does not work here for some reason */}
      <DialogOverlay className="[backdrop-filter:blur(3px)]  fixed inset-0 bg-[hsla(0,0%,100%,0.87)] grid items-center animate-[fadein_150ms_cubic-bezier(0.16,1,0.3,1)] dark:bg-[hsla(0,0%,0%,0.87)]" />
      <DialogContent
        className={`bg-gray-100 rounded-xl shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]
        p-[25px] fixed top-[50%] left-[50%] [transformF:translate(-50%,_-50%)] overflow-clip w-[90vw] max-w-[450px] max-h-[85vh] overflow-y-auto
        animate-[dialog-content_150ms_cubic-bezier(0.16,_1,_0.3,_1)] dark:bg-gray-800 [&_>_[data-children]]:overflow-auto`}
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
