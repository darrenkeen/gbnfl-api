import { Request, Response, Router } from 'express';
import axios from 'axios';
import { logger } from '../config/logger';
import { Player } from '../entities/Player';
import auth from '../middleware/auth';
import cache, { onlyStatus200 } from '../middleware/cache';
import cacheTimestamp from '../middleware/cacheTimestamp';
import { buildResponse } from '../utils/buildResponse';
import { mapWeeklyData } from '../utils/mapWeeklyData';
import { buildMatchData } from '../utils/buildMatchData';
const API = require('call-of-duty-api')();

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

const getWeeklyData = async (req: Request, res: Response) => {
  const { playerId, platform } = req.params;
  if (playerId === 'all') {
    let players: Player[] = [];
    try {
      players = await Player.find();
    } catch (err) {
      console.error(err);
      return res.status(400).json();
    }
    let returnData: any = {};
    await Promise.all(
      players.map(async (player) => {
        try {
          const KD = await mapWeeklyData(player);

          returnData[player.name] = KD;
          return;
        } catch (e) {
          if (typeof e === 'string' && e === 'Not permitted: not allowed') {
            return;
          }
          console.error(e);
          return res.status(404).json({ error: e });
        }
      })
    );
    return res.json(buildResponse(res, returnData));
  } else {
    try {
      const KD = await mapWeeklyData({
        platformId: playerId,
        platformType: platform,
      });

      return res.json(buildResponse(res, KD));
    } catch (e) {
      if (typeof e === 'string' && e === 'Not permitted: not allowed') {
        return;
      }
      console.error(e);
      return res.status(404).json({ error: e });
    }
  }
};

const getMatchData = async (req: Request, res: Response) => {
  const { matchId } = req.params;
  try {
    return axios
      .get(
        `https://www.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/battle/fullMatch/wz/${matchId}/en`
      )
      .then((r) => buildMatchData(r.data))
      .then((data) => res.json(buildResponse(res, data)));
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ error: e });
  }
};

const testing = async (req: Request, res: Response) => {
  const { playerId, platform, start, end } = req.params;
  try {
    const data = await API.MWcombatwzdate(playerId, start, end, platform);
    if (data.matches?.length < 1) {
      return res.status(500).json({ error: 'No matches' });
    }
    return res.json({
      length: data.matches.length,
      firstMatchTime: new Date(data.matches[0].utcStartSeconds * 1000),
      lastMatchTime: new Date(
        data.matches[data.matches.length - 1].utcStartSeconds * 1000
      ),
    });
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
  '/weekly/:playerId/:platform?',
  auth,
  cache('5 minutes', onlyStatus200),
  cacheTimestamp,
  getWeeklyData
);
router.get(
  '/match/:matchId',
  cache('60 minutes', onlyStatus200),
  cacheTimestamp,
  getMatchData
);
router.get('/testing/:playerId/:platform/start/:start/end/:end', auth, testing);

export default router;
