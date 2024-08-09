import React from 'react'
import { cx } from 'cva'

export function FloatingActionButton<T extends React.ElementType = 'button'>(
  props: { as?: T } & React.ComponentPropsWithRef<T>,
) {
  const As = props.as ?? 'button'

  return (
    <As
      className={cx(
        'fixed bottom-[1rem] right-[1rem] flex cursor-pointer rounded-full p-[0.75rem]',
        'bg-primary-700 shadow-[2px_2px_30px_rgba(0,0,0,0.15)] lg:right-[calc(50%-300px)]',
      )}
      type="button"
      {...props}
    />
  )
}
