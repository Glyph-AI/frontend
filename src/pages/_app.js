import '@/styles/globals.css'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import '@/styles/chat.css'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { UserProvider } from '@/context/user';
import Script from 'next/script'

const env = process.env.NEXT_PUBLIC_ENVIRONMENT

export default function App({ Component, pageProps }) {
  const [profile, setProfile] = useState({})
  useEffect(() => {
    window.addEventListener("resize", (ev) => {
      document.body.style.height = window.visualViewport.height + "px"
    }, true)

    console.log("Hello from _app.js")
  }, [])

  return (
    <>
      {
        env === "production" && (
          <>
            <Script
              dangerouslySetInnerHTML={{
                __html: `(function(apiKey){
                      (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
                      v=['initialize','identify','updateOptions','pageLoad','track'];for(w=0,x=v.length;w<x;++w)(function(m){
                          o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
                          y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
                          z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
                  })('7bf96b94-515a-4087-4ac7-08e6e0a72db2');`
              }}
            />
          </>
        )
      }
      <AnimatePresence mode="wait" initial={false}>
        <UserProvider>
          <Component {...pageProps} setProfile={setProfile} profile={profile}/>
        </UserProvider>
      </AnimatePresence>
    </>

  )
}
