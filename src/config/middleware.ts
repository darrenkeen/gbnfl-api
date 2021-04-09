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
export function registerMiddleware(router: Router): void {
  router.use(json());
  router.use(compression());
  router.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
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
