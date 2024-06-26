import copy from "rollup-plugin-copy";

import base from "@junat/rollup/typescript-package.js";

const config = Object.assign(base, {
  plugins: [
    ...base.plugins,
    copy({ targets: [{ src: "src/**/*.json", dest: "dist" }] }),
  ],
});

export default config;
