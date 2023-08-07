import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/context/theme'
import { GlobalContextProvider } from '@/context/store'
import SideBar from '@/components/sideBar'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <ThemeProvider>
        <SideBar />
        <Component {...pageProps} />
      </ThemeProvider >
    </GlobalContextProvider >
  )
}
