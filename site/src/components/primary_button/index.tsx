import React from 'react'

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
      className={`cursor-pointer select-none rounded-full bg-gray-800 p-[2px_15px] font-ui text-[14px] text-gray-100 [border:2px_solid_transparent] [transition:border-color_250ms_ease-out_,_background_150ms_ease-out] hover:bg-gray-700 focus-visible:border-[2px] focus-visible:border-primary-500 focus-visible:outline-none dark:border-[1px] dark:border-gray-700`}
    />
  )
}
