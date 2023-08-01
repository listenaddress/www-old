import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/context/theme'
import { GlobalContextProvider } from '@/context/store'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider >
    </GlobalContextProvider >
  )
}
