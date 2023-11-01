import type { Locale } from '~/types/common'

import Link from 'next/link'
import { shallow } from 'zustand/shallow'

import {
  Arrow,
  CheckboxItem,
  Content,
  Item,
  Portal,
  Root,
  Trigger
} from '@radix-ui/react-dropdown-menu'

import CirclesHorizontal from '~/components/icons/circles_horizontal.svg'
import GoogleMaps from '~/components/icons/google_maps.svg'
import HeartFilled from '~/components/icons/heart_filled.svg'
import HeartOutline from '~/components/icons/heart_outline.svg'

import { DialogTrigger } from '@radix-ui/react-dialog'
import { useFavorites } from '~/hooks/use_favorites'
import { googleMapsDirections } from '~/utils/services'
import translate from '~/utils/translate'
import { DialogProvider } from '../dialog'
import { FilterTrain } from './filter_train'

type StationShortCode = string

type StationDropdownMenuProps = {
  currentStation: StationShortCode
  locale: Locale
  long: number
  lat: number
}

export const CHECKBOX_ITEM_TEST_ID = 'favorites-checkbox-item' as const
export const TRIGGER_BUTTON_TEST_ID = 'trigger-button' as const

export const StationDropdownMenu = (props: StationDropdownMenuProps) => {
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

  return (
    <Root>
      <DialogProvider>
        <Trigger asChild>
          <button
            data-testid={TRIGGER_BUTTON_TEST_ID}
            className="rounded-full h-[35px] w-[35px] inline-flex items-center justify-center text-primary-900 bg-gray-300 cursor-pointer fill-gray-800
          dark:fill-gray-400 dark:bg-gray-700 focus:outline-none focus:[border:2px_solid_theme(colors.primary.500)]"
            aria-label="Customise options"
          >
            <CirclesHorizontal />
          </button>
        </Trigger>

        <Portal>
          <Content
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
              data-testid={CHECKBOX_ITEM_TEST_ID}
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
                Filter trains
              </Item>
            </DialogTrigger>

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
        <FilterTrain />
      </DialogProvider>
    </Root>
  )
}
