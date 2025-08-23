import type { VariantProps } from 'cva'

import { cva } from 'cva'

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinner> {}

const spinner = cva({
  base: 'spinner',
  variants: {
    variant: {
      fixedToCenter: 'fixed left-1/2 top-1/2',
    },
  },
})

export const Spinner = (props: SpinnerProps) => {
  return (
    <div
      {...props}
      className={spinner({
        variant: props.variant,
        className: props.className,
      })}
    />
  )
}
