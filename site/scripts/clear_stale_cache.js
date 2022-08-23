import fs from 'node:fs/promises'
import path from 'node:path'

import { LOCALES } from '../src/constants/locales.js'
;(async () => {
  const cacheDirectory = path.join(process.cwd(), '.cache')
  try {
    const files = await fs.readdir(cacheDirectory)

    if (!files) {
      return
    }

    const calendarDate = new Date().toISOString().split('T')[0]
    const dateRegexp = new RegExp(`${calendarDate}\\.\\w+$`)

    for (const file of files) {
      const contents = await fs.readFile(path.join(cacheDirectory, file), {
        encoding: 'utf-8'
      })

      const stationName = JSON.parse(contents)[0].stationName

      if (
        !dateRegexp.test(file) ||
        !Object.keys(stationName).every(locale => LOCALES.includes(locale))
      ) {
        await fs.rm(path.join(cacheDirectory, file)).catch(error => {
          console.error(`Couldn't remove file ${file}:\n`, error)
        })
      }
    }
  } catch {}
})()
