import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <meta name="application-name" content="Glyph" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Glyph" />
      <meta name="description" content="Your personal AI assistant" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#2B5797" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#ffffff" />

      <link rel="apple-touch-icon" href="/icon.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/icon.png" />

      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content="Glyph" />
      <meta property="og:description" content="Your personal AI assistant" />
      <meta property="og:site_name" content="Glyph" />
      <meta property="og:url" content="https://dev.glyphassistant.com" />
      <meta property="og:image" content="https://dev.glyphassisant.com/icon.png" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <script src="https://accounts.google.com/gsi/client"></script>
      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
