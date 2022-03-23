import { NextApiRequest, NextApiResponse } from 'next';
import {
  createNewLoad,
  deleteLoad,
  getValidSessionByToken,
  Load,
} from '../../util/database';

export type CreateLoadRequestBody = {
  loadId: number;
  palletQuantityGiven: number;
  loadingPlaceId: number;
  offloadingPlaceId: number;
  truckId: number;
  reference: string;
  loadingDate: Date;
  offloadingDate: Date;
  requestDate: Date;
  userId: number;
};

type CreateLoadNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: CreateLoadRequestBody;
};

export type CreateLoadResponseBody =
  | { errors: { message: string }[] }
  | { load: Load };

export default async function createLoadHandler(
  request: CreateLoadNextApiRequest,
  response: NextApiResponse<CreateLoadResponseBody>,
) {
  console.log(request.query);
  if (request.method === 'POST') {
    if (
      typeof request.body.palletQuantityGiven !== 'number' ||
      !request.body.palletQuantityGiven ||
      typeof request.body.loadingPlaceId !== 'number' ||
      !request.body.loadingPlaceId ||
      typeof request.body.offloadingPlaceId !== 'number' ||
      !request.body.offloadingPlaceId ||
      typeof request.body.truckId !== 'number' ||
      !request.body.truckId ||
      typeof request.body.reference !== 'string' ||
      !request.body.reference ||
      typeof request.body.loadingDate !== 'string' ||
      !request.body.loadingDate ||
      typeof request.body.offloadingDate !== 'string' ||
      !request.body.offloadingDate ||
      typeof request.body.requestDate !== 'string' ||
      !request.body.requestDate ||
      typeof request.body.userId !== 'number' ||
      !request.body.userId
    ) {
      // 400 bad request
      response.status(400).json({
        errors: [{ message: 'Something is missing' }],
      });
      return; // Important, prevents error for multiple requests
    }

    ////// a rajouter if permission = 1 \\\\\\\\\

    // Create load in DB

    const load = await createNewLoad(
      request.body.palletQuantityGiven,
      request.body.loadingPlaceId,
      request.body.offloadingPlaceId,
      request.body.truckId,
      request.body.reference,
      request.body.loadingDate,
      request.body.offloadingDate,
      request.body.requestDate,
      request.body.userId,
    );

    response.status(201).json({ load: load });
    return;
  } else if (request.method === 'DELETE') {
    // if the method is DELETE delete the load matching the id and user_id
    const deletedLoad = await deleteLoad(request.body.loadId);

    if (!deletedLoad) {
      response.status(404).json({ errors: [{ message: 'Name not provided' }] });
      return;
    }
    // response.status(201).json({ load: deletedLoad});
    // return;
  }
  response.status(405).json({ errors: [{ message: 'Method not supported' }] });
}
