import '@/styles/globals.css'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import '@/styles/chat.css'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { UserProvider } from '@/context/user';
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    window.addEventListener("resize", (ev) => {
      document.body.style.height = window.visualViewport.height + "px"
    }, true)
  }, [])

  return (
    <>
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-V6RXH45WCW" />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V6RXH45WCW', {
              page_path: window.location.pathname,
            });
          `
        }}
      />
      <Script
        async
        src={"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4673351659658307"}
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      <AnimatePresence mode="wait" initial={false}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </AnimatePresence>
    </>

  )
}
