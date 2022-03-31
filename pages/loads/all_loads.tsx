import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Layout from '../../components/Layout';
import {
  // getUserById,
  getUserByValidSessionToken,
  getValidSessionByToken,
  // getAllAddresses,
  getLoads,
  User,
  Load,
  Address,
  Truck,
  // getAllTrucks,
  // getLoadById,
} from '../../util/database';
// import { DeleteLoadResponseBody } from '../api/newLoad';
// import styles from './dashboard.module.css';
import { css } from '@emotion/react';
import { useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import Link from 'next/link';
// import { AiOutlineCalendar } from 'react-icons/ai';
// import { FaWarehouse, FaPallet } from 'react-icons/fa';
// import { BsTruck } from 'react-icons/bs';
import router from 'next/router';
import moment from 'moment';
moment().format();
import format from 'date-fns/format';
import Head from 'next/head';

const loadPreview = css`
  display: flex;
  flex-direction: row;
  border: 1px solid red;
`;

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
  loads: Load;
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
  const [loadingCompanyName, setLoadingCompanyName] = useState('');
  const [offloadingCompanyName, setOfflloadingCompanyName] = useState('');
  const [reference, setReference] = useState('');
  const [truckPlate, setTruckPlate] = useState('');
  const [trailerPlate, setTrailerPlate] = useState('');
  const [palletQuantityGiven, setPalletQuantityGiven] = useState<Number>(0);
  const [palletQuantityrReceived, setPalletQuantityReceived] = useState('');
  const [documentId, setDocumentId] = useState('');

  const [loadingStreetInfo, setLoadingStreetInfo] = useState('');
  const [loadingZipcode, setLoadingZipcode] = useState('');
  const [loadingCountry, setLoadingCountry] = useState('');
  const [loadingCity, setLoadingCity] = useState('');
  const [offloadingCity, setOffloadingCity] = useState('');

  const [offlloadingStreetInfo, setOffloadingStreetInfo] = useState('');
  const [offloadingZipcode, setOffloadingZipcode] = useState('');
  const [offloadingCountry, setOffloadingCountry] = useState('');
  const [errors, setErrors] = useState<Errors | undefined>([]);
  const [loadList, setLoadList] = useState([]);
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [truckList, setTruckList] = useState<Truck[]>([]);

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
      {props.loads.map((load) => {
        // console.log(props.load, 'iiiiiiiiii');

        return (
          <>
            <div key={load.id} css={loadPreview}>
              <div>{load.reference} ref</div>
              <div>{load.palletQuantityGiven} pal</div>
            </div>
          </>
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
  const loadsFromDatabase = await getLoads();
  // loadsFromDatabase est un array de objet moche, mais typeof dit object\\
  const stringifyLoadsFromDatabase = JSON.stringify(loadsFromDatabase);
  // stringifyLoadsfromDB arra de object mais typeof string\\
  const loads = JSON.parse(stringifyLoadsFromDatabase);
  // loads array beau mais typeof objet\\

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
      props: { user: user, load: stringifyLoadsFromDatabase, loads: loads },
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
