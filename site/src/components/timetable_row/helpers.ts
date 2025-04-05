import type { Variant } from 'motion/react'
import type { GetTranslatedValue } from '@junat/core/i18n'
import type { Code } from '@junat/core/utils/train'
import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'

import React from 'react'
import { To } from 'frominto'

import { getTrainType } from '@junat/core/utils/train'

type GetTrainLabelTrain = {
  commuterLineID?: string
  trainType: string
  trainNumber: number
}

/** If the train has a commuter line id, e.g. R-train, otherwise train number e.g. Train 3020 */
export const getTrainDescription = (
  train: { commuterLineID?: string; trainNumber: number; trainType?: string },
  t: GetTranslatedValue,
): string => {
  const maybeType = train.trainType
    ? getTrainType(train.trainType as Code, {
        train: t('train'),
        trainTypes: t('trainTypes'),
      })
    : undefined

  return train.commuterLineID
    ? `${train.commuterLineID}-${t('train')}`
    : `${maybeType || t('train')} ${train.trainNumber}`
}

/** If locale is Finnish return illative, e.g. Helsinki -> Helsinkiin */
export const getStationNameIllative = (
  locale: Locale,
  targetName: LocalizedStation | undefined,
): string | undefined => {
  return locale === 'fi' && targetName
    ? To(targetName.stationName.fi)
    : targetName?.stationName[locale]
}

export const getTrainLabel = (
  train: GetTrainLabelTrain,
  t: GetTranslatedValue,
): string => {
  if (train.commuterLineID) {
    return `${train.commuterLineID}-${t('train')}`
  }

  const type = getTrainType(train.trainType as Code, {
    train: t('train'),
    trainTypes: t('trainTypes'),
  })

  return `${type} ${train.trainNumber}`
}

/**
 * @param lastStationId A string that identifies a previous station (element.dataset.id)
 * @param onCalculateAnimation A callback that is called when the animation is known
 */
export const getPreviousStationAnimation = ({
  lastStationId,
  onCalculateAnimation,
}: {
  lastStationId: string
  onCalculateAnimation: (animation: Variant) => void
}) => {
  const hasScrolled = React.useRef(false)

  return (element: HTMLElement | null) => {
    const isLastStation = lastStationId === element?.dataset.id

    if (!element || !isLastStation || hasScrolled.current) {
      return
    }

    const style = getComputedStyle(element)
    const from = style.getPropertyValue('--tr-animation-from')
    const to = style.getPropertyValue('--tr-animation-to')

    const animation: Variant = {
      background: [from, to],
      transition: { duration: 0.5 },
      transitionEnd: { background: 'transparent' },
    }

    const rect = element.getBoundingClientRect()

    element.scrollIntoView({
      block: rect.top > window.innerHeight ? 'center' : 'end',
    })
    hasScrolled.current = true

    onCalculateAnimation(animation)
  }
}
