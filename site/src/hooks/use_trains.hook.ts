import type { GetTrainsOptions, Train } from '~digitraffic'
import type { MutableRefObject } from 'react'
import type { FetchButton } from './use_fetch_button.hook'

import { useEffect, useRef, useState } from 'react'
import { getLiveTrains } from '~digitraffic'

export default function useTrains(
  stationShortCode: string,
  options: GetTrainsOptions = {}
) {
  const optionsRef = useRef(options)

  const [{ trains, empty }, setTrains] = useState<{
    trains: Train[]
    empty: boolean
  }>({
    trains: [],
    empty: false
  })
  useEffect(() => {
    setTrains({ trains: [], empty: false })

    getLiveTrains(stationShortCode, optionsRef.current).then(trains => {
      setTrains({ trains, empty: trains.length === 0 })
    })
  }, [stationShortCode])

  const updateTrains = ({
    fetchButton,
    clickedTimes,
    stationShortCode
  }: {
    fetchButton: FetchButton
    clickedTimes: MutableRefObject<number>
    stationShortCode: string
  }) => {
    fetchButton.dispatch({ isLoading: true, isDisabled: true })

    const departingTrains = ++clickedTimes.current * 100

    // Digitraffic has a hard limit of 600 departing trains.
    if (departingTrains > 600) {
      fetchButton.dispatch({ isVisible: false })
      return
    }

    getLiveTrains(stationShortCode, {
      departingTrains
    }).then(trains => {
      setTrains({ trains, empty: trains.length < 1 })

      // When returning less than 100 trains there are no further trains,
      // although the value is less than 600.
      if (trains.length % 100 !== 0) {
        fetchButton.dispatch({ isVisible: false })
        return
      }

      fetchButton.dispatch({
        isLoading: false,
        isDisabled: false,
        isVisible: true
      })
    })
  }

  return { trains, empty, updateTrains }
}
