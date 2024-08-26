import type { VariantProps } from 'cva'
import type { ForwardRefComponent } from '../types/polymorphic'

import React from 'react'
import { cva, cx } from 'cva'

export interface ButtonProps extends VariantProps<typeof button> {
  children?: React.ReactNode | React.ReactNode[]
}

const button = cva({
  base: cx(
    'cursor-pointer rounded-full bg-gray-800 p-[2px_15px] font-ui text-[14px]',
    '[transition:border-color_250ms_ease-out_,_background_150ms_ease-out]',
    'select-none text-gray-100 hover:bg-gray-700 focus-visible:border-[2px]',
    '[border:2px_solid_transparent] focus-visible:outline-none dark:border-gray-700',
    'focus-visible:border-primary-500 dark:border-[1px]',
  ),
  variants: {
    variant: {
      'notification-badge': cx(
        'mr-auto bg-secondary-200 hover:bg-secondary-300 focus-visible:border-secondary-500',
        'dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-100',
        'text-secondary-600 dark:focus-visible:border-secondary-500',
        'dark:hover:bg-secondary-700',
      ),
    },
  },
})

export const Button = React.forwardRef(function Button(
  { as: As = 'button', ...props },
  ref,
) {
  return (
    <As
      {...props}
      ref={ref}
      className={button({ variant: props.variant, className: props.className })}
    />
  )
}) as ForwardRefComponent<'button', ButtonProps>
