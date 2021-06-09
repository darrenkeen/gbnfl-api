import { NextFunction, Request, Response } from 'express';
import { MatchTrack } from '../entities/MatchTrack';
// import { Cache } from '../entities/Cache';

export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    const cacheItem = await MatchTrack.findOne();

    res.locals.lastUpdated = cacheItem ? cacheItem.updatedAt : new Date();
    return next();
  } catch (e) {
    console.error(e);
    res.locals.lastUpdated = new Date();
    return next();
  }
};
