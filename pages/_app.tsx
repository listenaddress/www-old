import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/context/theme'
import { GlobalContextProvider } from '@/context/store'
import TopBar from '@/components/topBar'
// import MobileMenu from '@/components/mobileMenu'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <ThemeProvider>
        {/* <MobileMenu /> */}
        <TopBar />
        <Component {...pageProps} />
      </ThemeProvider >
    </GlobalContextProvider >
  )
}
