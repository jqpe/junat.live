import { execSync } from 'node:child_process'
import path from 'node:path'

const coverage = name => {
  const baseName = path.basename(name)

  return [
    `pnpm dlx nyc report --reporter=lcovonly -t ${name}/coverage --report-dir coverage/`,
    `mv coverage/lcov.info coverage/${baseName}.lcov.info`,
  ].join(' && ')
}

execSync(
  [
    coverage('site'),
    coverage('packages/core'),
    coverage('packages/digitraffic'),
    coverage('packages/digitraffic-mqtt'),
    'mv site/coverage/lcov.info coverage/storybook.lcov.info',
  ].join(' && '),
  {
    stdio: 'inherit',
  },
)
