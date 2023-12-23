import type { Locale } from '~/types/common'

import { getStationPath, type LocalizedStation } from '~/lib/digitraffic'

import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import { Dialog, DialogProvider } from '~/components/dialog'
import Close from '~/components/icons/close.svg'
import { PrimaryButton } from '~/components/primary_button'

import { useRouter } from 'next/router'
import { getNearbyStations, useGeolocation } from '~/features/geolocation'
import { NotificationPortal } from '~/features/notification-portal'

type NearbyStationsProps = {
  stations: LocalizedStation[]
  omitStation?: string
}

export const NearbyStations = (props: NearbyStationsProps) => {
  const { stations, omitStation } = props
  const [nearbyStationsCount, setNearbyStationsCount] = React.useState(5)
  const [open, setOpen] = React.useState(false)
  const [closedByUser, setClosedByUser] = React.useState(false)
  const { locale } = useRouter()

  const { latestPosition } = useGeolocation({
    locale: 'en',
    setStations: () => null
  })

  if (!latestPosition) {
    return null
  }

  const nearbyStations = [
    getNearbyStations(latestPosition, {
      stations,
      ignorePoorAccuracy: true
    })
  ].flat()

  const renderedStations = nearbyStations
    .filter(nearby => {
      if (nearby.stationShortCode === omitStation) {
        return false
      }

      if ('passengerTraffic' in nearby) {
        return nearby.passengerTraffic
      }

      return true
    })
    .slice(0, nearbyStationsCount)


  return (
    <AnimatePresence>
      {renderedStations.length > 0 && !closedByUser ? (
        <NotificationPortal>
          <motion.div
            initial={{ translateY: -20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ opacity: 0, translateY: -20 }}
            className="h-full bg-primary-600 text-primary-200 px-[30px] mb-2  flex justify-between"
          >
            <button onClick={() => setOpen(true)} className='cursor-pointer'>
              Wrong station? Change here.
            </button>
            <button
              onClick={() => setClosedByUser(true)}
              className="flex items-center fill-gray-800 cursor-pointer"
            >
              <Close />
            </button>
          </motion.div>
          <DialogProvider open={open} onOpenChange={setOpen}>
            <Dialog
              title="Relevant stations"
              description={
                <span>
                  Other stations near your location. Your position accuracy for
                  the latest query was {latestPosition.coords.accuracy} meters
                  and may have affected which station you got navigated to.
                </span>
              }
            >
              <div className="flex flex-col items-start">
                <div className="flex-1 flex flex-col gap-1">
                  {renderedStations.map(station => (
                    <a
                      key={station.stationShortCode}
                      href={getStationPath(
                        station.stationName[locale as Locale]
                      )}
                    >
                      {station.stationName[locale as Locale]}
                    </a>
                  ))}
                </div>
                <PrimaryButton
                  className="self-end"
                  onClick={() => setNearbyStationsCount(current => current + 5)}
                >
                  Load more
                </PrimaryButton>
              </div>
            </Dialog>
          </DialogProvider>
        </NotificationPortal>
      ) : null}
    </AnimatePresence>
  )
}
