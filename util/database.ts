import { config } from 'dotenv-safe';
import postgres from 'postgres';
import camelcaseKeys from 'camelcase-keys';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku.js';

setPostgresDefaultsOnHeroku();

config();

declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}
// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    sql = postgres();
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    // connect only once to the databse
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }

  return sql;
}

// Connect to PostgreSQL
const sql = connectOneTimeToDatabase();

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
  id: number;
  loadingPlaceId: number;
  offloadingPlaceId: number;
  loadingDate: Date;
  offloadingDate: Date;
  reference: string;
  truckId: number;
  palletQuantityGiven: number;
  palletQuantityReceived: number | null;
  documentId: number | null;
  userId: number;
};
export async function createNewLoad(
  loadingPlaceId: number,
  offloadingPlaceId: number,
  loadingDate: Date,
  offloadingDate: Date,
  reference: string,
  truckId: number,
  palletQuantityGiven: number,
  palletQuantityReceived: number | null,
  documentId: number | null,
  // userId: number,
) {
  console.log('verif load');
  const [load] = await sql<[Load]>`
  INSERT INTO loads
    (loading_place_id, offloading_place_id, loading_date, offloading_date, reference, truck_id, pallet_quantity_given,
     pallet_quantity_received, document_id
      -- user_id
      )
  VALUES
    (${loadingPlaceId}, ${offloadingPlaceId}, ${loadingDate},${offloadingDate}, ${reference},${truckId}, ${palletQuantityGiven},${palletQuantityReceived}, ${documentId}

    )
  RETURNING
    *
`;
  console.log('verif load2');
  return load && camelcaseKeys(load);
}

export async function getLoads() {
  const loads = await sql<Load[]>`
    SELECT * FROM loads;
  `;
  return loads.map((load) => camelcaseKeys(load));
}

export async function getLoadById(loadId: number) {
  const [loadById] = await sql<[Load]>`
    SELECT * FROM loads WHERE id = ${loadId};
  `;

  return loadById && camelcaseKeys(loadById);
}

export async function deleteLoad(loadId: number) {
  const [load] =
    //  [load]
    await sql<[Load]>`
    DELETE FROM
    loads
    WHERE
    id = ${loadId}
    RETURNING
  *
  `;
  return load && camelcaseKeys(load);
}

export async function updateLoadById(
  loadId: number,
  // loadingPlaceId: number,
  // offloadingPlaceId: number,
  // loadingDate: Date,
  // offloadingDate: Date,
  // reference: string,
  // truckId: number,
  // palletQuantityGiven: number,
  palletQuantityReceived: number,
  // documentId: number,
) {
  const [load] = await sql<[Load[]]>`
    UPDATE
      loads
    SET
      -- loading_place_id =
      -- offloading_place_id =
      -- loading_date =
      -- offloading_date =
      -- reference =
      -- truck_id =
      -- pallet_quantity_given =
      pallet_quantity_received = ${palletQuantityReceived}
      --  document_id =

    WHERE
      id = ${loadId}
    RETURNING *
  `;
  return load && camelcaseKeys(load);
}

export async function getAllInfoFromLoadById(loadId: number) {
  const allInfoFromLoadById = await sql<[Load]>`
    SELECT
    *
    FROM
    loads,
    addresses,
    trucks,
    palnote
    WHERE
    loads.id = ${loadId} AND
    loads.loading_place_id = addresses.id AND
    loads.offloading_place_id = addresses.id AND
    loads.truck_id = trucks.id AND
    loads.document_id = palnote.id
    -- loads.user_id = user_id
  `;
  return allInfoFromLoadById && camelcaseKeys(allInfoFromLoadById);
}

// ADDRESS FUNCTION \\

export type Address = {
  id: number;
  companyName: string;
  streetInfo: string;
  zipcode: string;
  city: string;
  country: string;
};

export async function createAddress(
  companyName: string,
  streetInfo: string,
  zipcode: string,
  city: string,
  country: string,
) {
  console.log('verif address');
  const [address] = await sql<[Address]>`
 INSERT INTO addresses
 (company_name, street_info, zipcode, city, country )
 VALUES
 (${companyName}, ${streetInfo}, ${zipcode}, ${city}, ${country} )
 RETURNING *
 `;
  console.log('verifaddress2');

  return address && camelcaseKeys(address);
}

export async function getAllAddresses() {
  const addresses = await sql<Address[]>`
  SELECT * FROM addresses ;

`;
  return addresses.map((address: Address) => camelcaseKeys(address));
}

export async function getAdressById(addressId: number) {
  const [address] = await sql<[Address]>`
  SELECT id FROM addresses WHERE id=${addressId};

`;
  return address && camelcaseKeys(address);
}

// TRUCK FUNCTION \\

export type Truck = {
  id: number;
  truckPlate: string;
  trailerPlate: string;
};
export async function createTruck(truckPlate: string, trailerPlate: string) {
  const [truck] = await sql<[Truck]>`
  INSERT INTO trucks
  (truck_plate, trailer_plate)
  VALUES
  (${truckPlate}, ${trailerPlate} )
  RETURNING *
  `;
  return truck && camelcaseKeys(truck);
}

export async function getTruckById(truckId: number) {
  const [truck] = await sql<[Truck | undefined]>`
    SELECT id FROM trucks WHERE id = ${truckId};
  `;
  return truck && camelcaseKeys(truck);
}

export async function getAllTrucks() {
  const trucks = await sql<Truck[]>`
  SELECT * FROM trucks ;

`;
  return trucks.map((truck: Truck) => camelcaseKeys(truck));
}

// Pal Note \\

export type Palnote = {
  palnoteId: number;
  content: string;
  url: string;
  userId: number;
};
export async function CreatePalnote(
  content: string,
  url: string,
  userId: number,
) {
  const palnote = await sql<[Palnote]>`
  INSERT INTO palnote
  (content_pal_note, document_url, user_id)
  VALUES
  (${content}, ${url}, ${userId} )
  RETURNING *
  `;
  return palnote && camelcaseKeys(palnote);
}

export async function getPalnote() {
  const palnote = await sql<Palnote[]>`
  SELECT * FROM palnote ;

`;
  return palnote.map((palnote: Palnote) => camelcaseKeys(palnote));
}
