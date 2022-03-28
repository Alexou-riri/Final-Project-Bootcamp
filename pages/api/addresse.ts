//import { NextApiRequest, NextApiResponse } from 'next';
// import { Address, createAddress } from '../../util/database';

// //Creating address\\

// export type CreateAddressRequestBody = {
//   addressId: number;
//   streetNumber: number;
//   streetName: string;
//   zipcode: string;
//   country: string;
//   companyName: string;
// };

// type CreateAddressNextApiRequest = Omit<NextApiRequest, 'body'> & {
//   body: CreateAddressRequestBody;
// };

// export type CreateAddressResponseBody =
//   | { errors?: { message: string }[] }
//   | { address: Address };

// export default async function createAddressHandler(
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
//       typeof request.body.country !== 'string' ||
//       !request.body.country
//     ) {
//       // 400 bad request
//       response.status(400).json({
//         errors: [{ message: 'Something is missing' }],
//       });
//       return; // Important, prevents error for multiple requests
//     }

//     ////// a rajouter if permission = 1 \\\\\\\\\

//     // Create address in DB

//     const address = await createAddress(
//       request.body.companyName,
//       request.body.streetNumber,
//       request.body.streetName,
//       request.body.zipcode,
//       request.body.country,
//     );

//     response.status(201).json({ address: address });
//     return;
//   }
// }
