import {
  sendObjectResponse,
  sendPaginatedListReponse,
} from '../response.transformer';

export const resolveResponse = async (
  service: any,
  message: string = 'Success',
) => {
  const response = await service;
  return response && response.pagination
    ? sendPaginatedListReponse(response, message)
    : sendObjectResponse(response, message);
};
