import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Layout from '../../components/Layout';
import {
  getUserById,
  getUserByValidSessionToken,
  getValidSessionByToken,
  getAllAddresses,
  User,
  Load,
  Address,
  Truck,
  getAllTrucks,
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

// import { CreateAddressResponseBody } from '../api/addresse';

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
  address: Address;
  truck: Truck;
};

type CreateLoadResponseBody =
  | { errors: { message: string }[] }
  | { load: Load };

type CreateAddressResponseBody =
  | { errors: { message: string }[] }
  | { address: Address };

type CreateTruckResponseBody =
  | { errors: { message: string }[] }
  | { truck: Truck };

type Errors = { message: string }[];
// type Props = {loadsFromDatabase: Load[]}

export default function ProtectedDashboard(props: Props) {
  const [loadingDate, setLoadingDate] = useState(new Date());
  const [offloadingDate, setOffloadingDate] = useState(new Date());
  const [loadingAddress, setLoadingAddress] = useState('');
  const [offloadingAddress, setOffloadingAddress] = useState('');
  const [loadingCompanyName, setLoadingCompanyName] = useState('');
  const [offloadingCompanyName, setOfflloadingCompanyName] = useState('');
  const [reference, setReference] = useState('');
  const [truckPlate, setTruckPlate] = useState('');
  const [trailerPlate, setTrailerPlate] = useState('');
  const [palletNumber, setPalletNumber] = useState('');

  const [loadingStreetInfo, setLoadingStreetInfo] = useState('');
  const [loadingZipcode, setLoadingZipcode] = useState('');
  const [loadingCountry, setLoadingCountry] = useState('');
  const [loadingCity, setLoadingCity] = useState('');
  const [offloadingCity, setOffloadingCity] = useState('');

  const [offlloadingStreetInfo, setOffloadingStreetInfo] = useState('');
  const [offloadingZipcode, setOffloadingZipcode] = useState('');
  const [offloadingCountry, setOffloadingCountry] = useState('');
  const [errors, setErrors] = useState<Errors | undefined>([]);
  const [loadList, setLoadList] = useState<Load[]>(props.loadsFromDatabase);
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [truckList, setTruckList] = useState<Truck[]>([]);

  if ('error' in props) {
    return (
      <main>
        <p>{props.errors}</p>
      </main>
    );
  }

  async function deleteLoad(id: number) {
    const deleteResponse = await fetch(`/api/newLoad`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loadId: id,
        load: props.load,
      }),
    });
    const deleteLoadResponseBody =
      (await deleteResponse.json()) as DeleteLoadResponseBody;

    if ('error' in deleteLoadResponseBody) {
      setErrors(deleteLoadResponseBody.errors);
      return;
    }

    const newLoadList = loadList.filter((load) => {
      return deleteLoadResponseBody.load.loadId !== load.loadId;
    });

    setLoadList(newLoadList);
  }

  return (
    <Layout {...props.userObject}>
      <h1> Dashboard of {props.user.company} </h1>

      <h2>Here are the last loads entered:</h2>
      {/* {props.loadsFromDatabase.map((load: Load) => {
        return (
          <div>
            <div>

              <button
                onClick={() => {
                  deleteLoad(load.loadId).catch(() => {});
                }}
              >
                Dont follow this load anymore
              </button>
            </div>
             <div data-test-id="product-quantity">
              <button css={button} onClick={() => addProduct(props.house.id)}>
                Buy one more
              </button>
              <div css={qtte}>{currentHouseObject.items}</div>
              <button css={button} onClick={() => removeProduct()}>
                too many?
              </button>
            </div>
          </div>
        );
      })} */}

      <form
        className={styles.form}
        onSubmit={async (event) => {
          event.preventDefault();
          console.log('blablabla');

          const createLoadResponse = await fetch(
            `http://localhost:3000/api/newLoad`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                address: {
                  companyName: loadingCompanyName,
                  companyName2: offloadingCompanyName,
                  streetInfo: loadingStreetInfo,
                  streetInfo2: offlloadingStreetInfo,
                  zipcode: loadingZipcode,
                  zipcode2: offloadingZipcode,
                  city: loadingCity,
                  city2: offloadingCity,
                  country: loadingCountry,
                  country2: offloadingCountry,
                },
                // truck: {
                //   truckPlate: truckPlate,
                //   trailerPlate: trailerPlate,
                // },
                // load: {
                //   // loadingAddress: address,
                // },
              }),
            },
          );
          console.log('prouttttt');
          const createLoadResponseBody = await createLoadResponse.json();
          console.log('presque');
          if ('errors' in createLoadResponseBody) {
            setErrors(createLoadResponseBody.errors);
            return;
          }

          const createdLoad = [...loadList, createLoadResponseBody.load];
          console.log(createdLoad);
          setLoadList(createdLoad);

          // setCompanyName1('');
          // setCompanyName2('');
          // setLoadingAddress('');
          // setOffloadingAddress('');
          // // setOffloadingDate();
          // // setLoadingDate();
          // setReference('');
          // setPalletNumber('');
          // setTruckPlate('');
          // setTrailerPlate('');
        }}
      >
        <div className={styles.col2}>
          <label>
            <FaWarehouse size={20} /> <br />
            Loading Place
            <input
              placeholder="Company Name"
              tabIndex={2}
              value={loadingCompanyName}
              onChange={(event) => {
                setLoadingCompanyName(event.target.value);
                // console.log('prout')
              }}
            />
            <input
              placeholder="Street"
              tabIndex={2}
              value={loadingStreetInfo}
              onChange={(event) => {
                setLoadingStreetInfo(event.target.value);
                // console.log('prouttttt');
              }}
            />
            <input
              placeholder="Zipcode"
              tabIndex={2}
              value={loadingZipcode}
              onChange={(event) => {
                setLoadingZipcode(event.target.value);
                console.log(typeof loadingZipcode);
              }}
            />
            <input
              placeholder="City"
              tabIndex={2}
              value={loadingCity}
              onChange={(event) => {
                setLoadingCity(event.target.value);
              }}
            />
            <input
              placeholder="Country"
              tabIndex={2}
              value={loadingCountry}
              onChange={(event) => {
                setLoadingCountry(event.target.value);
                console.log(typeof loadingCountry);
              }}
            />
          </label>
        </div>
        <div className={styles.col2}>
          <label>
            <AiOutlineCalendar size={20} /> Loading Date:
            <DatePicker
              selected={loadingDate}
              onChange={(date: Date) => setLoadingDate(date)}
              dateFormat="dd/MM/yyyy"
              withPortal
            />
          </label>
        </div>
        <div className={styles.col2}>
          <label>
            <FaWarehouse size={20} />
            <br />
            Offloading Place
            <input
              placeholder="Company Name"
              tabIndex={2}
              value={offloadingCompanyName}
              onChange={(event) =>
                setOfflloadingCompanyName(event.target.value)
              }
            />
            <input
              placeholder="Street"
              tabIndex={2}
              value={offlloadingStreetInfo}
              onChange={(event) => setOffloadingStreetInfo(event.target.value)}
            />
            <input
              placeholder="Zipcode"
              tabIndex={2}
              value={offloadingZipcode}
              onChange={(event) => setOffloadingZipcode(event.target.value)}
            />
            <input
              placeholder="City"
              tabIndex={2}
              value={offloadingCity}
              onChange={(event) => setOffloadingCity(event.target.value)}
            />
            <input
              placeholder="Country"
              tabIndex={2}
              value={offloadingCountry}
              onChange={(event) => setOffloadingCountry(event.target.value)}
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
              value={reference}
              onChange={(event) => setReference(event.target.value)}
            />
          </label>
        </div>
        <div className={styles.col3}>
          <label>
            <BsTruck size={20} /> Truck Number
            <input
              placeholder="Which truck is going to do this load"
              tabIndex={4}
              value={truckPlate}
              onChange={(event) => setTruckPlate(event.target.value)}
            />
            <input
              placeholder="Which truck is going to do this load"
              tabIndex={4}
              value={trailerPlate}
              onChange={(event) => setTrailerPlate(event.target.value)}
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
              value={palletNumber}
              onChange={(event) => setPalletNumber(event.target.value)}
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
  const load = await getAllAddresses();
  const truck = await getAllTrucks();
  const address = await getAllAddresses();

  if (!session) {
    return {
      props: {
        error: 'You are not allowed to see this page',
      },
    };
  }
  if (!user) {
    return {
      props: {
        error: 'You are not logged in',
      },
    };
  }

  if (user) {
    console.log(user);
    return {
      props: { user: user, load: load, truck: truck, address: address },
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
