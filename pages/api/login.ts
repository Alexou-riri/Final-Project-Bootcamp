import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import {
  createSession,
  createUser,
  getUserByUsername,
  getUserWithPasswordHashByUsername,
} from '../../util/database';
import crypto from 'node:crypto';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';

export default async function loginHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    if (
      typeof request.body.username !== 'string' ||
      !request.body.username ||
      typeof request.body.password !== 'string' ||
      !request.body.password
    ) {
      response.status(400).json({
        errors: [
          {
            message:
              'Username or password missing. Please provide one. thanks.',
          },
        ],
      });
      return;
    }

    const userWithPasswordHash = await getUserWithPasswordHashByUsername(
      request.body.username,
    );

    if (!userWithPasswordHash) {
      response.status(401).json({
        errors: [
          {
            message: 'Username doesnt match existing user',
          },
        ],
      });
      return;
    }
    const passwordMatches = await bcrypt.compare(
      request.body.password,
      userWithPasswordHash.passwordHash,
    );
    if (!passwordMatches) {
      response.status(401).json({
        errors: [
          {
            message: 'Password is wrong. try again ',
          },
        ],
      });
      return;
    }
    // 1. create unique token
    const sessionToken = crypto.randomBytes(64).toString('base64');

    // create session
    const session = await createSession(sessionToken, userWithPasswordHash.id);

    console.log(session);

    //2 serialize the cookie
    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      sessionToken,
    );

    // const user = await createUser(
    //   request.body.username,
    //   passwordHash,
    //   request.body.company,
    // );

    //3 add cookie to the header resp
    response
      .status(201)
      .setHeader('Set-cookie', serializedCookie)
      .json({
        user: {
          id: userWithPasswordHash.id,
        },
      });
    return;
  }
  response.status(405).json({
    errors: [
      {
        message: 'incorrect method',
      },
    ],
  });
}
