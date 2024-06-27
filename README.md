<h1><a href="https://junat.live">Junat.live</a> <img src="https://junat.live/maskable_icon.png" width="38px" align="right" /></h1>

See Finnish train schedules in real-time. The site uses an MQTT connection to keep the data fresh and updates in a matter of milliseconds.

[![Coverage](https://codecov.io/gh/jqpe/junat.live/branch/main/graph/badge.svg?token=BBV4WAA534)](https://app.codecov.io/gh/jqpe/junat.live)
[![Mozilla Observatory Grade](https://img.shields.io/mozilla-observatory/grade/junat.live)](https://observatory.mozilla.org/analyze/junat.live)

![Junat.live mockup](https://github.com/jqpe/junat.live/assets/65775308/a4d4e10f-fc08-4768-b005-8e2a70594d51)

<sub>Mockups created with [deviceframes.com](https://deviceframes.com)<sub>

## Project structure

Pnpm workspaces with [Turborepo](https://turborepo.org/) is used to keep internal packages in sync. Each of the packages have their own suite of automated tests that can be run from the workspace root or the package in question.

The repo consists of three main packages:

- ### site

  The site, built on Next.js and deployed to Vercel. Tested with unit tests and a [public Storybook](https://junat-live-storybook.vercel.app/) with automatic e2e and integration tests.

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
