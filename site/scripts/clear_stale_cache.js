import fs from 'node:fs/promises'
import path from 'node:path'
;(async () => {
  const cacheDirectory = path.join(process.cwd(), '.cache')
  try {
    const files = await fs.readdir(cacheDirectory)

    if (!files) {
      return
    }

    const dateYyyyMmDd = new Date().toISOString().split('T')[0]
    const dateRegexp = new RegExp(`${dateYyyyMmDd}\\.\\w+$`)

    for (const file of files) {
      if (!dateRegexp.test(file)) {
        await fs.rm(path.join(cacheDirectory, file)).catch(error => {
          console.error(`Couldn't remove file ${file}:\n`, error)
        })
      }
    }
  } catch {}
})()
