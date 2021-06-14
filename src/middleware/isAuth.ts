import { NextFunction, Request, Response } from 'express';

export default async (req: Request, _: Response, next: NextFunction) => {
  if (!(req.session as any).userId) {
    throw new Error('not authenticated');
  }
  return next();
};
