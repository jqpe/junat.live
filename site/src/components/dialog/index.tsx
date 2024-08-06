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
import { cx } from 'cva'

import Close from '@junat/ui/icons/close.svg'

import { Button } from '~/components/button'
import { useModalFix } from '~/components/dialog/modal_fix_hook'
import { useTranslations } from '~/i18n'

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
  props: Omit<ComponentProps<typeof Button<'button'>>, 'as'>,
) {
  return <Button {...props} as={DialogTrigger} />
}

export function Dialog({
  description,
  title,
  children,
  onOpenAutoFocus,
  fixModal,

  ...props
}: DialogProps) {
  const t = useTranslations()

  void useModalFix(fixModal)

  return (
    <DialogPortal {...props}>
      <DialogOverlay
        className={cx(
          'fixed inset-0 -top-header-height grid backdrop-blur-sm',
          'items-center bg-[hsla(0,0%,100%,0.87)] dark:bg-[hsla(0,0%,0%,0.87)]',
          'z-[2] animate-[fadein_150ms_cubic-bezier(0.16,1,0.3,1)]',
        )}
      />
      <DialogContent
        className={cx(
          'fixed left-[50%] top-[50%] z-[2] max-h-[85vh] w-[90vw] max-w-[450px]',
          '[transform:translate(-50%,_-50%)] dark:bg-gray-800 [&_>_[data-children]]:overflow-auto',
          'animate-[dialog-content_150ms_cubic-bezier(0.16,_1,_0.3,_1)]',
          'overflow-clip overflow-y-auto rounded-xl bg-gray-100 p-[25px]',
          'shadow-dialog',
        )}
        onOpenAutoFocus={onOpenAutoFocus}
      >
        <DialogTitle className="text-[1.21rem] text-gray-900 dark:text-gray-100 lg:text-[1.44rem]">
          {title}
        </DialogTitle>
        <DialogDescription className="m-[10px_0_20px] text-gray-700 dark:text-gray-500">
          {description}
        </DialogDescription>

        <div data-children>{children}</div>

        <DialogClose
          aria-label={t('close dialog')}
          className="absolute right-[10px] top-[10px] flex rounded-full"
        >
          <Close className="fill-gray-600" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  )
}
