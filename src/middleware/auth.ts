import { NextFunction, Request, Response } from 'express';
const API = require('../API2.js')();

export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    await API.login(process.env.COD_API_USER, process.env.COD_API_PASS);
    return next();
  } catch (e) {
    console.error(e);
    return res
      .status(404)
      .json({ error: 'There was a problem with authenticating' });
  }
};
