import { Response } from 'express';

export const buildResponse = (res: Response, data: any) => ({
  cacheTimestamp: res.locals.cacheTimestamp,
  data,
});
