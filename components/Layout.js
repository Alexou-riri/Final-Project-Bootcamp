import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';
import { css } from '@emotion/react';

const pageContainer = css`
  /* min-height: 100vh;
  display: flex;
  flex-direction: column; */
`;

export default function Layout(props) {
  return (
    <div>
      <Head>
        <title />
      </Head>
      <Header />
      <main css={pageContainer}>{props.children}</main>

      <Footer />
    </div>
  );
}
