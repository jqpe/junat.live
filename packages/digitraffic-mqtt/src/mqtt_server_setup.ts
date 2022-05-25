import { createServer, Socket } from 'node:net'

import aedes, { Aedes, PublishPacket, Client } from 'aedes'

import train from '../mocks/train.json'
import gpsLocation from '../mocks/gps_location.json'

export default function startMockServer() {
  const ws = aedes()
  const server = createServer(ws.handle)
  const PORT = 1883

  const openedConnections: Socket[] = []

  server.on('connection', socket => openedConnections.push(socket))

  server.listen(PORT, () => {
    console.log(`MQTT broker running on port ${PORT}`)
  })

  const defaultPublishOptions: Pick<
    PublishPacket,
    'qos' | 'cmd' | 'dup' | 'retain'
  > = {
    qos: 0,
    cmd: 'publish',
    // Not relevant with qos 0
    dup: false,
    retain: false
  }

  ws.on('subscribe', async (subscriptions, client) => {
    for (const subscription of subscriptions) {
      if (/(trains-by-station)|(trains)/.test(subscription.topic)) {
        publishOnInterval(
          ws,
          client,
          function payloadFn() {
            return JSON.stringify({
              ...train,
              version: Date.now()
            })
          },
          {
            ...defaultPublishOptions,
            qos: 2,
            topic: subscription.topic
          }
        )
      }
      if (/train-locations/.test(subscription.topic)) {
        publishOnInterval(
          ws,
          client,
          function payloadFn() {
            return JSON.stringify({
              ...gpsLocation,
              timestamp: new Date().toISOString()
            })
          },
          {
            ...defaultPublishOptions,
            topic: subscription.topic
          }
        )
      }
    }
  })

  return function cleanup() {
    for (const socket of openedConnections) {
      socket.destroy()
    }
    ws.close()

    server.emit('close')
    server.close()
  }
}

function publishOnInterval(
  ws: Aedes,
  client: Client,
  payloadFn: () => PublishPacket['payload'],
  publishOptions: Omit<PublishPacket, 'payload'>
) {
  let iterations = 0
  const publish = () => {
    iterations += 1
    client.publish({ ...publishOptions, payload: payloadFn() }, errorCallback)

    if (iterations === 2000 || ws.closed) {
      clearInterval(interval)
    }
  }
  const interval = setInterval(publish, 125)
}

function errorCallback(error: Error | undefined): void {
  if (error) {
    console.error(error)
    throw new Error(`MQTT broker crashed with error: ${error}`)
  }
}
