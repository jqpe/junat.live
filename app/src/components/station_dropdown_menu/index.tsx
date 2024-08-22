import type { Locale } from '~/types/common'

import React from 'react'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { cx } from 'cva'
import { shallow } from 'zustand/shallow'

import {
  useFavorites,
  useStationFilters,
  useStationPage,
  useTimetableType,
} from '@junat/react-hooks'
import {
  CheckboxItem,
  DropdownMenu,
  Item,
} from '@junat/ui/components/dropdown_menu/index'
import CirclesHorizontal from '@junat/ui/icons/circles_horizontal.svg?react'
import Close from '@junat/ui/icons/close.svg?react'
import Filter from '@junat/ui/icons/filter.svg?react'
import HeartFilled from '@junat/ui/icons/heart_filled.svg?react'
import HeartOutline from '@junat/ui/icons/heart_outline.svg?react'
import ToBottom from '@junat/ui/icons/to_bottom.svg?react'
import ToTop from '@junat/ui/icons/to_top.svg?react'

import { translate } from '~/i18n'

const { DialogProvider } = await import('@junat/ui/components/dialog')
const { TrainsFilterDialog } = await import('./trains_filter_dialog')

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
      </DropdownMenu>

      <TrainsFilterDialog
        currentStation={props.currentStation}
        locale={props.locale}
        onSubmit={() => setOpen(false)}
      />
    </DialogProvider>
  )
}
