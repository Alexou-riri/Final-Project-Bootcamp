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
import { AiFillPropertySafety } from 'react-icons/ai';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {
  Address,
  getAllAddresses,
  getAllTrucks,
  getLoadById,
  // getAdressById,
  // getLoadById,
  // getTruckById,
  Load,
  Truck,
  User,
} from '../../util/database';
import { Session } from 'inspector';
import Head from 'next/head';
import Link from 'next/link';
import { FiTruck } from 'react-icons/fi';

// type Errors = { message: string }[];
type Props = {
  userObject?: User;
  userCompany?: string;
  user: User;
  loadsFromDatabase: Load[];
  load: Load;
  errors?: string;
  // address: Address;
  trucks: Truck[];
  addresses: Address[];
};

export default function SingleLoad(props: Props) {
  // const [loadingDate, setLoadingDate] = useState(new Date());
  // const [offloadingDate, setOffloadingDate] = useState(new Date());
  const [loadingAddress, setLoadingAddress] = useState('');
  const [offloadingAddress, setOffloadingAddress] = useState('');
  const [companyName1, setCompanyName1] = useState('');
  const [companyName2, setCompanyName2] = useState('');
  const [reference, setReference] = useState('');
  const [truckPlate, setTruckPlate] = useState('');
  const [trailerPlate, setTrailerPlate] = useState('');
  const [palletNumber, setPalletNumber] = useState('');

  const [errors, setErrors] = useState();
  console.log('HELP', props);
  if (!props.load) {
    // TODO: You would probably want to also send
    // a 404 HTTP status code (not found)
    return (
      <Layout>
        <Head>
          <title>Load not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <h1>Load not found</h1>
        Try again
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>blabla</title>
        <meta name="description" content={`User # is `} />
      </Head>

      <div>load id: {props.load.id}</div>

      <div>
        load loadingplace:
        {props.addresses.map((address) => {
          return (
            props.load.loadingPlaceId === address.id && (
              <p key={address.id}>Cie Name :{address.companyName}</p>
            )
          );
        })}
      </div>
      <div>
        load offloadingplace:
        {props.addresses.map((address) => {
          return (
            props.load.offloadingPlaceId === address.id && (
              <p key={address.id}>Cie Name :{address.companyName}</p>
            )
          );
        })}
      </div>
      <div>load id: {props.load.loadingDate}</div>
      <div>load id: {props.load.offloadingDate}</div>
      <div>load id: {props.load.reference}</div>
      <div>
        {props.trucks.map((truck) => {
          return (
            props.load.truckId === truck.id && (
              <p key={truck.id}>truck plate :{truck.truckPlate}</p>
            )
          );
        })}
      </div>
      <div>
        {props.trucks.map((truck) => {
          return (
            props.load.truckId === truck.id && (
              <p key={truck.id}>trailer plate :{truck.trailerPlate}</p>
            )
          );
        })}
      </div>
      <div>Pallet given: {props.load.palletQuantityGiven}</div>
      <div>Pal received: {props.load.palletQuantityReceived}</div>
      <div>
        <button>Add the pallet note</button>
      </div>

      <div>
        <Link href="/users/dashboard">
          <a>Back To thr dashboard -</a>
        </Link>{' '}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{ user?: User; session?: Session }>> {
  const loadId = context.query.loadId as string;

  const load = await getLoadById(parseInt(loadId));
  console.log('putin', load);
  const loadById = JSON.stringify(load);
  console.log('putin2', loadById);
  const parsedLoadById = JSON.parse(loadById);
  console.log('putin3', parsedLoadById);
  // const addressId = context.query.addressId;
  const trucks = await getAllTrucks();
  const addresses = await getAllAddresses();

  // User id is not correct type
  if (!loadId || Array.isArray(loadId)) {
    return { props: {} };
  }
  // if (!addressId || Array.isArray(addressId)) {
  //   return { props: {} };
  // }
  // if (!truckId || Array.isArray(truckId)) {
  //   return { props: {} };
  // }

  // const loadFromDatabase = await getLoadById(loadId);
  // const stringifyLoadFromdatabase = JSON.parse(
  //   JSON.stringify(loadFromDatabase),
  // );

  // const address = await getAdressById(parseInt(addressId));
  // const truck = await getTruckById(parseInt(truckId));

  if (!load) {
    return {
      // notFound: true, // also works, but generates a generic error page
      props: {
        error: 'Try again ',
      },
    };
  }
  // // 1. check if there is a token and is valid from the cookie
  // const token = context.req.cookies.sessionToken;

  // if (token) {
  //   // 2. check if the token is valid and redirect
  //   const session = await getValidSessionByToken(token);

  //   if (session) {
  //     console.log(session);
  //     return {
  //       props: { user: user, session: session },
  //     };
  //   }
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   };
  // }
  // // 3. Otherwise, generate CSRF token and render the page

  return {
    props: {
      load: parsedLoadById,
      addresses: addresses,
      trucks: trucks,
    },
  };
}
