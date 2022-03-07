import { config } from 'dotenv-safe';
import postgres from 'postgres';
import camelcaseKeys from 'camelcase-keys';

config();

// declare module globalThis {
//   let postgresSqlClient: ReturnType<typeof postgres> | undefined;
// }

const sql = postgres();

type User = {
  id: number;
  username: string;
};

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
      username
  `;
  return camelcaseKeys(user);
}
