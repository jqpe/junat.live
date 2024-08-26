# @junat/ui

Contains React components and SVG icons used in UI for Junat.live. SVGs are exported as files instead of being transpiled to React, you can use a tool like [SVGR](https://react-svgr.com/) at the callsite to do that.

## Usage

Since Tailwind will optimize away classes that are not reached, variants can not be bundled. At the callsite, you must create a Tailwind configuration and point to node_modules/@junat/ui/, i.e.

**tailwind.config.ts**

```ts
export default {
  content: ['node_modules/@junat/ui/dist/**/*.js'],
}
```

_N.B._ When using variants don't import @junat/ui/index.css as that could result in duplicate styles. If you use @junat/ui in a monorepo setting point to the root node_modules. If you want to use @junat/ui in apps/www you'd use `../../node_modules/@junat/ui/dist/**/*.js`.

**.npmrc**

In a monorepo setting, if using pnpm, add @junat/ui to publically hoisted packages:

```properties
public-hoist-pattern[]=@junat/ui
```
