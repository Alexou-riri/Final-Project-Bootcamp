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

import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import {
  // Address,
  getAllAddresses,
  getAllTrucks,
  getLoadById,
} from '../../util/database';
// import { Session } from 'inspector';
import Head from 'next/head';
import Link from 'next/link';
import { FiTruck, FiArrowRightCircle } from 'react-icons/fi';
import { css } from '@emotion/react';

// type Errors = { message: string }[];
// type Props = {
//   userObject?: User;
//   userCompany?: string;
//   user: User;
//   loadsFromDatabase: Load[];
//   load: Load;
//   errors: { message: string }[];
//   // address: Address;
//   trucks: Truck[];
//   addresses: Address[];
// };

const image = css`
  /* display: flex; */
  border: solid 1.5em rgba(#000, 0.2);
  border-radius: 10px;
`;

const card = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  /* height: 60vh; */
`;

const img = css`
  filter: opacity(0.7);
  img {
    border-radius: 10px;
  }
`;
const loadId = css`
  /* position: flex;
  align-items: center;
  z-index: 2; */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;

  text-shadow: #fff 1px 0 10px;
`;

const idCard = css`
  position: relative;
  text-align: center;
  /* justify-content: center; */
`;

const tableau = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  gap: 160px;
  margin: 30px;
  border: 1px solid #00b8c2;
  background-color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 140px;
  font-family: 'Oxygen' Arial, sans-serif;
  font-weight: 600;
  font-size: 20px;
`;

const details = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* border: 1px solid green; */
  height: 60vh;
  width: 30vw;
`;
const titel = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
`;

const address = css`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  gap: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 30px;
`;

const truckRef = css`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  /* margin-top: 100px; */
  /* border: 1px solid black; */
`;

const ref = css`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  gap: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 30px;
`;

const truck = css`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  gap: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 30px;
`;

const load = css`
  display: flex;
  flex-direction: column;
  /* border: 1px solid black; */
  justify-content: center;
  align-items: center;
`;

const addresses = css`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  /* border: 1px solid black; */
`;

const given = css`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  border: 1px solid black;
  gap: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  width: fit-content;
  padding: 10px;
`;

const back = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  border: 1px solid black;

  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  width: fit-content;
  padding: 10px;
`;

const pallet = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  justify-content: space-around;
  /* margin-top: 100px; */
  /* border: 1px solid black; */
`;
const header = css`
  justify-content: center;
  align-items: center;

  width: 100%;
  h1 {
    display: flex;
    justify-content: center;
    margin-right: auto;
    /* border: 1px solid green; */
  }
  a {
    /* border: 1px solid green; */
    margin-left: auto;
    margin-right: 60px;
    display: flex;
    justify-content: space-between;

    width: 14%;
  }
`;
const link = css`
  color: #00b8c2;
  text-transform: uppercase;
  text-decoration: none;
  /* letter-spacing: 0.15em; */
  /* text-shadow: 1px 1px 1px black; */
  cursor: pointer;
  display: flex;
  justify-content: right;
  /* margin-right: 60px;
  width: 90vw; */
  padding-right: 15px 20px;
  /* border: 1px solid green; */
  /* margin-right: 60px; */
  /* margin-top: 100px; */
  /* padding: 15px 20px; */
  transition: 0.4s;
  &:hover {
    transform: scale(1.05);
  }
`;
const addDoc = css`
  display: flex;
  /* align-items: center; */
  justify-content: center;
  margin: auto;
  cursor: pointer;
  border: 0;
  border-radius: 4px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  /* margin: 0 10px; */
  width: 20%;
  padding: 10px 60px;
  box-shadow: 0 0 4px #00b8c2;
  transition: 0.4s;
  color: #00b8c2;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid #00b8c2;

  &:hover {
    /* color: white;
    box-shadow: 0 0 4px #00b8c2;
    background-color: #00b8c2; */
    transform: scale(1.05);
  }
`;

const button = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function SingleLoad(props) {
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
    <Layout userObject={props.userObject}>
      <Head>
        <title>WAMP? #{props.load.id}</title>
        <meta name="description" content={`Load # is `} />
      </Head>

      <div css={header}>
        <div css={titel}>
          <Link href="/users/dashboard">
            <a css={link}>
              Back To the dashboard <FiArrowRightCircle size={20} />
            </a>
          </Link>{' '}
        </div>
      </div>
      <div css={card}>
        <div css={tableau}>
          <div css={idCard}>
            <div css={img} id="bg">
              <img
                src="/pal_closeup.jpg"
                alt="Closeup of pallets"
                height={700}
                width={500}
                // css={image}
              />
            </div>
            <div css={loadId}> Load #{props.load.id}</div>
          </div>
          <div css={details}>
            <div css={addresses}>
              <div css={address}>
                <div>
                  {
                    (props.load.loadingDate = new Date(props.load.loadingDate)
                      .toISOString()
                      .split('T')[0])
                  }
                </div>
                <div css={load}>
                  {props.addresses.map((address) => {
                    return (
                      props.load.loadingPlaceId === address.id && (
                        <>
                          <td key={address.id}>{address.companyName}</td>
                          <td key={address.id}>{address.streetInfo}</td>
                          <td key={address.id}>{address.zipcode}</td>
                          <td key={address.id}>{address.city}</td>
                          <td key={address.id}>{address.country}</td>
                        </>
                      )
                    );
                  })}
                </div>
              </div>
              <div css={address}>
                <div>
                  {
                    (props.load.offloadingDate = new Date(
                      props.load.offloadingDate,
                    )
                      .toISOString()
                      .split('T')[0])
                  }
                </div>
                <div css={load}>
                  {props.addresses.map((address) => {
                    return (
                      props.load.offloadingPlaceId === address.id && (
                        <>
                          <td key={address.id}>{address.companyName}</td>
                          <td key={address.id}>{address.streetInfo}</td>
                          <td key={address.id}>{address.zipcode}</td>
                          <td key={address.id}>{address.city}</td>
                          <td key={address.id}>{address.country}</td>
                        </>
                      )
                    );
                  })}
                </div>
              </div>
            </div>
            <div css={truckRef}>
              <div css={ref}>ref{props.load.reference}</div>
              <div css={truck}>
                {props.trucks.map((truck) => {
                  return (
                    props.load.truckId === truck.id && (
                      <>
                        <td key={truck.id}>truck :{truck.truckPlate}</td>
                        <td key={truck.id}>trailer :{truck.trailerPlate}</td>
                      </>
                    )
                  );
                })}
              </div>
            </div>
            <div css={pallet}>
              <div css={given}>
                <p>Pallet given:</p> <p>{props.load.palletQuantityGiven}</p>
              </div>
              <div css={back}>
                <p> Pal received:</p>
                <p>
                  {' '}
                  {props.load.palletQuantityReceived !== null
                    ? props.load.palletQuantityReceived
                    : 'No information yet'}
                </p>
              </div>
            </div>
            <div css={button}>
              <button css={addDoc}>Add the pallet note</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // GetServerSidePropsContext,
  // ): Promise<GetServerSidePropsResult<{ user?: User; session?: Session }>> {
  const loadId = context.query.loadId;
  // as string;

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
        errors: 'Try again ',
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
