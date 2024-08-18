<h1>App <img src="https://junat.live/maskable_icon.png" align="right" width="38px"></h1>

Cross-platform mobile application for Junat.live. Extends the Junat.live web app with native interoperability via Rust Inter-Process Communication (IPC) using Tauri. Features like geolocation work using native APIs.

## Differences between site

Although the application and site look identical in design there are subtle differences in how routing and some APIs are implemented. The app uses Tanstack Router and bundles with Vite, because of limitations with Next.js router (can't use dynamic routes or search parameters).

Because some features use native APIs through IPC, the app will not work on web browser.

There are also some changes in imports due to the way Vite plugin ecosystem works, e.g. SVGs need to be imported with `?react` to convey a loader.

## Developing

Install the Rust toolchain, version 1.75 (stable) or later is required. Easiest way to get it is to use [rustup](https://rustup.rs/): `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

Then ensure you have dependencies installed with `pnpm i && cargo install`

Prequisities for iOS and Android can be found on [Tauri documentation](https://v2.tauri.app/start/prerequisites/#configure-for-mobile-targets). For debugging see https://v2.tauri.app/develop/#opening-the-web-inspector-1.

## iOS

Tips for working with iOS. Requires a Mac and prerequisites mentioned above.

### Permissions

1. `xcrun simctl list devices | grep Booted` returns a list of booted devices and their ids, e.g. Iphone 15 (DDD560EA-B3B7-4A36-B208-ED3A77A7B209) (Booted)
2. To reset permissions for Junat.live run `xcrun simctl privacy <id> reset all live.junat.app`, where `<id>` is the long string surrounded by parentheses you got by running the prior command.

### Xcode

You might need to link pnpm and node to /usr/local/bin so Xcode can pick them up. If you already have pnpm and node under /usr/local/bin you can skip the steps below.

```sh
# for pnpm
ln -s $(which pnpm) /usr/local/bin/pnpm
# for node
ln -s $(which node) /usr/local/bin/node
```

Only then you may run the command below. Do note that specifying a simulator as an argument will not work, open a simulator from Xcode.

```sh
pnpm tauri ios dev --open
```
