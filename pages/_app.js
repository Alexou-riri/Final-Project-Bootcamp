import { css, Global } from '@emotion/react';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-apple-touch.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Global
        styles={css`
          body {
            margin: 0;
            padding: 0;
          }
        `}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
