import {
  sendListReponse,
  sendObjectResponse,
  sendPaginatedListReponse,
} from '../response.transformer';

export const resolveResponse = async (
  service: any,
  message: string = 'Success',
) => {
  const response = await service;
  let finalresponse = null;
  if (response && response.pagination) {
    finalresponse = sendPaginatedListReponse(response, message);
  } else if (response.length > 0) {
    finalresponse = sendListReponse(response, message);
  } else {
    finalresponse = sendObjectResponse(response, message);
  }

  return finalresponse;
};
