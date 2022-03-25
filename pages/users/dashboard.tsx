import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Layout from '../../components/Layout';
import {
  getUserById,
  getUserByValidSessionToken,
  getValidSessionByToken,
  User,
  Load,
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
};

type CreateLoadResponseBody =
  | { errors: { message: string }[] }
  | { load: Load };

type Errors = { message: string }[];
// type Props = {loadsFromDatabase: Load[]}

export default function ProtectedDashboard(props: Props) {
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
  const [streetNumber, setStreetNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [country, setCountry] = useState('');
  const [streetNumber2, setStreetNumber2] = useState('');
  const [streetName2, setStreetName2] = useState('');
  const [zipcode2, setZipcode2] = useState('');
  const [country2, setCountry2] = useState('');
  const [errors, setErrors] = useState<Errors | undefined>([]);
  const [loadList, setLoadList] = useState<Load[]>(props.loadsFromDatabase);

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
              <p>{load.requestDate}</p>
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
          const createLoadResponse = await fetch('api/newLoad', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              requestDate: requestDate,
              load: props.load,
            }),
          });
          const createLoadResponseBody =
            (await createLoadResponse.json()) as DeleteLoadResponseBody;

          const createdLoad = [...loadList, createLoadResponseBody.load];
          console.log(createdLoad);
          setLoadList(createdLoad);

          setCompanyName1('');
          setCompanyName2('');
          setLoadingAddress('');
          setOffloadingAddress('');
          // setOffloadingDate();
          // setLoadingDate();
          setReference('');
          setPalletNumber('');
          setTruckPlate('');
          setTrailerPlate('');

          if ('errors' in createLoadResponseBody) {
            setErrors(createLoadResponseBody.errors);
            return;
          }
        }}
      >
        <div className={styles.col2}>
          <label>
            <FaWarehouse size={20} /> <br />
            Loading Place
            <input
              placeholder="Company Name"
              tabIndex={2}
              value={companyName1}
              onChange={(event) => setCompanyName1(event.target.value)}
            />
            <input
              placeholder="Street number"
              tabIndex={2}
              value={streetNumber}
              onChange={(event) => setStreetNumber(event.target.value)}
            />
            <input
              placeholder="Street"
              tabIndex={2}
              value={streetName}
              onChange={(event) => setStreetName(event.target.value)}
            />
            <input
              placeholder="Zipcode"
              tabIndex={2}
              value={zipcode}
              onChange={(event) => setZipcode(event.target.value)}
            />
            <input
              placeholder="Country"
              tabIndex={2}
              value={country}
              onChange={(event) => setCountry(event.target.value)}
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
            Offloading Place
            <input
              placeholder="Company Name"
              tabIndex={2}
              value={companyName2}
              onChange={(event) => setCompanyName2(event.target.value)}
            />
            <input
              placeholder="Street number"
              tabIndex={2}
              value={streetNumber2}
              onChange={(event) => setStreetNumber2(event.target.value)}
            />
            <input
              placeholder="Street"
              tabIndex={2}
              value={streetName2}
              onChange={(event) => setStreetName2(event.target.value)}
            />
            <input
              placeholder="Zipcode"
              tabIndex={2}
              value={zipcode2}
              onChange={(event) => setZipcode2(event.target.value)}
            />
            <input
              placeholder="Country"
              tabIndex={2}
              value={country2}
              onChange={(event) => setCountry2(event.target.value)}
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
