import apicache from 'apicache';
import redis from 'redis';
import { Response, Request } from 'express';

export const redisClient = redis.createClient({ url: process.env.REDIS_URL });

export default apicache.options({
  redisClient,
}).middleware;

export const onlyStatus200 = (_: Request, res: Response) =>
  res.statusCode === 200;
