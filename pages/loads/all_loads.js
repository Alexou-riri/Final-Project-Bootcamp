import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
// import {
//   getUserById,
//   getValidSessionByToken,
//   User,
//   Session,
// } from '../../util/database';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

export default function SingleLoad() {
  return (
    <Layout>
      <h1>All loads done in the past</h1>

      <Link href="/users/dashboard">
        <a>Back at the dashboard</a>
      </Link>
    </Layout>
  );
}
