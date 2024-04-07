import { Root, Item } from '@radix-ui/react-radio-group'

import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { getLocale } from '~/utils/get_locale'
import translate from '~/utils/translate'

const ThemeToggleItem = (props: { item: string; value: string }) => {
  const id = `theme-radio-item-${props.item}`

  return (
    <motion.div className="data-[checked=true]:bg-white text-center grid grid-cols-1 min-w-fit">
      <Item
        value={props.item}
        id={id}
        className="[grid-column-start:1] [grid-row-start:1] z-[0] focus:outline-none data-[state=checked]:bg-primary-500 rounded-full "
      />
      <label
        className="[grid-column-start:1] [grid-row-start:1] text-sm z-[1] px-2 py-0.5 pointer-events-none"
        htmlFor={id}
      >
        {props.value}
      </label>
    </motion.div>
  )
}

export const ThemeToggle = () => {
  const defaultValue = localStorage.getItem('theme') ?? 'system'
  const router = useRouter()
  const t = translate(getLocale(router.locale))

  return (
    <Root
      asChild
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className="flex rounded-full border-primary-500 border-[1px] max-w-max overflow-clip bg-gray-100 dark:bg-transparent"
    >
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 50,
          mass: 2
        }}
      >
        <ThemeToggleItem item="light" value={t('themeVariants', 'light')} />
        <ThemeToggleItem item="dark" value={t('themeVariants', 'dark')} />
        <ThemeToggleItem item="system" value={t('themeVariants', 'system')} />
      </motion.div>
    </Root>
  )
}

const onValueChange = (value: string) => {
  if (value === 'light') {
    window.__setPreferredTheme('light')
    return
  }

  if (value === 'dark') {
    window.__setPreferredTheme('dark')
    return
  }

  try {
    window.__setPreferredTheme()
    localStorage.removeItem('theme')
  } catch {}

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  window.document.documentElement.classList[prefersDark ? 'add' : 'remove'](
    'dark'
  )
}
