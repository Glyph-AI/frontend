import '@/styles/globals.css'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import '@/styles/chat.css'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    window.addEventListener("resize", (ev) => {
      document.body.style.height = window.visualViewport.height + "px"
    }, true)
  }, [])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Component {...pageProps} />
    </AnimatePresence>

  )
}
