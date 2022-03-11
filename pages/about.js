import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/Layout';

export default function About(props) {
  return (
    <Layout userObject={props.userObject}>
      <div>
        <Head>
          <title>House Of Castles</title>
        </Head>

        <div className={styles.main}>
          <h1>About us </h1>
          <h3>
            Some loads require pallet change, meaning the truck gives empty
            pallets at the loading place, in exchange for the goods, and then
            will receive (the same) amount of empty pallets at the offloading
            place, in exchange for the goods. But sometimes, the offloading
            place 'forget' to give them back, or the driver forget them as well.
            Or sometimes the client doesn't know the exact amount of pallets to
            change, so the carrier gives more pal than he should, and will get
            back from the warehouse. This website will help you follow and check
            the loads with exchange. It will also be possible to send directly
            to the driver a sms as a reminder. The history of the loads will
            enable to see, which recurrent warehouses gives problem.
          </h3>
          <img
            src="/pal_blur.jpg"
            alt="of a pallet"
            height={1100}
            width={800}
          />
        </div>
      </div>
    </Layout>
  );
}
