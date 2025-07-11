import type { AlertFragment } from '@junat/graphql/digitransit'

import React from 'react'
import { cx } from 'cva'
import { AnimatePresence, motion } from 'motion/react'

import { useAlerts } from '@junat/react-hooks/digitransit/alerts'
import { usePeristedAlerts } from '@junat/react-hooks/use_persisted_alerts'
import Chevron from '@junat/ui/icons/chevron.svg'
import Close from '@junat/ui/icons/close.svg'

import { useLocale, useTranslations } from '~/i18n'

interface AlertProps {
  stationShortCode: string
}

const ICON_FILL = cx('fill-secondary-700 dark:fill-secondary-200')

const isAlertHidden = (opts: {
  hiddenAlerts: string[]
  id: string | null
  endDate: number | null
}) => {
  if (opts.id === null || opts.endDate === null) {
    return true
  }

  const isHidden = opts.hiddenAlerts.includes(opts.id)
  const isOld = new Date(opts.endDate * 1000).getTime() < Date.now()

  return isHidden || isOld
}

const hasAlertUrl = (url: unknown): url is string => {
  if (typeof url !== 'string' || url === '') {
    return false
  }

  // e.g. https://hsl.fi/ (empty template)
  return URL.parse(url)?.pathname !== '/'
}

export const Alerts = React.memo(({ stationShortCode }: AlertProps) => {
  const apiKey = process.env.NEXT_PUBLIC_DIGITRANSIT_KEY

  if (!apiKey) {
    throw new TypeError('NEXT_PUBLIC_DIGITRANSIT_KEY is required')
  }

  const locale = useLocale()

  const alertsQuery = useAlerts({
    station: stationShortCode,
    locale,
    apiKey,
  })

  const alertsStore = usePeristedAlerts()

  if (!alertsQuery.data) {
    return null
  }

  const alerts = alertsQuery.data

  if (
    alerts.length === 1 &&
    alerts[0] &&
    !isAlertHidden({
      id: alerts[0].id || null,
      endDate: alerts[0].effectiveEndDate || null,
      hiddenAlerts: alertsStore.alerts,
    })
  ) {
    return <Alert key={alerts[0].id} alert={alerts[0]} />
  }

  const Alerts = alerts.map(alert => {
    if (
      !alert ||
      isAlertHidden({
        id: alert?.id || null,
        endDate: alert?.effectiveEndDate || null,
        hiddenAlerts: alertsStore.alerts,
      })
    ) {
      return null
    }

    return <Alert key={alert.id} alert={alert} />
  })

  if (Alerts.length > 0) {
    return (
      <div
        className={cx(
          'flex snap-x snap-mandatory overflow-x-scroll *:flex-shrink-0 *:flex-grow-0',
          'max-w-screen gap-1 *:mt-0 *:basis-[95%] *:snap-start',
        )}
      >
        {Alerts}
      </div>
    )
  }
})

Alerts.displayName = 'Alerts'

const AnimatedChevron = motion.create<React.ReactSVGElement>(Chevron)

export const Alert = (props: { alert: AlertFragment }) => {
  const { alert } = props
  const [open, setOpen] = React.useState(false)
  const [hasFocus, setHasFocus] = React.useState(false)
  const [hidden, setHidden] = React.useState<false | string>(false)
  const alertsStore = usePeristedAlerts()

  const handleAlertHide = (alert: AlertFragment) => {
    if (alert.id) {
      setHidden(alert.id)

      alertsStore.actions.hideAlert(alert.id)
    }
  }

  return (
    <motion.article
      animate={hidden ? { height: 0, padding: 0 } : {}}
      key={alert.id}
      className={cx(
        'flex rounded-md bg-secondaryA-300 p-1 text-secondary-700 shadow md:mb-4',
        ' border dark:text-gray-500 ',
        hasFocus
          ? 'border-secondary-500 dark:border-grayA-700'
          : 'border-transparent',
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setHasFocus(false)}
        onFocusCapture={() => setHasFocus(true)}
        aria-expanded={open}
        className="w-full overflow-hidden text-left text-sm leading-4"
      >
        <AlertHeader alert={alert} expanded={open} />
        <AlertContent visible={open} alert={alert} />
      </button>

      <AlertCloseButton onClose={() => handleAlertHide(alert!)} />
    </motion.article>
  )
}

const AlertHeader = ({
  expanded,
  alert,
}: {
  alert: Pick<AlertFragment, 'alertHeaderText'>
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
          'dark:text-secondary-200',
        )}
      >
        {alert.alertHeaderText}
      </h5>
    </header>
  )
}

const AlertContent = ({
  alert,
  visible,
}: {
  alert: Pick<AlertFragment, 'alertDescriptionText' | 'alertUrl'>
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
          {alert.alertDescriptionText}{' '}
          {hasAlertUrl(alert.alertUrl) && (
            <a
              className={cx(
                'text-secondary-700 hover:text-secondary-800',
                'focus-visible:text-secondary-800 dark:hover:text-secondary-200',
                'dark:text-secondary-300 dark:focus-visible:text-secondary-300',
                'focus-visible:outline',
              )}
              target="_blank"
              href={alert.alertUrl}
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
