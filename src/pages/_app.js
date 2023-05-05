import '@/styles/globals.css'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import '@/styles/chat.css'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import NoSsr from '@mui/base/NoSsr';


export default function App({ Component, pageProps }) {
  useEffect(() => {
    window.addEventListener("resize", (ev) => {
      document.body.style.height = window.visualViewport.height + "px"
    }, true)
  }, [])

  return (
    <AnimatePresence suppressHydrationWarning={true} mode="wait" initial={false}>
      <NoSsr>
        <Component {...pageProps} />
      </NoSsr>
    </AnimatePresence>

  )
}
