import type { Locale } from '~/types/common'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { shallow } from 'zustand/shallow'

import { DialogTrigger } from '@radix-ui/react-dialog'
import {
  Arrow,
  CheckboxItem,
  Content,
  Item,
  Portal,
  Root,
  Trigger
} from '@radix-ui/react-dropdown-menu'

import React from 'react'

import CirclesHorizontal from '~/components/icons/circles_horizontal.svg'
import Filter from '~/components/icons/filter.svg'
import GoogleMaps from '~/components/icons/google_maps.svg'
import HeartFilled from '~/components/icons/heart_filled.svg'
import HeartOutline from '~/components/icons/heart_outline.svg'
import ToBottom from '~/components/icons/to_bottom.svg'
import ToTop from '~/components/icons/to_top.svg'
import Close from '~/components/icons/close.svg'

import { useFavorites } from '~/hooks/use_favorites'
import { useStationFilters } from '~/hooks/use_filters'
import { useStationPage } from '~/hooks/use_station_page'
import { useTimetableType } from '~/hooks/use_timetable_type'

import { googleMapsDirections } from '~/utils/services'
import translate from '~/utils/translate'

const DialogProvider = dynamic(() =>
  import('../dialog').then(mod => mod.DialogProvider)
)
const TrainsFilterDialog = dynamic(() =>
  import('./trains_filter_dialog').then(mod => mod.TrainsFilterDialog)
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
    state.actions.setType
  ])

  const favorites = useFavorites(
    state => ({
      add: state.addFavorite,
      remove: state.removeFavorite
    }),
    shallow
  )

  const isFavorite = useFavorites(state => {
    return state.isFavorite(props.currentStation)
  })

  const t = translate(props.locale)

  const currentShortCode = useStationPage(state => state.currentShortCode)
  const filters = useStationFilters(currentShortCode)
  const filtersActive = filters.destination !== null

  return (
    <Root>
      <DialogProvider open={open} onOpenChange={setOpen}>
        <Trigger asChild>
          <button
            data-testid={TRIGGER_BUTTON_TEST_ID}
            className="relative rounded-full h-[35px] w-[35px] inline-flex items-center justify-center text-primary-900 bg-gray-300 cursor-pointer fill-gray-800
          dark:fill-gray-400 dark:bg-gray-700 focus:outline-none focus:[border:2px_solid_theme(colors.primary.500)] border-2 border-transparent"
            aria-label="Customise options"
          >
            <CirclesHorizontal />
            {filtersActive && (
              <svg
                width={10}
                height={10}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -top-0.5 -right-0.5 fill-primary-600 [transform:translate(50%,-50%)] [transform-origin:100%_0%]"
              >
                <circle cx="50" cy="50" r="50" />
              </svg>
            )}
          </button>
        </Trigger>

        <Portal>
          <Content
            data-testid={CONTENT_TEST_ID}
            className="rounded-md py-2 px-1 min-w-[260px] bg-gray-200 dark:bg-gray-800  [box-shadow:hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_-5px_-10px_25px_-15px]
          duration-300 flex flex-col gap-1 text-gray-800 dark:text-gray-300 data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade
          data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade [border:1px_solid_theme(colors.gray.400)] dark:border-none"
            sideOffset={5}
            align="end"
            alignOffset={1}
            onCloseAutoFocus={event => event?.preventDefault()}
          >
            <Arrow className="dark:fill-gray-800 fill-gray-400" />

            <CheckboxItem
              data-testid={FAVOURITES_CHECKBOX_TEST_ID}
              className="group px-3 rounded-sm select-none transition-[background-color] duration-200 grid grid-cols-[1fr,24px]
            items-center cursor-pointer min-h-[35px] text-[13px] font-ui"
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
                <HeartOutline className="dark:fill-gray-600 fill-gray-400" />
              )}
            </CheckboxItem>

            <DialogTrigger>
              <Item
                className="group px-3 rounded-sm select-none transition-[background-color] duration-200 grid grid-cols-[1fr,24px]
           items-center cursor-pointer min-h-[35px] text-[13px] font-ui"
              >
                {t('filterTrains')}
                <Filter className="dark:fill-gray-600 fill-gray-400" />
              </Item>
            </DialogTrigger>

            {filtersActive && (
              <Item
                onClick={() => filters.setDestination('')}
                className="group px-3 rounded-sm select-none transition-[background-color] duration-200 grid grid-cols-[1fr,24px]
           items-center cursor-pointer min-h-[35px] text-[13px] font-ui"
              >
                {t('buttons', 'clearFilters')}
                <Close className="dark:fill-gray-600 fill-gray-400" />
              </Item>
            )}

            <CheckboxItem
              data-testid={TIMETABLE_TYPE_CHECKBOX_TEST_ID}
              className="group px-3 rounded-sm select-none transition-[background-color] duration-200 grid grid-cols-[1fr,24px]
                         items-center cursor-pointer min-h-[35px] text-[13px] font-ui"
              checked={type === 'ARRIVAL'}
              onCheckedChange={open => {
                setType(open ? 'ARRIVAL' : 'DEPARTURE')
              }}
            >
              {t(type === 'ARRIVAL' ? 'showDeparting' : 'showArriving')}
              {(type === 'ARRIVAL' ? ToTop : ToBottom)({
                className: 'dark:fill-gray-600 fill-gray-400'
              })}
            </CheckboxItem>

            <Item
              className="group px-3 rounded-sm select-none transition-[background-color] duration-200 grid grid-cols-[1fr,24px]
           items-center cursor-pointer min-h-[35px] text-[13px] font-ui"
            >
              <Link
                target="_blank"
                href={googleMapsDirections(props.long, props.lat)}
                className="decoration-transparent hover:text-gray-800 dark:text-gray-300 dark:hover:text-current "
              >
                {t('routeToStation')}
              </Link>
              <GoogleMaps className="w-[24px] h-[24px] aspect-[1]" />
            </Item>
          </Content>
        </Portal>
        <TrainsFilterDialog
          currentStation={props.currentStation}
          locale={props.locale}
          onSubmit={() => setOpen(false)}
        />
      </DialogProvider>
    </Root>
  )
}
