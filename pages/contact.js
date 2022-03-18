import Head from 'next/head';
import Layout from '../components/Layout';
import { BsGithub, BsFacebook } from 'react-icons/bs';
import { MdAlternateEmail } from 'react-icons/md';

export default function Contact(props) {
  return (
    <Layout userObject={props.userObject}>
      <div>
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

        <BsGithub size={100} />
        <BsFacebook size={100} />
        <MdAlternateEmail size={100} />
      </div>
    </Layout>
  );
}
