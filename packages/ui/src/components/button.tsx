import type { VariantProps } from 'cva'
import type { ForwardRefComponent } from '../types/polymorphic'

import React from 'react'
import { cva, cx } from 'cva'

export interface ButtonProps extends VariantProps<typeof button> {
  children?: React.ReactNode | React.ReactNode[]
}

const button = cva({
  base: cx(
    'rounded-full bg-gray-800 p-[2px_15px] font-ui text-[14px]',
    '[transition:border-color_250ms_ease-out_,_background_150ms_ease-out]',
    'select-none text-gray-100 hover:bg-gray-700 focus-visible:border-[2px]',
    '[border:2px_solid_transparent] focus-visible:outline-none dark:border-gray-700',
    'focus-visible:border-primary-500 dark:border-[1px]',
  ),
  variants: {
    variant: {
      'secondary-accordion': cx(
        'bg-transparent p-[3px_8px] text-sm leading-4 text-gray-800',
        'hover:bg-grayA-200 dark:bg-transparent dark:hover:bg-grayA-200',
        'border-gray-200 dark:border-gray-800 dark:text-gray-200',
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
