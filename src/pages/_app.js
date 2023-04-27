import '@/styles/globals.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import '@/styles/chat.css'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {

  useEffect(() => {
    window.addEventListener("resize", (ev) => {
      document.body.style.height = window.visualViewport.height + "px"
      console.log(document.body.style)
    }, true)
  }, [])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Component {...pageProps} />
    </AnimatePresence>

  )
}
