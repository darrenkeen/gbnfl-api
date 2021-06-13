import { NextFunction, Request, Response } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    throw new Error('not authenticated');
  }
  return next();
};
