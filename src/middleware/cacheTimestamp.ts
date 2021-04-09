import { NextFunction, Request, Response } from 'express';
import { Cache } from '../entities/Cache';
// import { Cache } from '../entities/Cache';

export default async (req: Request, res: Response, next: NextFunction) => {
  const route = req.originalUrl;
  try {
    const cacheItem = await Cache.findOne({ where: { route } });
    const timestamp = new Date();
    if (!cacheItem) {
      const newCache = new Cache({ route, timestamp });
      await newCache.save();
    } else {
      await Cache.update(cacheItem.id, {
        timestamp,
      });
    }
    res.locals.cacheTimestamp = timestamp;
    return next();
  } catch (e) {
    console.error(e);
    return res.status(500).json();
  }
};
