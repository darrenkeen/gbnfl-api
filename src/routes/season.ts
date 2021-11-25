import { Request, Response, Router } from 'express';
import { SelectQueryBuilder } from 'typeorm';

import { logger } from '../config/logger';
import { SEASON_START_END, TROPHY_MODES } from '../constants';
import { MatchDataPlayer } from '../entities/MatchDataPlayer';
import lastUpdated from '../middleware/lastUpdated';
import { buildLastUpdatedResponse } from '../utils/buildResponse';
import { mapSeasonData } from '../utils/mapSeasonData';

export type SeasonDataResponse = {
  mode: string;
  gamesPlayed: number;
  wins: number;
  kills: number;
  deaths: number;
  kdRatio: number;
  gulagWins: number;
  gulagLosses: number;
  assists: number;
}[];

const getSeasonPlayer = async (req: Request, res: Response) => {
  const { uno, season } = req.params;

  if (!SEASON_START_END[season]) {
    return res.status(400).json({ error: 'Season not valid' });
  }

  const { start, end } = SEASON_START_END[season];

  try {
    const data = await MatchDataPlayer.find({
      join: {
        alias: 'mdp',
        innerJoin: {
          player: 'mdp.player',
          team: 'mdp.team',
          match: 'team.match',
        },
      },
      where: (queryBuilder: SelectQueryBuilder<MatchDataPlayer>) => {
        queryBuilder
          .where('player.uno = :uno', { uno })
          .andWhere('match.mode IN(:...modes)', { modes: TROPHY_MODES })
          .andWhere('match.utcStartSeconds BETWEEN :start AND :end', {
            start: start / 1000,
            end: end / 1000,
          });
      },
      relations: ['team', 'team.match'],
    });

    const seasonData: SeasonDataResponse = mapSeasonData(data);

    return res.json(buildLastUpdatedResponse(res, seasonData));
  } catch (e) {
    logger.error(e);
    return res.status(404).json({ error: 'Weekly not found', uno });
  }
};

const router = Router();

router.get('/:uno/:season', lastUpdated, getSeasonPlayer);

export default router;
