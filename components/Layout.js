import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';
import { css } from '@emotion/react';

const pageContainer = css`
  background-color: #f3f2ef;
  // EAF1F5
  margin-top: 200px;
`;

// const sticky = css`
//   .is-sticky {
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     z-index: 999;
//     box-shadow: 0 2px 24px 0 rgb(0 0 0 / 15%);
//     background-color: #ffffff !important;
//     animation: 500ms ease-in-out 0s normal none 1 running fadeInDown;
//     padding-top: 0px;
//     padding-bottom: 0px;
//   }
// `;

export default function Layout(props) {
  return (
    <div>
      <Head>
        <title />
      </Head>
      <Header userObject={props.userObject} />
      <main css={pageContainer}>{props.children}</main>

      <Footer />
    </div>
  );
}
