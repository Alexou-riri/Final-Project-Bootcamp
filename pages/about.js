import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/Layout';
import { css } from '@emotion/react';

const text = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 25px;
  h3 {
    font-size: 20px;
    margin: 60px;
  }
`;

const image = css`
  border-radius: 10px;
`;

export default function About(props) {
  return (
    <Layout userObject={props.userObject}>
      <div>
        <Head>
          <title>WAMP? About</title>
        </Head>

        <div css={text}>
          <h1>About us </h1>
          <h3>
            Some loads require pallet change, meaning that the truck gives empty
            pallets at the loading place, in exchange for the goods. Then he
            will receive empty pallets back from the offloading place, in
            exchange for the goods. So at the end, he should have the same
            amount in and out. <br />
            But sometimes, the offloading place forgets to give the pallets
            back, or for any reasons the carrier gets less than he should.
            <br /> This website will help you follow and check the loads with
            exchange. <br />
            Thanks to the history of the loads, it will also enable you to see
            which recurrent warehouses make you lose your precious wooden
            pallets.
          </h3>
          <img
            src="/pal_blur.jpg"
            alt="of a pallet"
            height={1100}
            width={800}
            css={image}
          />
        </div>
      </div>
    </Layout>
  );
}
