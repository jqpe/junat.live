import { createServer, Socket } from 'node:net'

import Aedes, { PublishPacket, Client } from 'aedes'

import train from '../mocks/train.json'
import gpsLocation from '../mocks/gps_location.json'

interface SystemError {
  code?: string
  errno?: number
  address?: number
  port?: number
}

export default function startMockServer() {
  const ws = new Aedes()
  const server = createServer(ws.handle)
  const PORT = 1883

  const openedConnections: Socket[] = []

  server.on('connection', socket => openedConnections.push(socket))

  const errors: SystemError[] = []

  server.on('error', error => {
    console.error(error)
    errors.push(error as SystemError)
  })

  server.listen(PORT, () => {
    console.log(`MQTT broker running on port ${PORT}`)
  })

  // Return early if the address is already in use by another broker, if errors has unexpected errors halt
  if (errors.some(error => 'code' in error && error.code === 'EADDRINUSE')) {
    return
  } else if (errors.length > 0) {
    throw errors
  }

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

    if (iterations === 5000 || ws.closed) {
      clearInterval(interval)
    }
  }
  const interval = setInterval(publish, 50)
}

function errorCallback(error: Error | undefined): void {
  if (error) {
    console.error(error)
    throw new Error(`MQTT broker crashed with error: ${error}`)
  }
}
