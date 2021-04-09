import { NextFunction, Request, Response } from 'express';
const API = require('call-of-duty-api')();

export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    await API.login('dkag1003@gmail.com', '2rpQjsk2!');
    return next();
  } catch (e) {
    console.error(e);
    return res
      .status(404)
      .json({ error: 'There was a problem with authenticating' });
  }
};
