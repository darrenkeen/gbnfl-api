import { Response } from 'express';

export const buildResponse = (res: Response, data: any) => ({
  cacheTimestamp: res.locals.cacheTimestamp,
  data,
});

export const buildLastUpdatedResponse = (res: Response, data: any) => ({
  lastUpdated: res.locals.lastUpdated,
  data,
});
