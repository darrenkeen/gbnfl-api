import compression from 'compression';
import cors from 'cors';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';

import { json, NextFunction, Request, Response, Router } from 'express';

import { logger } from './logger';
import { COOKIE_NAME, __prod__ } from '../constants';

export function registerMiddleware(router: Router): void {
  router.use(json());
  router.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
    })
  );
  router.use(compression());

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  router.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: false,
        // secure: __prod__, // Only in HTTPS
        domain: __prod__ ? undefined : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      resave: false,
    })
  );

  router.use((req: Request, _: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== 'test') {
      const ip: string | string[] | undefined =
        req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      logger.log({
        isRequest: true,
        level: 'info',
        message: `${req.method} ${req.url} ${ip}`,
      });
    }

    return next();
  });
}
