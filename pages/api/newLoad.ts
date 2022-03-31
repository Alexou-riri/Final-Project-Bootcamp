import { NextApiRequest, NextApiResponse } from 'next';
import { FaAddressBook } from 'react-icons/fa';
import {
  Address,
  createAddress,
  createNewLoad,
  createTruck,
  deleteLoad,
  getLoads,
  getLoadById,
  updateLoadById,
  Load,
  Truck,
} from '../../util/database';

// export type CreateAddressRequestBody = {
//   addressId: number;
//   companyName: string;
//   streetNumber: number;
//   streetName: string;
//   city: string;
//   zipcode: string;
//   country: string;
// };

// type CreateAddressNextApiRequest = Omit<NextApiRequest, 'body'> & {
//   body: CreateAddressRequestBody;
// };

// export type CreateAddressResponseBody =
//   | { errors?: { message: string }[] }
//   | { address: Address };

// export async function createAddressHandler(
//   request: CreateAddressNextApiRequest,
//   response: NextApiResponse<CreateAddressResponseBody>,
// ) {
//   console.log(request.query);
//   if (request.method === 'POST') {
//     if (
//       typeof request.body.companyName !== 'string' ||
//       !request.body.companyName ||
//       typeof request.body.streetNumber !== 'number' ||
//       !request.body.streetNumber ||
//       typeof request.body.streetName !== 'string' ||
//       !request.body.streetName ||
//       typeof request.body.zipcode !== 'string' ||
//       !request.body.zipcode ||
//       typeof request.body.city !== 'string' ||
//       !request.body.city ||
//       typeof request.body.country !== 'string' ||
//       !request.body.country
//     ) {
//       // 400 bad request
//       response.status(400).json({
//         errors: [{ message: 'Something is missing' }],
//       });
//       return; // Important, prevents error for multiple requests
//     }

//     const address = await createAddress(
//       request.body.companyName,
//       request.body.streetNumber,
//       request.body.streetName,
//       request.body.zipcode,
//       request.body.city,
//       request.body.country,
//     );

//     response.status(201).json({ address: address });
//     return;
//   }
// }

// TRCUK\\

// export type CreateTruckRequestBody = {
//   truckId: number;
//   truckPlate: string;
//   trailerPlate: string;
// };

// type CreateTruckNextApiRequest = Omit<NextApiRequest, 'body'> & {
//   body: CreateTruckRequestBody;
// };

// export type CreateTruckResponseBody =
//   | { errors?: { message: string }[] }
//   | { truck: Truck };

// export async function createTruckHandler(
//   request: CreateTruckNextApiRequest,
//   response: NextApiResponse<CreateTruckResponseBody>,
// ) {
//   console.log(request.query);
//   if (request.method === 'POST') {
//     if (
//       typeof request.body.truckPlate !== 'string' ||
//       !request.body.truckPlate ||
//       typeof request.body.trailerPlate !== 'string' ||
//       !request.body.trailerPlate
//     ) {
//       // 400 bad request
//       response.status(400).json({
//         errors: [{ message: 'Something is missing' }],
//       });
//       return; // Important, prevents error for multiple requests
//     }

//     ////// a rajouter if permission = 1 \\\\\\\\\

//     // Create address in DB

//     const truck = await createTruck(
//       request.body.truckPlate,
//       request.body.trailerPlate,
//     );

//     response.status(201).json({ truck: truck });
//     return;
//   }
// }

// Load request

// export type CreateLoadRequestBody = {
//   loadId: number;
//   loadingPlaceId: number;
//   offloadingPlaceId: number;
//   loadingDate: Date;
//   offloadingDate: Date;
//   reference: string;
//   truckId: number;
//   palletQuantityGiven: number;
//   palletQuantityReceived?: number | undefined;
//   documentId?: number | undefined;
//   userId: number;
// };

// type CreateLoadNextApiRequest = Omit<NextApiRequest, 'body'> & {
//   body: CreateLoadRequestBody;
// };

// export type CreateLoadResponseBody =
//   | { errors: { message: string }[] }
//   | { load: Load; address: Address; truck: Truck };

export type DeleteLoadResponseBody = {
  load: Load;
  errors?: { message: string }[];
};

type LoadsRequestBody = {
  load: Omit<Load, 'id'>;
  address: Address;
  truck: Truck;
};

type LoadsNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: LoadsRequestBody;
};

export type LoadsResponseBodyGet = {
  loads: Load[];
};

export type LoadsResponseBodyPost =
  | { error: string }
  | { load: Load; address: Address; truck: Truck };

type LoadsResponseBody = LoadsResponseBodyGet | LoadsResponseBodyPost;

export default async function createLoadHandler(
  request: LoadsNextApiRequest,
  response: NextApiResponse<LoadsResponseBody>,
) {
  console.log(request.query);
  console.log(request.method);
  // console.log(request.body);
  // console.log('oskour');

  if (request.method === 'GET') {
    const loads = await getLoads();
    response.status(200).json({ loads: loads });
    return;
  }
  if (request.method === 'POST') {
    // if (
    //   typeof request.body.palletQuantityGiven !== 'number' ||
    //   !request.body.palletQuantityGiven ||
    //   typeof request.body.loadingPlaceId !== 'number' ||
    //   !request.body.loadingPlaceId ||
    //   typeof request.body.offloadingPlaceId !== 'number' ||
    //   !request.body.offloadingPlaceId ||
    //   typeof request.body.truckId !== 'number' ||
    //   !request.body.truckId ||
    //   typeof request.body.reference !== 'string' ||
    //   !request.body.reference ||
    //   typeof request.body.loadingDate !== 'string' ||
    //   !request.body.loadingDate ||
    //   typeof request.body.offloadingDate !== 'string' ||
    //   !request.body.offloadingDate ||
    //   typeof request.body.userId !== 'number' ||
    //   !request.body.userId
    // ) {
    //   // 400 bad request
    //   response.status(400).json({
    //     error: [{ message: 'Something is missing' }],
    //   });
    //   return; // Important, prevents error for multiple requests
    // }

    ////// a rajouter if permission = 1 \\\\\\\\\

    // Create load in DB
    // console.log('prout3');
    // console.log('body', request.body);
    const loadingAddress = await createAddress(
      request.body.address.companyName,
      request.body.address.streetInfo,
      request.body.address.zipcode,
      request.body.address.city,
      request.body.address.country,
    );

    const offloadingAddress = await createAddress(
      request.body.address.companyName2,
      request.body.address.streetInfo2,
      request.body.address.zipcode2,
      request.body.address.city2,
      request.body.address.country2,
    );

    // console.log(loadingAddress);
    // console.log(offloadingAddress);
    const formTruck = await createTruck(
      request.body.truck.truckPlate,
      request.body.truck.trailerPlate,
    );
    console.log('receivfffff', typeof request.body.load.loadingDate);
    const formLoad = await createNewLoad(
      loadingAddress.id,
      offloadingAddress.id,
      request.body.load.loadingDate,
      request.body.load.offloadingDate,
      request.body.load.reference,
      formTruck.id,
      request.body.load.palletQuantityGiven,
      request.body.load.palletQuantityReceived || null,
      request.body.load.documentId || null,
      // request.body.load.userId,
    );
    console.log('prout6');
    response.status(201).json({
      address: [loadingAddress, offloadingAddress],
      truck: formTruck,
      load: formLoad,
    });
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
        error: [{ message: 'id or name not provided' }],
      });
      return; // Important, prevents error for multiple requests
    }

    const deletedLoad = await deleteLoad(request.body.loadId);

    if (!deletedLoad) {
      response.status(404).json({ error: [{ message: 'Name not provided' }] });
      return;
    }
    // response.status(201).json({ load: deletedLoad});
    // return;
  }
  response.status(405).json({ error: [{ message: 'Method not supported' }] });
}
