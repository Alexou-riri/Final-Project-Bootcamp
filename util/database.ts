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
    company,
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
      users.permission_id
    FROM
      users,
      sessions,
      permission
    WHERE
      sessions.token = ${token} AND
      sessions.user_id = users.id AND
      users.permission_id = permission.id AND
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
      (company, password_hash, permission_id)
    VALUES
      ( ${company}, ${passwordHash}, ${userPermission})
    RETURNING
      id,
      company,
      permission_id
  `;
  return camelcaseKeys(user);
}

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
