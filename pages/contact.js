import Head from 'next/head';
import Layout from '../components/Layout';
import { BsGithub, BsFacebook } from 'react-icons/bs';
import { MdAlternateEmail } from 'react-icons/md';
import { IoLogoLinkedin } from 'react-icons/io';
import { css } from '@emotion/react';

const contact = css`
  display: flex;
  flex-direction: column;
  margin: 100px;
  gap: 40px;
`;

export default function Contact(props) {
  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>House Of Castles</title>

        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-apple-touch.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <h1>Dont hesitate to contact us</h1>
      <h2>Alexandra Rieux</h2>
      <div css={contact}>
        <p>
          <BsGithub size={100} />{' '}
          <a href="https://github.com/Alexou-riri">Alexou-riri</a>
        </p>
        <BsFacebook size={100} />
        <MdAlternateEmail size={100} />
        <IoLogoLinkedin size={100} />
      </div>
    </Layout>
  );
}
