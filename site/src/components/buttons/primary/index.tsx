import React from 'react'

interface PrimaryButtonProps<T extends React.ElementType> {
  as?: T
  children?: React.ReactNode | React.ReactNode[]
}

export const PrimaryButton = <T extends React.ElementType = 'button'>({
  as,
  ...props
}: PrimaryButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PrimaryButtonProps<T>>) => {
  const As = as ?? 'button'

  return (
    <As
      {...props}
      className={`rounded-full [border:2px_solid_transparent] bg-gray-800 text-gray-100 select-none cursor-pointer
    [transition:border-color_250ms_ease-out_,_background_150ms_ease-out] focus:outline-none focus:border-[2px] focus:border-primary-500
    text-[14px] p-[2px_15px] font-ui hover:bg-gray-700 ${props.className}
    `}
    />
  )
}
