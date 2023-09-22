import { IsSsrMobileContext } from '@/components/utility/contexts/isSsrMobileContext';
import { theme } from '@/components/utility/theme';
import '@/styles/globals.css';
import { useMediaQuery } from '@mui/material';
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import { AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import { useEffect } from 'react';

const env = process.env.NEXT_PUBLIC_ENVIRONMENT

export default function App({ Component, pageProps }) {
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    console.log("HERE")
    window.addEventListener("resize", (ev) => {
      document.body.style.height = window.visualViewport.height + "px"
    }, true);
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
      <IsSsrMobileContext.Provider value={pageProps.isSsrMobile}>
        <AnimatePresence mode="wait" initial={false}>
          <Component {...pageProps} />
        </AnimatePresence>
      </IsSsrMobileContext.Provider>
    </>

  )
}
