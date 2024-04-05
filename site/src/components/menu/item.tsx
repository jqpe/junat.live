import Link from 'next/link'
import { PropsWithChildren } from 'react'

export const MenuItem = (props: PropsWithChildren<{ href: string }>) => {
  return (
    <li>
      <Link
        data-menu-item={true}
        className="text-2xl dark:text-gray-300 text-gray-800 font-bold tracking-wider decoration-transparent dark:focus:text-white
        dark:hover:text-white dark:hover:decoration-white hover:text-primary-600 focus:text-primary-600"
        href={props.href}
      >
        {props.children}
      </Link>
    </li>
  )
}
