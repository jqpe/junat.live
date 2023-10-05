import type { PropsWithChildren } from 'react'
import React from 'react'

interface PrimaryButtonProps
  extends PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> {
  as?: React.ElementType
}

export const PrimaryButton = (props: PrimaryButtonProps) => {
  const As = props.as ?? 'button'

  return (
    <As
      className={`rounded-full [border:2px_solid_transparent] bg-gray-800 text-gray-100 select-none cursor-pointer
      [transition:border-color_250ms_ease-out_,_background_150ms_ease-out] focus:outline-none focus:border-[2px] focus:border-primary-500
      text-[14px] p-[2px_15px] font-ui hover:bg-gray-700
      `}
      {...props}
    />
  )
}
