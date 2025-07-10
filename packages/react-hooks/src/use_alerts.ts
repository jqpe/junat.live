import type { PassengerInformationMessage } from '@junat/digitraffic/types'
import type { AlertFragment } from '@junat/graphql/digitransit'

import React from 'react'

import {
  satisfiesDeliveryRules,
  shouldShowInformationMessage,
} from '@junat/digitraffic'

import { useAlerts as useDigitrafficAlerts } from './digitraffic/use_alerts'
import { useAlerts as useDigitransitAlerts } from './digitransit/use_alerts'
import { usePeristedAlerts } from './use_persisted_alerts'

interface UseAlertsProps {
  stationName: string
  stationShortCode: string
  locale: string
  apiKey?: string
}

export const useAlerts = (props: UseAlertsProps) => {
  const { locale, stationName, stationShortCode } = props
  const apiKey = props.apiKey ?? process.env.NEXT_PUBLIC_DIGITRANSIT_KEY

  if (!apiKey) {
    throw new TypeError('NEXT_PUBLIC_DIGITRANSIT_KEY (or prop) is required')
  }

  const digitransitAlertsQuery = useDigitransitAlerts({
    station: stationName,
    locale,
    apiKey,
  })

  const passengerInfoQuery = useDigitrafficAlerts({
    stationShortCode,
  })

  const alertsStore = usePeristedAlerts()

  const allAlerts = React.useMemo((): UnifiedAlert[] => {
    const alerts: UnifiedAlert[] = []

    if (digitransitAlertsQuery.data) {
      alerts.push(
        ...digitransitAlertsQuery.data
          .filter(Boolean)
          .map(alert => transformDigitransitAlert(alert!)),
      )
    }

    if (passengerInfoQuery.data) {
      alerts.push(
        ...passengerInfoQuery.data
          .filter(Boolean)
          .map(msg => transformDigitrafficAlert(msg, locale)),
      )
    }

    return alerts.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (b.priority || 0) - (a.priority || 0)
      }
      return (b.startDate || 0) - (a.startDate || 0)
    })
  }, [digitransitAlertsQuery.data, passengerInfoQuery.data, locale])

  const visibleAlerts = allAlerts.filter(alert => {
    const isHidden = isAlertHidden({
      endDate: alert.effectiveEndDate!,
      hiddenAlerts: alertsStore.alerts,
      id: alert.id,
    })

    const showPassengerMessage =
      alert.type === 'digitraffic'
        ? shouldShowPassengerMessage(
            alert.original as PassengerInformationMessage,
          )
        : true

    return !isHidden && showPassengerMessage
  })

  return visibleAlerts
}

export interface UnifiedAlert {
  id: string
  type: 'digitransit' | 'digitraffic'
  headerText: string
  descriptionText: string
  url?: string
  effectiveEndDate?: number
  startDate?: number
  priority?: number
  original: AlertFragment | PassengerInformationMessage
}

export const transformDigitransitAlert = (
  alert: AlertFragment,
): UnifiedAlert => ({
  id: alert.id || '',
  type: 'digitransit',
  headerText: alert.alertHeaderText || '',
  descriptionText: alert.alertDescriptionText || '',
  url: alert.alertUrl || undefined,
  effectiveEndDate: alert.effectiveEndDate || undefined,
  priority: 1,
  original: alert,
})

export const transformDigitrafficAlert = (
  message: PassengerInformationMessage,
  locale: string = 'fi',
): UnifiedAlert => {
  const videoText = message.video?.text
  const audioText = message.audio?.text

  const text = videoText || audioText
  const localizedText =
    text?.[locale as keyof typeof text] ||
    text?.fi ||
    text?.en ||
    text?.sv ||
    ''

  return {
    id: message.id,
    type: 'digitraffic',
    headerText: localizedText,
    descriptionText: localizedText,
    effectiveEndDate: new Date(message.endValidity).getTime(),
    startDate: new Date(message.startValidity).getTime(),
    priority: 2,
    original: message,
  }
}

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

const shouldShowPassengerMessage = (
  message: PassengerInformationMessage,
  onlyShowStationMessages = true,
): boolean => {
  if (!shouldShowInformationMessage(message, onlyShowStationMessages)) {
    return false
  }

  if (
    message.video?.deliveryRules &&
    !satisfiesDeliveryRules(message.video.deliveryRules)
  ) {
    return false
  }

  return !(
    message.audio?.deliveryRules &&
    !satisfiesDeliveryRules(message.audio.deliveryRules)
  )
}
