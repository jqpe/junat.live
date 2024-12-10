import type { AlertFragment } from '@junat/graphql/digitransit'

import React from 'react'
import { cx } from 'cva'
import { AnimatePresence, motion } from 'framer-motion'

import { useAlerts } from '@junat/react-hooks/digitransit/alerts'
import { usePeristedAlerts } from '@junat/react-hooks/use_persisted_alerts'
import Chevron from '@junat/ui/icons/chevron.svg'
import Close from '@junat/ui/icons/close.svg'

import { useLocale, useTranslations } from '~/i18n'

interface AlertProps {
  stationShortCode: string
}

const isAlertHidden = (opts: {
  hiddenAlerts: string[]
  id: string
  endDate: number
}) => {
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

export const Alert = ({ stationShortCode }: AlertProps) => {
  const apiKey = process.env.NEXT_PUBLIC_DIGITRANSIT_KEY

  if (!apiKey) {
    throw new TypeError('NEXT_PUBLIC_DIGITRANSIT_KEY is required')
  }

  const t = useTranslations()
  const locale = useLocale()

  const iconFill = cx('fill-secondary-700 dark:fill-secondary-200')
  const [open, setOpen] = React.useState(false)
  const [hidden, setHidden] = React.useState<false | string>(false)

  const alertsQuery = useAlerts({
    station: stationShortCode,
    locale,
    apiKey,
  })

  const handleAlertHide = (alert: AlertFragment) => {
    if (alert.id) {
      setHidden(alert.id)

      alertsStore.actions.hideAlert(alert.id)
    }
  }
  const alertsStore = usePeristedAlerts()

  if (alertsQuery.data) {
    const alerts = alertsQuery.data

    return alerts.map(alert => {
      if (
        alert === null ||
        !alert.effectiveEndDate ||
        isAlertHidden({
          id: alert.id,
          endDate: alert.effectiveEndDate,
          hiddenAlerts: alertsStore.alerts,
        })
      ) {
        return
      }

      return (
        <motion.article
          animate={hidden ? { height: 0, padding: 0 } : {}}
          key={alert.alertHeaderText}
          className={cx(
            'flex flex-col rounded-sm bg-secondaryA-300 p-1 text-secondary-700 shadow',
            '-mt-3 mb-2 dark:border-secondaryA-600 dark:text-gray-500',
            'overflow-hidden md:-mt-6 md:mb-4',
          )}
        >
          <div className="flex" onClick={() => setOpen(!open)}>
            <div className="overflow-hidden text-sm leading-4">
              <div className="flex select-none items-center gap-1">
                <motion.div
                  animate={{ rotate: open ? 0 : 180 }}
                  className="flex"
                >
                  <Chevron className={cx('h-3 w-3', iconFill)} />
                </motion.div>

                <h5
                  className={cx(
                    'font-mono text-[.7rem] tracking-tight text-secondary-800',
                    'dark:text-secondary-200',
                  )}
                >
                  {alert.alertHeaderText}
                </h5>
              </div>

              <AnimatePresence>
                {open && (
                  <motion.div
                    className="mt-1"
                    initial={{ height: '0', translateY: -10 }}
                    animate={{ height: 'auto', translateY: 0 }}
                    exit={{ height: '0', translateY: 10, opacity: 0 }}
                  >
                    {alert.alertDescriptionText}{' '}
                    {hasAlertUrl(alert.alertUrl) && (
                      <a target="_blank" href={alert.alertUrl}>
                        {t('readMore')}
                      </a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className="ml-auto flex"
              onClick={() => handleAlertHide(alert!)}
              title={t('close')}
            >
              <Close className={iconFill} />
            </button>
          </div>
        </motion.article>
      )
    })
  }
}
