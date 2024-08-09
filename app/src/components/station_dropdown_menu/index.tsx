import type { Locale } from '~/types/common'

import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { cx } from 'cva'
import { shallow } from 'zustand/shallow'

import {
  CheckboxItem,
  DropdownMenu,
  Item,
} from '@junat/ui/components/dropdown_menu'
import CirclesHorizontal from '@junat/ui/icons/circles_horizontal.svg'
import Close from '@junat/ui/icons/close.svg'
import Filter from '@junat/ui/icons/filter.svg'
import GoogleMaps from '@junat/ui/icons/google_maps.svg'
import HeartFilled from '@junat/ui/icons/heart_filled.svg'
import HeartOutline from '@junat/ui/icons/heart_outline.svg'
import ToBottom from '@junat/ui/icons/to_bottom.svg'
import ToTop from '@junat/ui/icons/to_top.svg'

import { useFavorites } from '~/hooks/use_favorites'
import { useStationFilters } from '~/hooks/use_filters'
import { useStationPage } from '~/hooks/use_station_page'
import { useTimetableType } from '~/hooks/use_timetable_type'
import { translate } from '~/i18n'
import { googleMapsDirections } from '~/services'

const DialogProvider = dynamic(() =>
  import('@junat/ui/components/dialog').then(mod => mod.DialogProvider),
)
const TrainsFilterDialog = dynamic(() =>
  import('./trains_filter_dialog').then(mod => mod.TrainsFilterDialog),
)

type StationShortCode = string

type StationDropdownMenuProps = {
  currentStation: StationShortCode
  locale: Locale
  long: number
  lat: number
}

export const FAVOURITES_CHECKBOX_TEST_ID = 'favorites-checkbox-item' as const
export const TIMETABLE_TYPE_CHECKBOX_TEST_ID = 'filters-checkbox-item' as const
export const TRIGGER_BUTTON_TEST_ID = 'trigger-button' as const
export const CONTENT_TEST_ID = 'station-dropdown-menu' as const

export const StationDropdownMenu = (props: StationDropdownMenuProps) => {
  const [open, setOpen] = React.useState(false)
  const [type, setType] = useTimetableType(state => [
    state.type,
    state.actions.setType,
  ])

  const favorites = useFavorites(
    state => ({
      add: state.addFavorite,
      remove: state.removeFavorite,
    }),
    shallow,
  )

  const isFavorite = useFavorites(state => {
    return state.isFavorite(props.currentStation)
  })

  const t = translate(props.locale)

  const currentShortCode = useStationPage(state => state.currentShortCode)
  const filters = useStationFilters(currentShortCode)
  const filtersActive = filters.destination !== null

  return (
    <DialogProvider open={open} onOpenChange={setOpen}>
      <DropdownMenu
        triggerLabel={t('changeOptions')}
        triggerIcon={
          <>
            <CirclesHorizontal />
            {filtersActive && (
              <svg
                width={10}
                height={10}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className={cx(
                  'absolute -right-0.5 -top-0.5 fill-primary-600',
                  '[transform-origin:100%_0%] [transform:translate(50%,-50%)]',
                )}
              >
                <circle cx="50" cy="50" r="50" />
              </svg>
            )}
          </>
        }
      >
        <CheckboxItem
          data-testid={FAVOURITES_CHECKBOX_TEST_ID}
          // Prevents the menu from closing
          onSelect={event => event.preventDefault()}
          checked={isFavorite}
          onCheckedChange={() => {
            favorites[isFavorite ? 'remove' : 'add'](props.currentStation)
          }}
        >
          {isFavorite
            ? t('removeStationFromFavorites')
            : t('addStationToFavorites')}
          {isFavorite ? (
            <HeartFilled className="fill-primary-500" />
          ) : (
            <HeartOutline className="fill-gray-400 dark:fill-gray-600" />
          )}
        </CheckboxItem>

        <DialogTrigger>
          <Item>
            {t('filterTrains')}
            <Filter className="fill-gray-400 dark:fill-gray-600" />
          </Item>
        </DialogTrigger>

        {filtersActive && (
          <Item onClick={() => filters.setDestination('')}>
            {t('buttons.clearFilters')}
            <Close className="fill-gray-400 dark:fill-gray-600" />
          </Item>
        )}

        <CheckboxItem
          data-testid={TIMETABLE_TYPE_CHECKBOX_TEST_ID}
          checked={type === 'ARRIVAL'}
          onCheckedChange={open => {
            setType(open ? 'ARRIVAL' : 'DEPARTURE')
          }}
        >
          {t(type === 'ARRIVAL' ? 'showDeparting' : 'showArriving')}
          {(type === 'ARRIVAL' ? ToTop : ToBottom)({
            className: 'dark:fill-gray-600 fill-gray-400',
          })}
        </CheckboxItem>

        <Item>
          <Link
            target="_blank"
            href={googleMapsDirections(props.long, props.lat)}
            className={cx(
              'dark:hover:text-current decoration-transparent',
              'hover:text-gray-800 dark:text-gray-300',
            )}
          >
            {t('routeToStation')}
          </Link>
          <GoogleMaps className="aspect-[1] h-[24px] w-[24px]" />
        </Item>
      </DropdownMenu>

      <TrainsFilterDialog
        currentStation={props.currentStation}
        locale={props.locale}
        onSubmit={() => setOpen(false)}
      />
    </DialogProvider>
  )
}
