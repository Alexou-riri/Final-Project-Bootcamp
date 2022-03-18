import { NextApiRequest, NextApiResponse } from 'next';
import {
  createNewLoad,
  getValidSessionByToken,
  Load,
} from '../../util/database';

export type CreateLoadResponse =
  | { errors: { message: string }[] }
  | { load: Load };
