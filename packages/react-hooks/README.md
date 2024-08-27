<h1>react-hooks <img src="https://junat.live/maskable_icon.png" align="right" width="38px" alt="Junat.live logo"></h1>

Requires Just-in-Time (JIT) compilation at the callsite. Without JIT compilation, a separate Zustand instance will be created, resulting in empty stores at the callsite.

For Vite projects, this functionality works out of the box. For Next.js projects, use the `transpilePackages` option in your configuration and include `@junat/react-hooks`.
