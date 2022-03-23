import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Layout from '../../components/Layout';
import {
  getUserById,
  getUserByValidSessionToken,
  getValidSessionByToken,
  User,
  Load,
} from '../../util/database';
import styles from './dashboard.module.css';
import { css } from '@emotion/react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Link from 'next/link';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaWarehouse, FaPallet } from 'react-icons/fa';
import { BsTruck } from 'react-icons/bs';

// type Props = {
//   user: User;
// };
type Props = {
  userObject?: User;
  userCompany?: string;
  user: User;
};

export default function ProtectedDashboard(props: Props) {
  const [loadingDate, setLoadingDate] = useState(new Date());
  const [offloadingDate, setOffloadingDate] = useState(new Date());
  const [loadingPlace, setLoadingPlace] = useState('');
  const [offloadingPlace, setOffloadingPlace] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [reference, setReference] = useState('');

  return (
    <Layout {...props.userObject}>
      <h1> Dashboard of {props.user.company} </h1>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className={styles.col2}>
          <label>
            <FaWarehouse size={20} /> <br />
            Loading Place
            <input
              placeholder="Company Name"
              tabIndex={2}
              value={companyName}
            />
            <input
              placeholder="Company Address"
              tabIndex={2}
              value={loadingPlace}
            />
          </label>
        </div>
        <div className={styles.col2}>
          <label>
            <AiOutlineCalendar size={20} /> Loading Date:
            <DatePicker
              selected={loadingDate}
              onChange={(loadingDate: Date) => setLoadingDate(loadingDate)}
              dateFormat="dd/MM/yyyy"
              withPortal
            />
          </label>
        </div>
        <div className={styles.col2}>
          <label>
            <FaWarehouse size={20} />
            <br />
            Offlooading Place
            <input
              placeholder="Company Name"
              tabIndex={2}
              value={companyName}
            />
            <input
              placeholder="Company Address"
              tabIndex={2}
              value={offloadingPlace}
            />
          </label>
        </div>
        <div className={styles.col2}>
          <label>
            <AiOutlineCalendar size={20} /> Offlooading Date:
            <DatePicker
              selected={offloadingDate}
              onChange={(offloadingDate: Date) =>
                setOffloadingDate(offloadingDate)
              }
              dateFormat="dd/MM/yyyy"
              withPortal
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
            <BsTruck size={20} /> Truck Number
            <input
              placeholder="Which truck is going to do this load"
              tabIndex={4}
            />
          </label>
        </div>
        <div className={styles.col3}>
          <label>
            <FaPallet /> How many pallets should we give and thus get back at
            the end of the mission
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

      <Link href="/loads/all_loads">
        <a>To All the loads</a>
      </Link>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // 1. Get a user from the cookie sessionToken
  const token = context.req.cookies.sessionToken;
  const user = await getUserByValidSessionToken(token);
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    return {
      props: {
        error: 'You are not allowed to see animals today',
      },
    };
  }

  if (user) {
    console.log(user);
    return {
      props: { user: user },
    };
  }
  // 3. otherwise return to login page
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}
