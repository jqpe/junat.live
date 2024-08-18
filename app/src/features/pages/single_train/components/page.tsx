import React from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'

import { interpolateString as i } from '@junat/core/i18n'
import { DialogProvider } from '@junat/ui/components/dialog'
import {
  CheckboxItem,
  DropdownMenu,
  Item,
  itemIcon,
} from '@junat/ui/components/dropdown_menu/index'
import { Header } from '@junat/ui/components/header'
import Calendar from '@junat/ui/icons/calendar.svg?react'
import CirclesHorizontal from '@junat/ui/icons/circles_horizontal.svg?react'
import ObjectHorizontalLeft from '@junat/ui/icons/object_horizontal_left.svg?react'

import { ErrorMessageWithRetry } from '~/components/error_message'
import { Head } from '~/components/head'
import { Spinner } from '~/components/spinner'
import { useToast } from '~/components/toast'
import { translate, useI18nStore, useTranslations } from '~/i18n'
import { getNewTrainPath, getTrainTitle } from '../helpers'
import { useBestTrain } from '../hooks'
import { BlankState } from './blank_state'
import { RelativeDepartureDate } from './relative_departure_date'

const { DatePickerDialog } = await import('./date_picker_dialog')

const { SingleTimetable } = await import('~/components/single_timetable')

export function TrainPage() {
  const params = useParams({
    from: '/_layout/train/$departureDate/$trainNumber',
  })
  const navigate = useNavigate()

  const departureDate = params.departureDate as string

  const trainNumber = params.trainNumber
    ? Number(params.trainNumber)
    : undefined

  const { train, singleTrainQuery } = useBestTrain(departureDate, trainNumber)
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)
  const [showTrack, setShowTrack] = React.useState(false)
  const toast = useToast(state => state.toast)

  const locale = useI18nStore(state => state.locale)
  const t = useTranslations()

  const { trainType, trainTitle } = getTrainTitle(train, t)

  if (singleTrainQuery.isFetched && !train) {
    return <BlankState />
  }

  if (!(trainNumber && trainTitle && departureDate)) {
    return <Spinner variant="fixedToCenter" />
  }

  // If there is a train displayed to user and the query that caused an error is `singleTrainQuery`
  // don't show the error. Train and error can exist at the same time if using a cached train
  // and `singleTrainQuery` failed, or the error was caused by refetch (eg. stale data).
  const showError = singleTrainQuery.isError && !train

  const handleChoice = (newDepartureDate: string) => {
    const path = getNewTrainPath({
      newDepartureDate,
      oldDepartureDate: departureDate,
      path: location.pathname,
      trainNumber,
    })

    if (path) {
      navigate({ to: path })
    }
  }

  return (
    <>
      <Head
        title={trainTitle ?? ''}
        description={i(
          t('trainPage.meta.description { trainType } { trainNumber }'),
          {
            trainType,
            trainNumber,
          },
        )}
        path={location.pathname}
        locale={locale}
        replace={translate('all')('routes')}
      />
      <main>
        <Header heading={trainTitle ?? ''} />

        <div className="mb-9 flex items-center justify-between">
          <RelativeDepartureDate departureDate={departureDate} />
          <DropdownMenu
            // FIXME: disable modal for now as Radix fails to
            // cleanup `pointer-events: none` on body element
            modal={false}
            triggerIcon={<CirclesHorizontal />}
            triggerLabel="Change options"
          >
            <Item onClick={() => setDialogIsOpen(true)}>
              {t('chooseDate')}
              <Calendar className={itemIcon.className} />
            </Item>

            <CheckboxItem
              onClick={event => {
                // prevent menu from closing
                event.preventDefault()

                setShowTrack(!showTrack)
              }}
            >
              {showTrack ? t('hideTracks') : t('showTracks')}
              <ObjectHorizontalLeft className={itemIcon.className} />
            </CheckboxItem>
          </DropdownMenu>
        </div>

        <DialogProvider open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DatePickerDialog
            departureDate={departureDate}
            locale={locale}
            onOpenChange={setDialogIsOpen}
            handleChoice={handleChoice}
          />
        </DialogProvider>

        {showError && (
          <ErrorMessageWithRetry
            error={singleTrainQuery.error}
            locale={locale}
            onRetryButtonClicked={() => singleTrainQuery.refetch()}
          />
        )}

        {train && (
          <SingleTimetable
            showTrack={showTrack}
            timetableRows={train.timeTableRows}
          />
        )}
      </main>
    </>
  )
}
