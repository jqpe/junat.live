import type { NotificationProps as MantineNotificationProps } from '@mantine/notifications'
import { showNotification as mantineNotification } from '@mantine/notifications'

interface NotificationProps extends MantineNotificationProps {
  colorScheme: 'dark' | 'light'
}

/**
 * Calls `showNotication` from `@mantine/notifications` with default styles.
 */
export const showNotification = ({
  title,
  message,
  colorScheme,
  ...all
}: NotificationProps) => {
  mantineNotification({
    ...all,
    title,
    message,
    styles(theme) {
      const color =
        theme.colors.slateGray[colorScheme === 'light' ? 2 : 8].match(
          /[^hsl())]*(?=\))/
        )
      const hsla = `hsla(${color}, 0.8)`

      return {
        root: {
          backdropFilter: 'blur(3px)',
          border: 'none',
          backgroundColor: hsla,
          '&::before': { backgroundColor: theme.colors.red[5] }
        },
        title: {
          color: theme.colors.slateGray[colorScheme === 'light' ? 8 : 2]
        }
      }
    }
  })
}
