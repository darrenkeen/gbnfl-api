import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    logger.error('Not authenticated');
    return res.status(404).json({ error: 'Not authenticated' });
  }
  return next();
};
