import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Layout from '../../components/Layout';
import Head from 'next/head';
import {
  getUserById,
  getUserByValidSessionToken,
  getValidSessionByToken,
  User,
  Load,
  Truck,
  Address,
} from '../../util/database';
import { DeleteLoadResponseBody } from '../api/newLoad';
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
  loadsFromDatabase: Load[];
  load: Load;
  errors?: string;
  truck: Truck;
  address: Address;
};

type CreateLoadResponseBody =
  | { errors: { message: string }[] }
  | { load: Load }
  | { truck: Truck };

type Errors = { message: string }[];
// type Props = {loadsFromDatabase: Load[]}

export default function AllLoads(props: Props) {
  const [loadingDate, setLoadingDate] = useState(new Date());
  const [offloadingDate, setOffloadingDate] = useState(new Date());
  const [loadingAddress, setLoadingAddress] = useState('');
  const [offloadingAddress, setOffloadingAddress] = useState('');
  const [companyName1, setCompanyName1] = useState('');
  const [companyName2, setCompanyName2] = useState('');
  const [reference, setReference] = useState('');
  const [truckPlate, setTruckPlate] = useState('');
  const [trailerPlate, setTrailerPlate] = useState('');
  const [palletNumber, setPalletNumber] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [errors, setErrors] = useState<Errors | undefined>([]);
  const [loadList, setLoadList] = useState<Load[]>(props.loadsFromDatabase);

  if ('error' in props) {
    return (
      <Layout>
        <Head>
          <title>User Error</title>
          <meta name="description" content="An error about a user " />
        </Head>
        <h1>User Error</h1>
        {props.errors}
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>All loads done in the past</h1>
      {/* map all loads */}
      {props.loadsFromDatabase.map((load) => {
        return (
          <div>
            <p>Request Date: {load.requestDate}</p>
            <p>Loading Place: </p>
            <p>Offloading Place</p>
            <p>Loading date: {load.loadingDate}</p>
            <p>Offloading Date: {load.offloadingDate}</p>
            <p>Reference: {load.reference}</p>
            <p>Pallet given: {load.palletQuantityGiven}</p>
            <p>Pallet received: {load.palletQuantityReceived}</p>
            <p>Truck Plate:</p>
            <p>Trailer Plate</p>
            <p></p>
          </div>
        );
      })}
      );
      <Link href="/users/dashboard">
        <a>Back at the dashboard</a>
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
        error: 'You are not allowed to see this page',
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
