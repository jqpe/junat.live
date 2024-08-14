<h1>App <img src="https://junat.live/maskable_icon.png" align="right" width="38px"></h1>

> [!NOTE]
> Very much a work in progress!

Cross-platform mobile application for Junat.live. Extends the Junat.live website with native interoperability with Rust Inter-Process Communication (IPC) via Tauri. Features like geolocation work using native APIs.

## Differences between site

Although the application and site look identical in design there are subtle differences in how routing and some APIs are implemented. The app uses Tanstack Router and bundles with Vite, because of limitations with Next.js router (can't use dynamic routes or search parameters).

Because some features use native APIs through IPC, the app will not work on web browser. 

There are also some changes in imports due to the way Vite plugin ecosystem works, e.g. SVGs need to be imported with `?react` to convey a loader and some import paths need to use `/index` where Webpack would resolve it without the explicit suffix.

## Developing

Install the Rust toolchain, version 1.75 (stable) or later is required. Easiest way to get it is to use [rustup](https://rustup.rs/) : `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

Then ensure you have dependencies installed with `pnpm i && cargo install`

Instructions for prequisities for iOS and Android can be found on [Tauri documentation](https://v2.tauri.app/start/prerequisites/#configure-for-mobile-targets).
