import { Request, Response, Router } from 'express';
import axios from 'axios';

import { logger } from '../config/logger';
import auth from '../middleware/auth';
import cache, { onlyStatus200 } from '../middleware/cache';
import cacheTimestamp from '../middleware/cacheTimestamp';
import { buildResponse } from '../utils/buildResponse';
import { buildMatchData } from '../utils/buildMatchData';
import { SEASON_START_END } from '../constants';
import { Player } from '../entities/Player';
import { SelectQueryBuilder } from 'typeorm';
const API = require('call-of-duty-api')();

const getAvailableSeasons = (_: Request, res: Response) => {
  return res.json({ data: SEASON_START_END });
};

const getLatestData = async (req: Request, res: Response) => {
  const { playerId, platform } = req.params;
  try {
    const data = await API.MWcombatwz(playerId, platform);
    return res.json(buildResponse(res, data));
  } catch (e) {
    if (typeof e === 'string' && e === 'Not permitted: not allowed') {
      return res.status(404).json({ error: 'This user is private.' });
    }
    console.error(e);
    return res.status(400).json({ error: 'Something went wrong' });
  }
};

const getLifetimeData = async (req: Request, res: Response) => {
  const { playerId, platform } = req.params;
  try {
    const data = await API.MWwz(playerId, platform);
    return res.json(buildResponse(res, data));
  } catch (e) {
    if (typeof e === 'string' && e === 'Not permitted: not allowed') {
      return res.status(404).json({ error: 'This user is private.' });
    }
    console.error(e);
    return res.status(400).json({ error: 'Something went wrong' });
  }
};

const getMatchData = async (req: Request, res: Response) => {
  const { matchId } = req.params;
  try {
    return axios
      .get(
        `https://www.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/battle/fullMatch/wz/${matchId}/en`
      )
      .then((r) => buildMatchData(r.data.data))
      .then((data) => res.json(buildResponse(res, data)));
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ error: e });
  }
};

const testing = async (_: Request, res: Response) => {
  try {
    const data = await Player.findOneOrFail({
      join: { alias: 'player', innerJoin: { user: 'player.user' } },
      where: (queryBuilder: SelectQueryBuilder<any>) => {
        queryBuilder.where('user.id = :id', { id: 'B39kYSMbyp' });
      },
      relations: ['user'],
    });

    return res.json({ data });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e });
  }
};

const router = Router();

router.get(
  '/latest/:playerId/:platform',
  auth,
  cache('5 minutes', onlyStatus200),
  cacheTimestamp,
  getLatestData
);
router.get(
  '/lifetime/:playerId/:platform',
  auth,
  cache('5 minutes', onlyStatus200),
  cacheTimestamp,
  getLifetimeData
);
router.get(
  '/match/:matchId',
  cache('60 minutes', onlyStatus200),
  cacheTimestamp,
  getMatchData
);
router.get('/seasons', getAvailableSeasons);
router.get('/testing/:end', auth, testing);

export default router;
