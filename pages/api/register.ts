import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import {
  createSession,
  createUser,
  getUserByUsername,
} from '../../util/database';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
import crypto from 'node:crypto';

export default async function registerHandler(
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

    if (await getUserByUsername(request.body.username)) {
      response.status(409).json({
        errors: [
          {
            message:
              'Username already exists. Please choose another one. thanks.',
          },
        ],
      });
      return; // because return response. prevent "headers already sent" error.
    }
    console.log(request.body);
    const passwordHash = await bcrypt.hash(request.body.password, 12);

    const user = await createUser(
      request.body.username,

      passwordHash,
      request.body.company,
    );
    // // 1. Create a unique token
    // const token = crypto.randomBytes(64).toString('base64');

    // // 2. Create the session
    // const session = await createSession(token, user.id);

    // console.log(session);

    // // 3. Serialize the cookie
    // const serializedCookie = await createSerializedRegisterSessionTokenCookie(
    //   session.token,
    // );
    // 4. Add the cookie to the header response
    response
      .status(201)
      // .setHeader('set-cookie', serializedCookie)
      .json({ user: user });
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
