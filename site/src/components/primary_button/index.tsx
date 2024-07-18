import React from 'react'
import { cx } from 'cva'

interface PrimaryButtonProps<T extends React.ElementType> {
  as?: T
  children?: React.ReactNode | React.ReactNode[]
  className?: never
}

export const PrimaryButton = <T extends React.ElementType = 'button'>({
  as,
  ...props
}: PrimaryButtonProps<T> & React.ComponentPropsWithRef<T>) => {
  const As = as ?? 'button'

  // @ts-expect-error className is typed as `never` but it's TypeScript so just yeet className if present.
  delete props.className

  return (
    <As
      {...props}
      className={cx(
        'cursor-pointer rounded-full bg-gray-800 p-[2px_15px] font-ui text-[14px]',
        '[transition:border-color_250ms_ease-out_,_background_150ms_ease-out]',
        'select-none text-gray-100 hover:bg-gray-700 focus-visible:border-[2px]',
        'focus-visible:outline-none[border:2px_solid_transparent] dark:border-gray-700',
        'focus-visible:border-primary-500 dark:border-[1px]',
      )}
    />
  )
}
