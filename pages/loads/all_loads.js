import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Layout from '../../components/Layout';
import {
  // getUserById,
  getUserByValidSessionToken,
  getValidSessionByToken,
  getAllAddresses,
  getLoads,
  // deleteLoad,
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

import moment from 'moment';
moment().format();

import Head from 'next/head';
import { FaAddressBook } from 'react-icons/fa';

const loadPreview = css`
  display: flex;
  flex-direction: row;
  border: 1px solid black;
`;

// type Props = {
//   user: User;
// };
// type Props = {
//   userObject?: User,
//   userCompany?: string,
//   user: User,
//   loadsFromDatabase: Load[],
//   load: Load,
//   errors?: string,
//   truck: Truck,
//   address: Address,
//   loads: Load,
//   palletQuantityReceived: Number,
// };

// type CreateLoadResponseBody =
//   | { errors: { message: string }[] }
//   | { load: Load }
//   | { truck: Truck };

// type Errors = { message: string }[];
// type Props = {loadsFromDatabase: Load[]}

export default function AllLoads(props) {
  // const [loadingDate, setLoadingDate] = useState(new Date());
  // const [offloadingDate, setOffloadingDate] = useState(new Date());
  // const [loadingAddress, setLoadingAddress] = useState('');
  // const [offloadingAddress, setOffloadingAddress] = useState('');
  // const [loadingCompanyName, setLoadingCompanyName] = useState('');
  // const [offloadingCompanyName, setOfflloadingCompanyName] = useState('');
  const [reference, setReference] = useState('');
  const [truckPlate, setTruckPlate] = useState('');
  const [trailerPlate, setTrailerPlate] = useState('');
  const [palletQuantityGiven, setPalletQuantityGiven] = useState(
    props.load.palletQuantityGiven,
  );
  const [palletQuantityReceived, setPalletQuantityReceived] = useState(
    props.load.palletQuantityReceived,
  );

  // const [loadingStreetInfo, setLoadingStreetInfo] = useState('');
  // const [loadingZipcode, setLoadingZipcode] = useState('');
  // const [loadingCountry, setLoadingCountry] = useState('');
  // const [loadingCity, setLoadingCity] = useState('');
  // const [offloadingCity, setOffloadingCity] = useState('');

  // const [offlloadingStreetInfo, setOffloadingStreetInfo] = useState('');
  const [offloadingZipcode, setOffloadingZipcode] = useState('');
  const [offloadingCountry, setOffloadingCountry] = useState('');
  const [errors, setErrors] = useState();
  const [loadList, setLoadList] = useState(props.loads);
  // const [addressList, setAddressList] = useState([]);
  // const [truckList, setTruckList] = useState<Truck[]>([]);
  // const [difference , setDifference] = useState(props.load.palletQuantityGiven)

  const difference =
    Number(props.load.palletQuantityGiven) -
    Number(props.load.palletQuantityReceived);
  console.log('not a number??', typeof difference);
  // type number\\

  async function deleteLoad(id) {
    const deleteResponse = await fetch(`/api/newLoad`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loadId: id,
        // loads: props.load,
      }),
    });
    const deleteResponseBody = await deleteResponse.json();
    // as DeleteLoadResponseBody;

    if ('error' in deleteResponseBody) {
      setErrors(deleteResponseBody.errors);
      return;
    }
    console.log('fproutprout', deleteResponseBody);

    const newLoadList = loadList.filter((load) => {
      return deleteResponseBody.load.id !== load.id;
    });

    setLoadList(newLoadList);
  }

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
  console.log(palletQuantityReceived);
  return (
    <Layout>
      <h1>All loads done in the past</h1>
      {/* map all loads */}
      {loadList.map((load) => {
        // console.log(props.load, 'iiiiiiiiii');

        return (
          <>
            <div key={load.id} css={loadPreview}>
              <div>{load.loadingDate}</div>
              <br />
              <div>{load.offloadingDate}</div>

              <div>
                {props.addresses.map((address) => {
                  return (
                    load.loadingPlaceId === address.id && (
                      <div key={address.id}>
                        Cie Name :{address.companyName}
                      </div>
                    )
                  );
                })}

                {props.addresses.map((address) => {
                  return (
                    load.offloadingPlaceId === address.id && (
                      <div key={address.id}>
                        Cie Name22 :{address.companyName}
                      </div>
                    )
                  );
                })}
              </div>

              <div>Pal Given :{load.palletQuantityGiven} </div>
              <div>Pal Received :{load.palletQuantityReceived} </div>
              <div>
                {load.palletQuantityReceived != load.palletQuantityGiven ? (
                  <p>NOPE ❌ </p>
                ) : (
                  <p>YEP ✅</p>
                )}
              </div>
              <button onClick={() => deleteLoad(load.id).catch(() => {})}>
                Delete the load
              </button>
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

export async function getServerSideProps(
  context,
  // : GetServerSidePropsContext
) {
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
  const addresses = await getAllAddresses();
  // loads array beau mais typeof objet\\
  console.log('not a number??', loads);
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
      props: {
        user: user,
        load: stringifyLoadsFromDatabase,
        loads: loads,
        addresses: addresses,
      },
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
