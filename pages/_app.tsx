import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/context/theme'
import { GlobalContextProvider } from '@/context/store'
import SideBar from '@/components/sideBar'
import MobileMenu from '@/components/mobileMenu'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <ThemeProvider>
        <MobileMenu />
        <SideBar />
        <Component {...pageProps} />
      </ThemeProvider >
    </GlobalContextProvider >
  )
}
