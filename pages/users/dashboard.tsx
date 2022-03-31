import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Layout from '../../components/Layout';
import {
  // getUserById,
  getUserByValidSessionToken,
  getValidSessionByToken,
  getAllAddresses,
  getLoads,
  User,
  Load,
  Address,
  Truck,
  // getAllTrucks,
  // getLoadById,
  // deleteLoad,
} from '../../util/database';
import { deleteLoad } from '../api/newLoad';
import styles from './dashboard.module.css';
import { css } from '@emotion/react';
import { useState } from 'react';
// import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Link from 'next/link';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaWarehouse, FaPallet } from 'react-icons/fa';
import { BsTruck } from 'react-icons/bs';
import router from 'next/router';
import id from 'date-fns/esm/locale/id/index.js';
// import moment from 'moment';
// moment().format();
// import format from 'date-fns/format';
// import { stringify } from 'querystring';

const loadPreview = css`
  display: flex;
  flex-direction: row;
  border: 1px solid red;
`;

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
  // address: Address;
  truck: Truck;
  loads: Load;
  addresses: Address[];
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
  const [loadingCompanyName, setLoadingCompanyName] = useState('');
  const [offloadingCompanyName, setOfflloadingCompanyName] = useState('');
  const [reference, setReference] = useState('');
  const [truckPlate, setTruckPlate] = useState('');
  const [trailerPlate, setTrailerPlate] = useState('');
  const [palletQuantityGiven, setPalletQuantityGiven] = useState<Number>();

  const [loadingStreetInfo, setLoadingStreetInfo] = useState('');
  const [loadingZipcode, setLoadingZipcode] = useState('');
  const [loadingCountry, setLoadingCountry] = useState('');
  const [loadingCity, setLoadingCity] = useState('');
  const [offloadingCity, setOffloadingCity] = useState('');

  const [offlloadingStreetInfo, setOffloadingStreetInfo] = useState('');
  const [offloadingZipcode, setOffloadingZipcode] = useState('');
  const [offloadingCountry, setOffloadingCountry] = useState('');
  const [errors, setErrors] = useState<Errors | undefined>([]);
  const [loadList, setLoadList] = useState<Load[]>(props.loads);
  // const [addressList, setAddressList] = useState<Address[]>([]);
  // const [truckList, setTruckList] = useState<Truck[]>([]);
  const [palletReceivedOnEdit, setPalletReceivedOnEdit] = useState<Number>();
  const [palletQuantityReceived, setPalletQuantityReceived] =
    useState<Number>();
  const [idEditLoadId, setOnEditLoadId] = useState();

  if ('error' in props) {
    return (
      <main>
        <p>{props.errors}</p>
      </main>
    );
  }

  async function updateLoad(id: Number) {
    const updateResponse = await fetch(`/api/pallets`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loadId: id,
        palletQuantityReceived: palletQuantityReceived,
      }),
    });
    const updatedLoadPallet = await updateResponse.json();

    const updatedLoad = loadList.map((load) => {
      if (load.id === updatedLoadPallet.id) {
        return updatedLoadPallet;
      } else {
        return load;
      }
    });

    setLoadList(updatedLoad);
  }

  async function deleteLoad(id: number) {
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
    const deleteResponseBody =
      (await deleteResponse.json()) as DeleteLoadResponseBody;

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

  // useEffect(() => {
  //   const getLoads = async () => {
  //     const response = await fetch('/api/animals');
  //     const animalArray = await response.json();
  //     setAnimals(animalArray);
  //   };

  //   getAnimals().catch(() => {});
  // }, []);

  // console.log(JSON.parse(props.load));
  // console.log('addddd', props.addresses);
  return (
    <Layout {...props.userObject}>
      <h1> Dashboard of {props.user.company} </h1>
      {/* <div>{props.load}</div> */}
      <h2>Pallet count:</h2>
      <div></div>
      <h2>Here are the last loads entered:</h2>

      <div>
        {loadList.map((load) => {
          const isDisabled = idEditLoadId !== load.id;
          // console.log(props.loads, 'iiiiiiiiii');
          // for (let i = 0; i <= 5; i++) {
          return (
            <>
              <div key={load.id} css={loadPreview}>
                <div>{load.loadingDate} Loading date</div>
                <div>{load.reference} ref</div>

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
                <div>pal nbr given{load.palletQuantityGiven} </div>
                <label>
                  pal nbr back :
                  <input
                    type="number"
                    onChange={(event) =>
                      setPalletQuantityReceived(event.currentTarget.value)
                    }
                    value={
                      isDisabled
                        ? load.palletQuantityReceived
                        : palletReceivedOnEdit
                    }
                    disabled={isDisabled}
                  ></input>
                </label>
                {isDisabled ? (
                  <button
                    onClick={() => {
                      setOnEditLoadId(load.id);
                      setPalletReceivedOnEdit(load.palletQuantityReceived);
                    }}
                  >
                    Add a quantity of pallet received from offloading place
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateLoad(load.id).catch(() => {});
                      setOnEditLoadId(undefined);
                    }}
                  >
                    Save
                  </button>
                )}

                <button onClick={() => deleteLoad(load.id).catch(() => {})}>
                  Delete the load
                </button>
                <Link href={`/loads/${load.id}`}>To the load's details</Link>
              </div>
            </>
          );
        })}
      </div>
      {/*
            </div>
            {/* <div data-test-id="product-quantity">
              <button css={button} onClick={() => addProduct(props.house.id)}>
                Buy one more
              </button>
              <div css={qtte}>{currentHouseObject.items}</div>
              <button css={button} onClick={() => removeProduct()}>
                too many?
              </button>
            </div> */}
      {/* );
      })} */}
      <div>{/* <p>{props.load}</p> */}</div>
      <form
        className={styles.form}
        onSubmit={async (event) => {
          event.preventDefault();
          // console.log('blablabla');

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
                truck: {
                  truckPlate: truckPlate,
                  trailerPlate: trailerPlate,
                },
                load: {
                  loadingDate: loadingDate,
                  offloadingDate: offloadingDate,
                  reference: reference,
                  palletQuantityGiven: Number(palletQuantityGiven),
                  // palletQuantityrReceived: null,
                  // documentId: null,
                },
              }),
            },
          );
          // Number(palletQuantityGiven);
          console.log('prouttttt');
          const createLoadResponseBody = await createLoadResponse.json();
          console.log('presque');
          if ('errors' in createLoadResponseBody) {
            setErrors(createLoadResponseBody.errors);
            return;
          }
          setLoadList([...loadList, createLoadResponseBody]);
          console.log(setLoadList, 'liste');
          // const createdLoad = [...loadList, createLoadResponseBody.load];
          // console.log(createdLoad);
          // setLoadList(createdLoad);

          setLoadingCompanyName('');
          // setCompanyName2('');
          // setLoadingAddress('');
          // setOffloadingAddress('');
          // // setOffloadingDate();
          // // setLoadingDate();
          // setReference('');
          // setPalletNumber('');
          // setTruckPlate('');
          // setTrailerPlate('');
          // router.push(`../loads/${props.loadId}`);
          await router.push(`/loads/${createLoadResponseBody.load.id}`);
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
            {/* <DatePicker
              selected={loadingDate}
              onChange={(date: Date) => {
                // new Date(loadingDate).toISOString().split('T')[0];

                const datee = loadingDate;
                let loadingDateToString = datee.toDateString().split('T')[0];

                setLoadingDate(loadingDateToString);

                console.log(loadingDateToString, 'dateenstrig');
              }}
              dateFormat="dd/MM/yyyy"
              withPortal
              // moment(date).format("YYYY-MM-DD")
              // moment().subtract(10, 'days').calendar();
              // const expensesCurrentYearDateToString = JSON.parse(
              //   JSON.stringify(expensesCurrentYear),
              // );
              // <DatePicker selected={this.state.startDate} onChange={(date)=>this.handleChange(format(date, "yyyy/MM/dd", { awareOfUnicodeTokens: true }))} dateFormat="yyyy/MM/dd" />
            /> */}
            <input
              data-cy="event-start-date"
              required
              type="date"
              placeholder="dd/mm/yyyy"
              value={loadingDate}
              onChange={(event) => {
                setLoadingDate(event.currentTarget.value);
                console.log(setLoadingDate, 'PUTIN');
              }}
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
            {/* <DatePicker
              selected={offloadingDate}
              onChange={(offloadingDate: Date) =>
                setOffloadingDate(offloadingDate)
              }
              dateFormat="dd/MM/yyyy"
              withPortal
            /> */}
            <input
              data-cy="event-start-date"
              required
              type="date"
              placeholder="dd/mm/yyyy"
              value={offloadingDate}
              onChange={(event) => {
                setOffloadingDate(event.currentTarget.value);
              }}
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
              value={palletQuantityGiven}
              onChange={(event) => {
                {
                  setPalletQuantityGiven(Number(event.target.value));
                }
                console.log(typeof palletQuantityGiven, 'gdgds');
              }}
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
  const loadsFromDatabase = await getLoads();
  // loadsFromDatabase est un array de objet moche, mais typeof dit object\\
  const stringifyLoadsFromDatabase = JSON.stringify(loadsFromDatabase);
  // stringifyLoadsfromDB arra de object mais typeof string\\
  const loads = JSON.parse(stringifyLoadsFromDatabase);
  // loads array beau mais typeof objet\\

  // console.log(stringifyLoadsFromDatabase, 'iiii');
  // console.log(Array.isArray(loads));

  // const resultLoad = Object.keys(loads).map((key) => {
  //   return { [key]: loads[key as keyof typeof loads] };
  // });

  // console.log(typeof loads, 'ntm');

  // const loads = await getLoadById(loadId);

  // console.log(loads, 'iii');
  // const truck = await getAllTrucks();
  const addresses = await getAllAddresses();
  // console.log('adressedsamere', addresses);

  // To avoid issue with serializing object
  // const loadingDateToString = JSON.parse(JSON.stringify(loadingDate));
  // const loadingDate = JSON.parse(JSON.stringify(date));

  // const loads = await getLoads();

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
      props: {
        user: user,
        load: stringifyLoadsFromDatabase,
        loads: loads,

        // loads: loads,
        // loads: loads,

        // truck: truck,
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
