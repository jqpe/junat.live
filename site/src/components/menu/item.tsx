import Link from 'next/link'
import { PropsWithChildren } from 'react'

export const MenuItem = (props: PropsWithChildren<{ href: string }>) => {
  return (
    <li>
      <Link
        data-menu-item={true}
        className="text-2xl dark:text-gray-200 text-gray-800 font-bold tracking-wider decoration-transparent dark:hover:text-white hover:text-[#000]"
        href={props.href}
      >
        {props.children}
      </Link>
    </li>
  )
}
