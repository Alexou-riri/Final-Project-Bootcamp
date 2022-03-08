import Head from 'next/head';
import Layout from '../components/Layout';

export default function Dashboard() {
  return (
    <Layout>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
      </Head>

      <h1>Dashboard</h1>
      <h2>Welcome </h2>
    </Layout>
  );
}
