import compression from 'compression';
import cors from 'cors';

import { json, NextFunction, Request, Response, Router } from 'express';

import { logger } from './logger';

const allowedOrigins = ['https://gbnfl-git-develop-darrenkeen1.vercel.app'];

export function registerMiddleware(router: Router): void {
  router.use(json());
  router.use(compression());
  router.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.indexOf(origin) === -1 &&
          origin !== process.env.ORIGIN
        ) {
          var msg =
            'The CORS policy for this site does not ' +
            'allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
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
