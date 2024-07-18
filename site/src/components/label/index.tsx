import React from 'react'

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className="text-[0.74rem] text-gray-700 dark:text-gray-300 lg:text-[0.83rem]"
      {...props}
    />
  )
}
