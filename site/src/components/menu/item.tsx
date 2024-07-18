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
        className="text-2xl font-bold tracking-wider text-gray-800 decoration-transparent hover:text-primary-600 focus-visible:text-primary-600 dark:text-gray-300 dark:hover:text-white dark:hover:decoration-white dark:focus-visible:text-white dark:focus-visible:decoration-white"
        {...linkProps}
      />
    </li>
  )
}
