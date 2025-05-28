<h1><a href="https://junat.live">Junat.live</a> <img src="https://junat.live/maskable_icon.png" width="38px" align="right" /></h1>

See Finnish train schedules in real-time. The site uses an MQTT connection to keep the data fresh and updates in a matter of milliseconds.

[![Coverage](https://codecov.io/gh/jqpe/junat.live/branch/main/graph/badge.svg?token=BBV4WAA534)](https://app.codecov.io/gh/jqpe/junat.live)
[![Mozilla Observatory Grade](https://img.shields.io/mozilla-observatory/grade-score/junat.live)](https://developer.mozilla.org/en-US/observatory/analyze?host=junat.live)

![Junat.live mockup](https://raw.github.com/jqpe/junat.live/main/thumb.jpg)

## Project structure

Pnpm workspaces with [Turborepo](https://turborepo.org/) is used to keep internal packages in sync. Each of the packages have their own suite of automated tests that can be run from the workspace root or the package in question. Documentation is available in [the Wiki](https://github.com/jqpe/junat.live/wiki).

The repo consists of three main packages:

- ### site

  The site, built on Next.js and deployed to Vercel. Tested with unit tests and automatic Storybook e2e and integration tests.

- ### packages/digitraffic

  A minimal wrapper for [Digitraffic](https://digitraffic.fi)'s REST endpoints. Also provides some extra features such as localized stations for Finnish, English and Swedish.

- ### packages/digitraffic-mqtt
  Utilities for working with Digitraffic's MQTT APIs. For example, you can listen to trains just by initiating the client and asynchronously looping over any updates:
  ```js
  for await (train of client.trains) {
    console.log(`Train updated: ${train.trainNumber}.`)
  }
  ```

## Developing locally

Node.js version 20 is required; 20 and 22 are tested.

1. Clone the repository with your preferred method. Whether that be the Github CLI, degit or just git commands.
2. This repository uses [pnpm](https://pnpm.io/) for package management so you should have it installed. If you don't, you can simply run `corepack enable && corepack install` to install it. Note that, as of [version v9 of pnpm](https://github.com/pnpm/pnpm/releases/tag/v9.0.0), pnpm requires you to use the version specified in package.json packageManager field.
3. Run `pnpm install`. For the first run running `pnpm dev` from the workspace root builds the packages.

## License

Copyright (C) 2025 Jasper Nykänen

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
