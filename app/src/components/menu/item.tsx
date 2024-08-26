import { Link } from '@tanstack/react-router'
import { cx } from 'cva'

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
        className={cx(
          'text-2xl tracking-wider dark:text-gray-300 dark:hover:decoration-white',
          'text-gray-800 decoration-transparent hover:text-primary-600',
          'font-bold focus-visible:text-primary-600 dark:hover:text-white',
          'dark:focus-visible:text-white dark:focus-visible:decoration-white',
        )}
        {...linkProps}
      />
    </li>
  )
}
