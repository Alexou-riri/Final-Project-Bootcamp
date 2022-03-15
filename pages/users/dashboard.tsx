import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Layout from '../../components/Layout';
import { getUserById, getValidSessionByToken, User } from '../../util/database';
import styles from './dashboard.module.css';
import { css } from '@emotion/react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  user: User;
};

export default function ProtectedDashboard(props: Props) {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <Layout {...props.user.username}>
      <h1> Here is your dashboard {props.user.username} </h1>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className={styles.col2}>
          <label>
            Loading Place
            <input
              placeholder="Where should we load and give empty pallets"
              tabIndex={2}
            />
          </label>
        </div>
        <div className={styles.col2}>
          <label>
            Loading Date:
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
            />
          </label>
        </div>
        <div className={styles.col2}>
          <label>
            Offlooading Place
            <input
              placeholder="Where should we offload and receive empty pallets"
              tabIndex={2}
            />
          </label>
        </div>
        <div className={styles.col2}>
          <label>
            Offlooading Date:
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
            />
          </label>
        </div>

        <div className={styles.col3}>
          <label>
            Reference
            <input
              placeholder="Do we have a reference for this load?"
              tabIndex={3}
            />
          </label>
        </div>
        <div className={styles.col3}>
          <label>
            Truck Number
            <input
              placeholder="Which truck is going to do this load"
              tabIndex={4}
            />
          </label>
        </div>
        <div className={styles.col3}>
          <label>
            How many pallets should we give and thus get back at the end of the
            mission
            <input
              type="number"
              placeholder="33"
              min="0"
              max="40"
              id="number"
            />
          </label>
        </div>
        <div className={styles.colsubmit}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // 1. check if there is a token and is valid from the cookie
  const token = context.req.cookies.sessionToken;

  if (token) {
    // 2. check if the token is valid and redirect
    const session = await getValidSessionByToken(token);

    if (session) {
      const user = await getUserById(session.userId);
      console.log(user);
      return {
        props: { user: user },
      };
    }

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}
