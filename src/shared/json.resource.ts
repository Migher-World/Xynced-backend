import { isArray } from 'util';

export class JsonResource {
  constructor(request: any | any[]) {
    if (isArray(request)) {
      return this.collection(request);
    } else {
      return this.rules(request);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  rules(request: any) {
    return request;
  }

  collection(request: any[]): any {
    const response: any[] = [];
    request.forEach((item: any) => {
      response.push(this.rules(item));
    });
    return response;
  }
}
