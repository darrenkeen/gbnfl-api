import { Request, Response, Router } from 'express';
import apicache from 'apicache';

const clearCache = async (req: Request, res: Response) => {
  res.send(apicache.clear(req.body.route));
};
const getCache = async (_: Request, res: Response) => {
  res.send(apicache.getIndex());
};

const router = Router();

router.get('/', getCache);
router.post('/clear', clearCache);

export default router;
