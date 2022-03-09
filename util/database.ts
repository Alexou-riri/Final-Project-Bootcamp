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
  username: string;
  company: string;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export async function getUserById(id: number) {
  const [user] = await sql<[User | undefined]>`
    SELECT id,
    username,
    company
    from
    users
    where id = ${id}
    `;
  return user && camelcaseKeys(user);
}

export async function getUserByUsername(username: string) {
  const [user] = await sql<[{ id: number } | undefined]>`
    SELECT id from users where username = ${username}
    `;
  return user && camelcaseKeys(user);
}
export async function getUserWithPasswordHashByUsername(username: string) {
  const [user] = await sql<[UserWithPasswordHash | undefined]>`
    SELECT id,
    username,
    password_hash
    from
    users
    where username = ${username}
    `;
  return user && camelcaseKeys(user);
}

export async function createUser(
  username: string,
  passwordHash: string,
  company: string,
) {
  const [user] = await sql<[User]>`
    INSERT INTO users
      (username, password_hash, company)
    VALUES
      (${username}, ${passwordHash}, ${company})
    RETURNING
      id,
      username,
      company
  `;
  return camelcaseKeys(user);
}

type Session = {
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
    token = ${token}
    `;

  await deleteExpiredSessions();
  return session && camelcaseKeys(session);
}
