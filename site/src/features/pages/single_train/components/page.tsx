import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { cva, cx } from 'cva'

import { interpolateString as i } from '@junat/core/i18n'
import { DialogProvider } from '@junat/ui/components/dialog'
import {
  CheckboxItem,
  DropdownMenu,
  Item,
  itemIcon,
} from '@junat/ui/components/dropdown_menu/index'
import { Header } from '@junat/ui/components/header'
import { useToast } from '@junat/ui/components/toast/index'
import Calendar from '@junat/ui/icons/calendar.svg'
import ChevronDown from '@junat/ui/icons/chevron_down.svg'
import ChevronUp from '@junat/ui/icons/chevron_up.svg'
import CirclesHorizontal from '@junat/ui/icons/circles_horizontal.svg'
import ObjectHorizontalLeft from '@junat/ui/icons/object_horizontal_left.svg'
import Share from '@junat/ui/icons/share.svg'

import { ErrorMessageWithRetry } from '~/components/error_message'
import { Head } from '~/components/head'
import { Spinner } from '~/components/spinner'
import { translate, useLocale, useTranslations } from '~/i18n'
import { getNewTrainPath, getTrainTitle, handleShare } from '../helpers'
import { useBestTrain } from '../hooks'
import { BlankState } from './blank_state'
import { RelativeDepartureDate } from './relative_departure_date'

const DatePickerDialog = dynamic(() =>
  import('./date_picker_dialog').then(mod => mod.DatePickerDialog),
)

const SingleTimetable = dynamic(() => import('~/components/single_timetable'))
const Map = dynamic(() => import('./map'), { ssr: false })

const content = cva({
  base: cx(
    'fixed bottom-0 z-0 min-w-sm max-w-lg bg-gray-100',
    'w-full rounded-t-xl px-4 pt-4 md:rounded-tl-none',
    'pb-4 shadow dark:bg-gray-900',
  ),
  variants: {
    collapsed: {
      true: cx(''),
      false: cx('md:top-20 md:h-screen'),
    },
  },
})

export function TrainPage() {
  const router = useRouter()

  const departureDate = router.query.date as string

  const trainNumber = router.query.trainNumber
    ? Number(router.query.trainNumber)
    : undefined

  const { train, singleTrainQuery } = useBestTrain(departureDate, trainNumber)
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)
  const [showTrack, setShowTrack] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  const toast = useToast(state => state.toast)

  const locale = useLocale()
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

  const supportsShareApi =
    typeof window !== 'undefined' && 'share' in (window.navigator ?? {})

  const handleChoice = (newDepartureDate: string) => {
    const path = getNewTrainPath({
      newDepartureDate,
      oldDepartureDate: departureDate,
      path: router.asPath,
      trainNumber,
    })

    if (path) {
      router.push(path, undefined, { shallow: false, scroll: true })
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
        path={router.asPath}
        locale={locale}
        replace={translate('all')('routes')}
      />

      <main className={content({ collapsed })}>
        <div className="relative">
          <Header heading={trainTitle ?? ''} />
          <div className="absolute inset-y-0 right-0 top-0 flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={cx(
                'flex items-center rounded-full border border-gray-300',
                'h-[35px] w-[35px] cursor-pointer justify-center dark:border-gray-800',
              )}
            >
              {collapsed ? (
                <ChevronUp className="fill-gray-900 dark:fill-gray-100" />
              ) : (
                <ChevronDown className="fill-gray-900 dark:fill-gray-100" />
              )}
            </button>
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

              {supportsShareApi && (
                <Item
                  onClick={event => {
                    handleShare(event, {
                      title: trainTitle,
                      text: i(t('timetablesFor { train }'), {
                        train: `${trainType} ${trainNumber}`,
                      }),
                      url: location.href,
                    }).catch(() => toast(t('errors.shareError')))
                  }}
                >
                  {t('shareTrain')}
                  <Share className={itemIcon.className} />
                </Item>
              )}
            </DropdownMenu>
          </div>
        </div>

        {!collapsed && (
          <div className="mb-9 flex items-center justify-between">
            <RelativeDepartureDate departureDate={departureDate} />
          </div>
        )}

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

        {train && !collapsed && (
          <SingleTimetable
            showTrack={showTrack}
            timetableRows={train.timeTableRows}
          />
        )}
      </main>
      <div className="fixed inset-0 -z-10">
        <Map train={train} />
      </div>
    </>
  )
}
