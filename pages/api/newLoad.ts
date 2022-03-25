import { NextApiRequest, NextApiResponse } from 'next';
import {
  Address,
  createAddress,
  createNewLoad,
  CreateTruck,
  deleteLoad,
  getValidSessionByToken,
  Load,
  Truck,
} from '../../util/database';


//Creating address\\

export type CreateAddressRequestBody = {
  addressId: number;
  streetNumber: number;
  streetName: string;
  zipcode: string;
  country: string;
  companyName: string;
};

type CreateAddressNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: CreateAddressRequestBody;
};

export type CreateAddressResponseBody =
  | { errors?: { message: string }[] }
  | { address: Address };


  export default async function createAddressHandler(
    request: CreateAddressNextApiRequest,
    response: NextApiResponse<CreateAddressResponseBody>,
  ) {
    console.log(request.query);
    if (request.method === 'POST') {
      if (
        typeof request.body.streetNumber !== 'number' ||
        !request.body.streetNumber ||
        typeof request.body.streetName!== 'string' ||
        !request.body.streetName ||
        typeof request.body.zipcode !== 'string' ||
        !request.body.zipcode||
        typeof request.body.country !== 'string' ||
        !request.body.country ||
        typeof request.body.companyName !== 'string' ||
        !request.body.companyName
      ) {
        // 400 bad request
        response.status(400).json({
          errors: [{ message: 'Something is missing' }],
        });
        return; // Important, prevents error for multiple requests
      }

      ////// a rajouter if permission = 1 \\\\\\\\\

      // Create address in DB

      const address = await createAddress(
        request.body.streetNumber,
        request.body.streetName,
        request.body.zipcode,
        request.body.country,
        request.body.companyName,
      );

      response.status(201).json({ address: address });
      return;
    }

    //Creating truck\\

export type CreateTruckRequestBody = {
  truckId: number,
  truckPlate: string,
  trailerPlate: string,
};

type CreateTruckNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: CreateTruckRequestBody;
};

export type CreateTruckResponseBody =
  | { errors?: { message: string }[] }
  | { truck: Truck };


  export default async function createTruckHandler(
    request: CreateTruckNextApiRequest,
    response: NextApiResponse<CreateTruckResponseBody>,
  ) {
    console.log(request.query);
    if (request.method === 'POST') {
      if (
        typeof request.body.truckPlate!== 'string' ||
        !request.body.truckPlate ||
        typeof request.body.trailerPlate!== 'string' ||
        !request.body.trailerPlate
      ) {
        // 400 bad request
        response.status(400).json({
          errors: [{ message: 'Something is missing' }],
        });
        return; // Important, prevents error for multiple requests
      }

      ////// a rajouter if permission = 1 \\\\\\\\\

      // Create address in DB

      const truck = await CreateTruck(
        request.body.truckPlate,
        request.body.trailerPlate,
      );

      response.status(201).json({ truck: truck });
      return;
    }

// Load request

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
  | { errors?: { message: string }[] }
  | { load: Load };

export type DeleteLoadResponseBody = {
  load: Load;
  errors?: { message: string }[];
};

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
    if (
      typeof request.body.loadId !== 'number' ||
      !request.body.loadId ||
      typeof request.body.userId !== 'string' ||
      !request.body.userId
    ) {
      // 400 bad request
      response.status(400).json({
        errors: [{ message: 'id or name not provided' }],
      });
      return; // Important, prevents error for multiple requests
    }

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
