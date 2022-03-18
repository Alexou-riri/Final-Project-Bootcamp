// import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
// import Head from 'next/head';
// import Link from 'next/link';
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
  const [loadingDate, setLoadingDate] = useState(new Date());
  const [offloadingDate, setOffloadingDate] = useState(new Date());

  return (
    <Layout>
      <form
      // className={styles.form}
      // onSubmit={(event) => {
      //   event.preventDefault();
      // }}
      >
        <div
        // className={styles.col2}
        >
          <label>
            Loading Place
            <input
              placeholder="Company Name"
              // tabIndex={2}
            />
            <input
              placeholder="Company Address"
              //  tabIndex={2}
            />
          </label>
        </div>
        <div
        // className={styles.col2}
        >
          <label htmlFor="LoadingDate">
            Loading Date:
            <DatePicker
              selected={loadingDate}
              onChange={(date) => setLoadingDate(date)}
              dateFormat="dd/MM/yyyy"
              withPortal
            />
          </label>
        </div>
        <div
        // className={styles.col2}
        >
          <label>
            Offlooading Place
            <input
              placeholder="Where should we offload and receive empty pallets"
              // tabIndex={2}
            />
          </label>
        </div>
        <div
        // className={styles.col2}
        >
          <label htmlFor="OffloadingDate">
            Offlooading Date:
            <DatePicker
              selected={offloadingDate}
              onChange={(date) => setOffloadingDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </label>
        </div>

        <div
        // className={styles.col3}
        >
          <label>
            Reference
            <input
              placeholder="Do we have a reference for this load?"
              // tabIndex={3}
            />
          </label>
        </div>
        <div
        // className={styles.col3}
        >
          <label>
            Truck Number
            <input
              placeholder="Which truck is going to do this load"
              // tabIndex={4}
            />
          </label>
        </div>
        <div
        // className={styles.col3}
        >
          <label>
            How many pallets should we give and thus get back at the end of the
            mission
            <input type="number" placeholder="33" min="0" max="40" />
          </label>
        </div>
        <div
        // className={styles.colsubmit}
        >
          <button>Submit</button>
        </div>
      </form>
    </Layout>
  );
}
