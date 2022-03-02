import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from 'next/head';
export default function About() {
  return (
    <>
      <div>
        <Head>
          <title>House Of Castles</title>
        </Head>
        <Header />
        <h1>About this eshop</h1>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}
