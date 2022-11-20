export function sendObjectResponse(data: any, message: string) {
  return {
    status: true,
    message,
    data,
  };
}

export function sendPaginatedListReponse(response: any, message: string) {
  return {
    status: true,
    message,
    data: response.list,
    pagination: response.pagination,
  };
}

export function sendListReponse(data: any[], message: string) {
  return {
    status: true,
    message,
    data,
  };
}
