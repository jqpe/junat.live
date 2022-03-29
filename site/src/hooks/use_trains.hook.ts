import type { GetTrainsOptions, Train } from '~digitraffic'
import { MutableRefObject } from 'react'

import { useEffect, useRef, useState } from 'react'
import { getLiveTrains } from '~digitraffic'

export default function useTrains(
  stationShortCode: string,
  options: GetTrainsOptions = {}
) {
  const optionsRef = useRef(options)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()

  const [{ trains, empty }, setTrains] = useState<{
    trains: Train[]
    empty: boolean
  }>({
    trains: [],
    empty: false
  })
  useEffect(() => {
    setLoading(true)
    setTrains({ trains: [], empty: false })

    getLiveTrains(stationShortCode, optionsRef.current)
      .then(trains => {
        setTrains({ trains, empty: trains.length === 0 })
      })
      .catch(error => {
        setError(error)
      })

    setLoading(false)
  }, [stationShortCode])

  const updateTrains = ({
    clickedTimes,
    stationShortCode
  }: {
    clickedTimes: MutableRefObject<number>
    stationShortCode: string
  }) => {
    setLoading(true)
    const departingTrains = ++clickedTimes.current * 100

    getLiveTrains(stationShortCode, {
      departingTrains
    })
      .then(trains => {
        setLoading(false)
        setTrains({ trains, empty: trains.length < 1 })
      })
      .catch(error => {
        setError(error)
      })
  }

  return { trains, empty, loading, error, updateTrains }
}
