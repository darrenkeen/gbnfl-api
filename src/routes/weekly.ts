import { Request, Response, Router } from 'express';
import { getRepository, SelectQueryBuilder } from 'typeorm';

import { logger } from '../config/logger';
import { WeeklyMode } from '../entities/WeeklyMode';
import lastUpdated from '../middleware/lastUpdated';
import { buildLastUpdatedResponse } from '../utils/buildResponse';

const getWeeklyPlayer = async (req: Request, res: Response) => {
  const { uno } = req.params;

  try {
    const weeklyData = await WeeklyMode.find({
      join: { alias: 'weekly', innerJoin: { player: 'weekly.player' } },
      where: (queryBuilder: SelectQueryBuilder<WeeklyMode>) => {
        queryBuilder.where('player.uno = :uno', { uno });
      },
      relations: ['player'],
    });

    return res.json(buildLastUpdatedResponse(res, { modes: weeklyData }));
  } catch (e) {
    logger.error(e);
    return res.status(404).json({ error: 'Weekly not found', uno });
  }
};

const getWeeklyLeaderboard = async (_: Request, res: Response) => {
  //TODO: Make this into an actual leaderboard!
  try {
    // const weeklyData = await WeeklyMode.find({
    //   select: '*',
    //   where: (queryBuilder: SelectQueryBuilder<WeeklyMode>) => {
    //     queryBuilder.where('');
    //   },
    //   relations: ['player'],
    // });

    const kdRatioMax = await getRepository(WeeklyMode)
      .createQueryBuilder('weekly')
      .where(
        '"kills" = (SELECT MAX("kills") FROM "weeklyMode" where mode = \'all\')'
      )
      .leftJoinAndSelect('weekly.player', 'player')
      .getOne();

    const killsMax = await getRepository(WeeklyMode)
      .createQueryBuilder('weekly')
      .where(
        '"kills" = (SELECT MAX("kills") FROM "weeklyMode" where mode = \'all\')'
      )
      .leftJoinAndSelect('weekly.player', 'player')
      .getOne();

    return res.json(buildLastUpdatedResponse(res, { kdRatioMax, killsMax }));
  } catch (e) {
    logger.error(e);
    return res.status(404).json({ error: 'Not found' });
  }
};

const router = Router();

router.get('/leaderboard', lastUpdated, getWeeklyLeaderboard);
router.get('/:uno', lastUpdated, getWeeklyPlayer);

export default router;
