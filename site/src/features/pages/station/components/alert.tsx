import type { UnifiedAlert } from '@junat/react-hooks/use_alerts'

import React from 'react'
import { cx } from 'cva'
import { AnimatePresence, motion } from 'motion/react'

import { useAlerts } from '@junat/react-hooks/use_alerts'
import { usePeristedAlerts } from '@junat/react-hooks/use_persisted_alerts'
import Chevron from '@junat/ui/icons/chevron.svg'
import Close from '@junat/ui/icons/close.svg'

import { useLocale, useTranslations } from '~/i18n'

interface AlertProps {
  stationName: string
  stationShortCode: string
  onlyShowStationMessages?: boolean
}

const ICON_FILL = cx('fill-secondary-700 dark:fill-secondary-200')

const hasAlertUrl = (url: unknown): url is string => {
  if (typeof url !== 'string' || url === '') {
    return false
  }

  // e.g. https://hsl.fi/ (empty template)
  return URL.parse(url)?.pathname !== '/'
}

export const Alerts = React.memo(
  ({ stationName, stationShortCode }: AlertProps) => {
    const locale = useLocale()
    const [alertsOpen, setAlertsOpen] = React.useState(false)

    const alerts = useAlerts({
      stationShortCode,
      locale,
      stationName,
    })

    if (alerts.length === 0) {
      return null
    }

    return (
      <div
        className={cx(
          'mb-2 flex snap-x snap-mandatory overflow-x-scroll *:flex-shrink-0 *:flex-grow-0',
          'max-w-screen gap-2 [scrollbar-width:none] *:mt-0 *:basis-[95%] *:snap-start',
          '-mt-3 scroll-p-0.5 p-0.5 [&>*:only-child]:basis-[100%]',
        )}
      >
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            alert={alert}
            open={alertsOpen}
            onToggle={() => setAlertsOpen(!alertsOpen)}
          />
        ))}
      </div>
    )
  },
)

Alerts.displayName = 'Alerts'

const AnimatedChevron = motion.create<React.ReactSVGElement>(Chevron)

export const Alert = (props: {
  alert: UnifiedAlert
  open: boolean
  onToggle: () => void
}) => {
  const { alert, open, onToggle } = props
  const [hasFocus, setHasFocus] = React.useState(false)
  const [hidden, setHidden] = React.useState<false | string>(false)
  const hide = usePeristedAlerts(store => store.actions.hideAlert)

  const handleAlertHide = (alert: UnifiedAlert) => {
    setHidden(alert.id)
    hide(alert.id)
  }

  return (
    <motion.article
      animate={hidden ? { height: 0, padding: 0 } : {}}
      key={alert.id}
      className={cx(
        'flex rounded-md bg-secondaryA-300 p-1 text-secondary-700 shadow',
        'border dark:text-gray-500',
        hasFocus
          ? 'border-secondary-500 dark:border-grayA-700'
          : 'border-transparent',
      )}
    >
      <button
        onClick={onToggle}
        onBlur={() => setHasFocus(false)}
        onFocusCapture={() => setHasFocus(true)}
        aria-expanded={open}
        className="w-full overflow-hidden text-left text-sm leading-4"
      >
        <AlertHeader alert={alert} expanded={open} />
        <AlertContent visible={open} alert={alert} />
      </button>

      <AlertCloseButton onClose={() => handleAlertHide(alert)} />
    </motion.article>
  )
}

const AlertHeader = ({
  expanded,
  alert,
}: {
  alert: Pick<UnifiedAlert, 'headerText' | 'type'>
  expanded: boolean
}) => {
  return (
    <header className="flex select-none items-center gap-1">
      <AnimatedChevron
        animate={{ rotate: expanded ? 0 : 180 }}
        className={cx('h-3 w-3 flex-shrink-0', ICON_FILL)}
        aria-hidden="true"
      />

      <h5
        className={cx(
          'font-mono text-[.7rem] tracking-tight text-secondary-800',
          'line-clamp-2 overflow-ellipsis dark:text-secondary-200',
        )}
      >
        {alert.headerText}
      </h5>
    </header>
  )
}

const AlertContent = ({
  alert,
  visible,
}: {
  alert: Pick<UnifiedAlert, 'descriptionText' | 'url'>
  visible: boolean
}) => {
  const t = useTranslations()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="mt-1"
          initial={{ height: '0', translateY: -10 }}
          animate={{ height: 'auto', translateY: 0 }}
          exit={{ height: '0', translateY: 10, opacity: 0 }}
        >
          {alert.descriptionText}{' '}
          {hasAlertUrl(alert.url) && (
            <a
              className={cx(
                'text-secondary-700 hover:text-secondary-800',
                'focus-visible:text-secondary-800 dark:hover:text-secondary-200',
                'dark:text-secondary-300 dark:focus-visible:text-secondary-300',
                'focus-visible:outline',
              )}
              target="_blank"
              href={alert.url}
              rel="noopener noreferrer"
            >
              {t('readMore')}
            </a>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const AlertCloseButton = ({
  onClose,
}: {
  onClose: React.MouseEventHandler<HTMLButtonElement>
}) => {
  const t = useTranslations()

  return (
    <button
      className="ml-auto flex h-min rounded-full focus-visible:outline-offset-1"
      onClick={onClose}
      title={t('close')}
      aria-label={t('close')}
    >
      <Close className={ICON_FILL} aria-hidden="true" />
    </button>
  )
}
