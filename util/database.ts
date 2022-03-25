import { config } from 'dotenv-safe';
import postgres from 'postgres';
import camelcaseKeys from 'camelcase-keys';

config();

// declare module globalThis {
//   let postgresSqlClient: ReturnType<typeof postgres> | undefined;
// }
// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
// function connectOneTimeToDatabase() {
//   // let sql;

//   // if(process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
//   //   sql =postgres();
//   //   sql = postgres({ssl: { reject}})
//   // }
//   // connect only once to the databse
//   if (!globalThis.postgresSqlClient) {
//     globalThis.postgresSqlClient = postgres();
//   }
//   const sql = globalThis.postgresSqlClient;

//   return sql;
// }

// Connect to PostgreSQL
// const sql = connectOneTimeToDatabase();

const sql = postgres();

// USER FUNCTIONS  \\

export type User = {
  id: number;
  company: string;
  permissionId: number;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export async function getUserById(id: number) {
  const [user] = await sql<[User | undefined]>`
    SELECT id,
    company
    from
    users
    where id = ${id}
    `;
  return user && camelcaseKeys(user);
}

export async function getUserByValidSessionToken(token: string | undefined) {
  if (!token) return undefined;
  const [user] = await sql<[User | undefined]>`
    SELECT
      users.id,
      users.company,
      users.user_permission_id
    FROM
      users,
      sessions,
      user_permission
    WHERE
      sessions.token = ${token} AND
      sessions.user_id = users.id AND
      users.user_permission_id = user_permission.id AND
      sessions.expiry_timestamp > now()
  `;
  return user && camelcaseKeys(user);
}
// check if usrrname alrready exists in database
export async function getUserByUsername(company: string) {
  const [user] = await sql<[{ id: number } | undefined]>`
    SELECT id from users where company = ${company}
    `;
  return user && camelcaseKeys(user);
}
export async function getUserWithPasswordHashByUsername(company: string) {
  const [user] = await sql<[UserWithPasswordHash | undefined]>`
    SELECT id,
    company,
    password_hash
    from
    users
    where company = ${company}
    `;
  return user && camelcaseKeys(user);
}

export async function createUser(
  company: string,
  passwordHash: string,
  userPermission: number,
) {
  const [user] = await sql<[User]>`
    INSERT INTO users
      (company, password_hash, user_permission_id)
    VALUES
      ( ${company}, ${passwordHash}, ${userPermission})
    RETURNING
      id,
      company,
      user_permission_id
  `;
  return camelcaseKeys(user);
}

// SESSION FUNCTION \\

export type Session = {
  id: number;
  token: string;
  userId: number;
};

export async function createSession(token: string, userId: number) {
  const [session] = await sql<[Session]>`
    INSERT INTO sessions
      (token, user_id)
    VALUES
      (${token}, ${userId})
    RETURNING
      id,
      token
  `;
  await deleteExpiredSessions();

  return camelcaseKeys(session);
}

export async function deleteSessionByToken(token: string) {
  const [session] = await sql<[Session | undefined]>`
    DELETE FROM
      sessions
    WHERE
      token = ${token}
    RETURNING *
  `;
  return session && camelcaseKeys(session);
}

export async function deleteExpiredSessions() {
  const sessions = await sql<Session[]>`
    DELETE FROM
      sessions
    WHERE
      expiry_timestamp < NOW()
    RETURNING *
  `;

  return sessions.map((session) => camelcaseKeys(session));
}

export async function getValidSessionByToken(token: string) {
  const [session] = await sql<[Session | undefined]>`
    SELECT
    *
    from
    sessions
    where
    token = ${token} AND
    expiry_timestamp > now()
    `;

  await deleteExpiredSessions();
  return session && camelcaseKeys(session);
}

// LOAD FUNCTION \\

export type Load = {
  loadId: number;
  palletQuantityGiven: number;
  palletQuantityReceived?: number;
  loadingPlaceId: number;
  offloadingPlaceId: number;
  truckId: number;
  reference: string;
  loadingDate: Date;
  offloadingDate: Date;
  requestDate: Date;
  documentId?: number;
  userId: number;
};
export async function createNewLoad(
  palletQuantityGiven: number,
  loadingPlaceId: number,
  offloadingPlaceId: number,
  truckId: number,
  reference: string,
  loadingDate: Date,
  offloadingDate: Date,
  requestDate: Date,
  userId: number,
) {
  const [load] = await sql<[Load]>`
  INSERT INTO loads
    (pallet_quantity_given, loading_place_id, offloading_place_id, truck_id, reference, loading_date, offloading_date, request_date, user_id)
  VALUES
    ( ${palletQuantityGiven}, ${loadingPlaceId},${offloadingPlaceId},${truckId},${reference},${loadingDate},${offloadingDate}, ${requestDate}, ${userId})
  RETURNING
    id,
    pallet_quantity_given,
    pallet_quantity_received,
    loading_place_id,
    offloading_place_id,
    truck_id,
    reference,
    loading_date,
    offloading_date,
    request_date,
    document_id,
    user_id)
`;
  return camelcaseKeys(load);
}

export async function deleteLoad(id: number) {
  const deletedLoad = await sql<[Load]>`
    DELETE FROM
    loads
    WHERE
    id = ${id}
    RETURNING
  *
  `;
  return deletedLoad.map((load) => camelcaseKeys(load));
}

export async function getAllInfoFromLoad(loadId: number) {
  const allInfoFromLoad = await sql<[Load]>`
    SELECT
    *
    FROM
    loads,
    addresses,
    trucks
    WHERE
    loads.loading_place_id = addresses.id AND
    loads.offloading_place_id = addresses.id AND
    loads.truck_id = trucks.id AND
    loads.user_id = user_id
  `;
  return allInfoFromLoad && camelcaseKeys(allInfoFromLoad);
}

// ADDRESS FUNCTION \\

export type Address = {
  addressId: number;
  streetNumber: number;
  streetName: string;
  zipcode: string;
  country: string;
  companyName: string;
};

export async function createAddress(
  streetNumber: number,
  streetName: string,
  zipcode: string,
  country: string,
  companyName: string,
) {
  const [address] = await sql<[Address]>`
 INSERT INTO addresses
 (street_number, street_name, zipcode, country, company_name)
 VALUES
 (${streetNumber}, ${streetName}, ${zipcode}, ${country}, ${companyName})
 RETURNING *
 `;
  return address && camelcaseKeys(address);
}

export async function getAllAdresses() {
  const expenses = await sql<Address[]>`
  SELECT * FROM addresses ;

`;
  return expenses.map((address: Address) => camelcaseKeys(address));
}

// TRUCK FUNCTION \\

export type Truck = {
  truckId: number;
  truckPlate: string;
  trailerPlate: string;
};
export async function CreateTruck(truckPlate: string, trailerPlate: string) {
  const [truck] = await sql<[Truck]>`
  INSERT INTO trucks
  (truck_plate, trailer_plate)
  VALUES
  (${truckPlate}, ${trailerPlate} )
  RETURNING *
  `;
  return truck && camelcaseKeys(truck);
}

export async function getAllTrucks() {
  const expenses = await sql<Truck[]>`
  SELECT * FROM trucks ;

`;
  return expenses.map((truck: Truck) => camelcaseKeys(truck));
}
