import Link from 'next/link'

type Props = Omit<React.ComponentProps<typeof Link>, 'className'>

export const MenuItem = (props: Props) => {
  const linkProps = { ...props }

  if ('className' in linkProps) {
    delete linkProps.className
  }

  return (
    <li>
      <Link
        data-menu-item={true}
        className="text-2xl dark:text-gray-300 text-gray-800 font-bold tracking-wider decoration-transparent dark:focus-visible:text-white
        dark:hover:text-white dark:hover:decoration-white dark:focus-visible:decoration-white hover:text-primary-600 focus-visible:text-primary-600"
        {...linkProps}
      />
    </li>
  )
}
