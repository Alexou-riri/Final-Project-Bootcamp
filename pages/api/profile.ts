import { NextApiRequest, NextApiResponse } from 'next';
import {
  // getUserById,
  getUserByValidSessionToken,
  // getValidSessionByToken,
} from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const token = req.cookies.sessionToken;

    if (!token) {
      res.status(400).json({
        errors: [
          {
            message: 'No session token passed',
          },
        ],
      });
      return;
    }
    const user = getUserByValidSessionToken(token);

    if (user) {
      res.status(200).json({
        user: user,
      });
      return;
    }

    res.status(404).json({
      errors: [
        {
          message: 'User Not Found or session token not found',
        },
      ],
    });
    return;
  }

  res.status(405).json({
    errors: [
      {
        message: 'Method not supported, try GET instead',
      },
    ],
  });
}
