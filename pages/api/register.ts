import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { createUser } from '../../util/database';

export default async function registerHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    console.log(request.body);
    const passwordHash = await bcrypt.hash(request.body.password, 12);

    const user = await createUser(
      request.body.username,

      passwordHash,
      request.body.company,
    );

    response.status(201).json({ user: user });
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
