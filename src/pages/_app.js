import '@/styles/globals.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import '@/styles/chat.css'
import { AnimatePresence } from 'framer-motion'

export default function App({ Component, pageProps }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Component {...pageProps} />
    </AnimatePresence>

  )
}
