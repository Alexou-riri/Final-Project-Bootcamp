import Head from 'next/head';
import Layout from '../components/Layout';
import { BsGithub, BsFacebook } from 'react-icons/bs';
import { MdAlternateEmail } from 'react-icons/md';
import { IoLogoLinkedin } from 'react-icons/io';
import { css } from '@emotion/react';

const contact = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin: 100px;
  gap: 40px;
`;
const header = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 25px;

  h2 {
    font-family: 'Oxygen';
    font-size: 40px;
    color: #00b8c2;
    text-shadow: black 1px 1px 1px;
  }
`;
const lien = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 50px;
  color: black;
  a {
    text-decoration: none;
  }
  &:hover {
    text-decoration: none;
    color: black;
  }
  &:visited {
    text-decoration: none;
    color: black;
  }
`;

export default function Contact(props) {
  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>WAMP? Contact</title>

        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-apple-touch.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div css={header}>
        <h1>Dont hesitate to contact me</h1>
        <h2>Alexandra Rieux</h2>
      </div>
      <div css={contact}>
        <div>
          <div css={lien}>
            <BsGithub size={100} />{' '}
            <a href="https://github.com/Alexou-riri">Alexou-riri</a>
          </div>

          <div css={lien}>
            <MdAlternateEmail size={100} />
            <p>alexandra.rieux@gmx.com</p>
          </div>
          <div css={lien}>
            <IoLogoLinkedin size={100} />
            <a href="https://www.linkedin.com/in/alexandra-rieux/">
              Alexandra-Rieux
            </a>
          </div>
        </div>
        <img
          src="/media.svg"
          alt="image with social media logo"
          height={400}
          width={400}
        />
      </div>
    </Layout>
  );
}
