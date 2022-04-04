import Head from 'next/head';
// import Image from 'next/image';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { css } from '@emotion/react';
import { useEffect } from 'react';
import Link from 'next/link';
import { BiDetail } from 'react-icons/bi';
import { BsArchive } from 'react-icons/bs';
// import { useEffect } from 'react';

const color = css`
  color: #00b8c2;
  text-shadow: #00828c 1px 1px 1px;
  font-family: 'Oxygen';
`;

const image = css`
  border: 1px solid black;
  margin-top: 34px;
  background: #ffffff;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
`;

const feature3 = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 160px;
  width: 100vw;
`;

const feature2 = css`
  display: flex;
  flex-direction: row;
  /* justify-content: flex-end; */
  align-items: center;
  /* gap: 20vw; */
  justify-content: space-around;

  width: 100vw;
  margin-top: 160px;
`;

const feature1 = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100vw;
  margin-top: 160px;
`;

export default function Home(props) {
  useEffect(() => {
    // props.refreshUserProfile();
  }, [props]);

  return (
    <>
      <Head>
        <title>Where are my pallets?</title>
        <meta name="description" content="Pallet management App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout userObject={props.userObject}>
        <main className={styles.main}>
          <h1 className={styles.welcome}>Welcome to </h1>{' '}
          <span css={color} className={styles.title}>
            Where are my pallets?
          </span>
          <h2>Your solution to keep track of the pallets you are changing.</h2>
          <img
            src="pal_man.jpg"
            alt="A man standing in front of a desk in a warehouse"
            height={700}
            width={1200}
            css={image}
          />
          <div className={styles.grid}>
            <div css={feature1}>
              <Link href="/register">
                <a className={styles.card}>
                  <h2>Information </h2>
                  <p>
                    Create a form for each load, with necessary information.{' '}
                    {''}
                  </p>
                  <BiDetail size={20} />
                </a>
              </Link>
              <img
                src="/logistic.svg"
                alt="image of logistic"
                height={600}
                width={800}
              />
            </div>
            <div css={feature2}>
              <img
                src="pal_sky.jpg"
                alt="Trucks on the road"
                height={600}
                width={700}
                css={image}
              />
              <Link href="/login">
                <a className={styles.card}>
                  <h2>Tracking </h2>
                  <p>
                    Follow up in real time how many pallets you have in stock
                  </p>
                </a>
              </Link>
            </div>
            {/* <div css={line1} /> */}
            <div css={feature3}>
              <Link href="/login">
                <a className={styles.card}>
                  <h2>Previous Loads </h2>
                  <p>
                    See all the loads that have been done in an archive page.
                  </p>
                  <BsArchive />
                </a>
              </Link>
              <img
                src="trucks.jpg"
                alt="Trucks on the road"
                height={600}
                width={600}
                css={image}
              />
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
