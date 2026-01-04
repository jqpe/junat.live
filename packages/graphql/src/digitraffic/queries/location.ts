import { graphql } from '#generated/digitraffic'

export const location = graphql(`
  query location {
    latestTrainLocations(
      where: {
        train: {
          runningCurrently: { equals: true }
          trainType: {
            trainCategory: {
              or: [
                { name: { equals: "Commuter" } }
                { name: { equals: "Long-distance" } }
              ]
            }
          }
        }
      }
    ) {
      ...TrainLocation
    }
  }
`)
