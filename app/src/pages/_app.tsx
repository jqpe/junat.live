// import type { AppProps as NextAppProps } from 'next/app'
// import type { PropsWithChildren, ReactNode } from 'react'

// import dynamic from 'next/dynamic'
// import { QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { checkPermissions } from '@tauri-apps/plugin-geolocation'

// import { queryClient } from '~/lib/react_query'


// const NoScript = dynamic(() => import('~/components/no_script'))

// interface AppProps extends NextAppProps {
//   Component: NextAppProps['Component'] & {
//     layout?: ({ children }: PropsWithChildren) => JSX.Element
//   }
// }

// export default function App({ Component, pageProps }: AppProps) {
//   useWakeLock()

//   if (Component.layout) {
//     return (
//       <AppProvider>
//         <Component.layout>
//           <NoScript />

//           <Component {...pageProps} />
//         </Component.layout>
//       </AppProvider>
//     )
//   }

//   return (
//     <AppProvider>
//       <NoScript />

//       <Component {...pageProps} />
//     </AppProvider>
//   )
// }

// const ToastProvider = dynamic(() =>
//   import('~/components/toast').then(mod => mod.ToastProvider),
// )
// const DialogProvider = dynamic(() =>
//   import('@junat/ui/components/dialog').then(mod => mod.DialogProvider),
// )

// const Toast = dynamic(() => import('~/components/toast').then(mod => mod.Toast))

// interface AppProviderProps {
//   children: ReactNode | ReactNode[]
// }

// function AppProvider({ children }: AppProviderProps) {
//   return (
// //
//   )
// }
