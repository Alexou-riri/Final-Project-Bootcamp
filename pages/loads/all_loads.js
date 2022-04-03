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
import { FaWarehouse } from 'react-icons/fa';
import { BiDetail } from 'react-icons/bi';
import { FiMinusCircle } from 'react-icons/fi';
import { IconContext } from 'react-icons';
// import { AiOutlineCalendar } from 'react-icons/ai';
// import { FaWarehouse, FaPallet } from 'react-icons/fa';
// import { BsTruck } from 'react-icons/bs';

import moment from 'moment';
moment().format();

import Head from 'next/head';
import { FaAddressBook } from 'react-icons/fa';

const loadPreview = css`
  margin-top: 30px;
  margin: 100px;
`;
const link = css`
  color: #00b8c2;
  text-transform: uppercase;
  text-decoration: none;
  /* letter-spacing: 0.15em; */
  /* text-shadow: 1px 1px 1px black; */
  cursor: pointer;
  display: flex;
  /* margin-top: 100px; */
  padding: 15px 20px;
  transition: 0.4s;
  &:hover {
    transform: scale(1.1);
  }
`;
const details = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const eachLoad = css`
  display: flex;
  flex-direction: row;
  gap: 20px;
  border: 1px solid #00b8c2;
  margin-top: 30px;
  margin-bottom: 30px;
  background-color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 40px;
  font-family: 'Oxygen' Arial, sans-serif;
  font-weight: 600;
  align-items: center;
  justify-content: space-evenly;
`;

const pal = css`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  margin-left: 60px;
  margin-right: 60px;
  gap: 20px;
`;

const given = css`
  margin-left: 50px;
`;

const titel = css`
  display: flex;
  justify-content: center;
`;
const image = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: auto;
  margin-top: 60px;
  /* border: 1px solid red; */
`;

const button = css`
  cursor: pointer;
  border: 0;
  border-radius: 4px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0 10px;
  width: 100px;
  padding: 10px 30px;
  box-shadow: 0 0 4px #00b8c2;
  transition: 0.4s;
  color: #00b8c2;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid #00b8c2;

  &:hover {
    transform: scale(1.25);
  }
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
    <Layout userObject={props.userObject}>
      <h1 css={titel}>All loads done in the past</h1>
      <img css={image} src="/chore.svg" alt="loads finished" height={300} />
      <div css={loadPreview}>
        {loadList
          .filter((load) => load.palletQuantityReceived !== null)
          .map((load) => {
            // console.log(props.load, 'iiiiiiiiii');

            return (
              <>
                <div key={load.id} css={eachLoad}>
                  <div>
                    {props.addresses.map((address) => {
                      return (
                        load.loadingPlaceId === address.id && (
                          <>
                            <div>
                              {
                                (load.loadingDate = new Date(load.loadingDate)
                                  .toISOString()
                                  .split('T')[0])
                              }
                            </div>
                            <div key={address.id}>
                              {' '}
                              <FaWarehouse size={20} /> {address.companyName}
                            </div>
                          </>
                        )
                      );
                    })}
                    <p>To</p>
                    {props.addresses.map((address) => {
                      return (
                        load.offloadingPlaceId === address.id && (
                          <>
                            <div>
                              {
                                (load.offloadingDate = new Date(
                                  load.offloadingDate,
                                )
                                  .toISOString()
                                  .split('T')[0])
                              }
                            </div>
                            <div key={address.id}>
                              {' '}
                              <FaWarehouse size={20} /> {address.companyName}
                            </div>
                          </>
                        )
                      );
                    })}
                  </div>
                  <div css={pal}>
                    <div>
                      Pallets given:
                      <span css={given}>{load.palletQuantityGiven} </span>
                    </div>
                    <div>
                      Pallets received:
                      <span css={given}>{load.palletQuantityReceived} </span>
                    </div>
                  </div>

                  <div>
                    {load.palletQuantityReceived != load.palletQuantityGiven ? (
                      <p>NOPE ❌ </p>
                    ) : (
                      <p>YEP ✅</p>
                    )}
                  </div>
                  {/* <button onClick={() => deleteLoad(load.id).catch(() => {})}>
                    Delete the load
                  </button> */}
                  <div css={details}>
                    <Link href={`/loads/${load.id}`}>
                      <a css={link}>To the load's details</a>
                    </Link>
                    <BiDetail size={30} />
                  </div>
                </div>
              </>
            );
          })}
      </div>

      <Link href="/users/dashboard">
        <a css={button}>Back to the dashboard</a>
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
