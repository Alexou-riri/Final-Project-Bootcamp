import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import {
  createSession,
  createUser,
  getUserByUsername,
  User,
} from '../../util/database';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
import crypto from 'node:crypto';
import { verifyCsrfToken } from '../../util/auth';

type RegisterRequestBody = {
  company: string;
  password: string;
  csrfToken: string;
  userPermission: number;
};

type RegisterNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: RegisterRequestBody;
};

export type RegisterResponseBody =
  | { errors: { message: string }[] }
  | { user: User };

export default async function registerHandler(
  request: RegisterNextApiRequest,
  response: NextApiResponse<RegisterResponseBody>,
) {
  if (request.method === 'POST') {
    if (
      typeof request.body.company !== 'string' ||
      !request.body.company ||
      typeof request.body.password !== 'string' ||
      !request.body.password ||
      typeof request.body.csrfToken !== 'string' ||
      !request.body.csrfToken ||
      !request.body.userPermission
    ) {
      response.status(400).json({
        errors: [
          {
            message:
              'Company name or password missing. Please provide one. thanks.',
          },
        ],
      });
      return;
    }
    // Verify CSRF Token
    const csrfTokenMatches = verifyCsrfToken(request.body.csrfToken);

    if (!csrfTokenMatches) {
      response.status(403).json({
        errors: [
          {
            message: 'Invalid CSRF token',
          },
        ],
      });
      return; // Important: will prevent "Headers already sent" error
    }

    if (await getUserByUsername(request.body.company)) {
      response.status(409).json({
        errors: [
          {
            message:
              'Company name already exists. Check with your colleagues for the identification.',
          },
        ],
      });
      return; // because return response. prevent "headers already sent" error.
    }
    console.log(request.body);
    const passwordHash = await bcrypt.hash(request.body.password, 12);

    const user = await createUser(
      request.body.company,
      passwordHash,
      request.body.userPermission,
    );
    // 1. Create a unique token
    const token = crypto.randomBytes(64).toString('base64');

    // 2. Create the session
    const session = await createSession(token, user.id);

    console.log(session);

    // 3. Serialize the cookie
    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );
    // 4. Add the cookie to the header response
    response
      .status(201)
      .setHeader('set-cookie', serializedCookie)
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
