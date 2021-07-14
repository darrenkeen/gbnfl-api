import { Request, Response, Router } from 'express';
import axios from 'axios';

import { logger } from '../config/logger';
import auth from '../middleware/auth';
import cache, { onlyStatus200 } from '../middleware/cache';
import cacheTimestamp from '../middleware/cacheTimestamp';
import { buildResponse } from '../utils/buildResponse';
import { buildMatchData } from '../utils/buildMatchData';
import { SEASON_START_END } from '../constants';
import { getRepository } from 'typeorm';
import { MatchData } from '../entities/MatchData';
const API = require('../api.js')();

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
    const qb = await getRepository(MatchData).createQueryBuilder('match');
    const matchDataQuery = qb
      .select('match.id')
      .leftJoinAndSelect('match.teams', 'teams')
      .leftJoinAndSelect('teams.players', 'players')
      .where(
        'match.id IN' +
          qb
            .subQuery()
            .select('match.id')
            .from(MatchData, 'match')
            .leftJoin('match.teams', 'teams')
            .leftJoin('teams.players', 'players')
            .where('players.uno = :uno', { uno: '8457816366480952913' })
            .getQuery()
      );

    const matchData = await matchDataQuery
      .orderBy({
        'match.utcStartSeconds': 'DESC',
      })
      .limit(20)
      .getMany();

    return res.json({ matchData });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e });
  }
};

const router = Router();

router.get(
  '/latest/:playerId/:platform',
  // auth,
  // cache('5 minutes', onlyStatus200),
  // cacheTimestamp,
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
