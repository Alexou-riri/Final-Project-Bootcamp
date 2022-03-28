// import { NextApiRequest, NextApiResponse } from 'next';
// import { CreateTruck, Truck } from '../../util/database';

// //Creating truck\\

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

//     const truck = await CreateTruck(
//       request.body.truckPlate,
//       request.body.trailerPlate,
//     );

//     response.status(201).json({ truck: truck });
//     return;
//   }
// }
