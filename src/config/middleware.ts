import compression from 'compression';
import cors from 'cors';

import { json, NextFunction, Request, Response, Router } from 'express';

import { logger } from './logger';

/**
 * Init Express middleware
 *
 * @param {Router} router
 * @returns {void}
 */
const allowedOrigins = ['https://gbnfl-git-develop-darrenkeen1.vercel.app'];
export function registerMiddleware(router: Router): void {
  router.use(json());
  router.use(compression());
  router.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
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

  // Log incoming requests
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
