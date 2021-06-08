import { Request, Response, Router } from 'express';
import { SelectQueryBuilder } from 'typeorm';

import { logger } from '../config/logger';
import { SEASON_START_END, TROPHY_MODES } from '../constants';
import { MatchDataPlayer } from '../entities/MatchDataPlayer';

interface SeasonDataResponse {
  gamesPlayed: number;
  kills: number;
  deaths: number;
  kdRatio: number;
  gameModes: Partial<
    Record<
      string,
      {
        gamesPlayed: number;
        kills: number;
        deaths: number;
        kdRatio: number;
      }
    >
  >;
}

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
          .andWhere('match.utcStartSeconds BETWEEN :start AND :end', {
            start: start / 1000,
            end: end / 1000,
          });
      },
      relations: ['team', 'team.match'],
    });

    const seasonData: SeasonDataResponse = data
      .filter((matchPlayer) =>
        TROPHY_MODES.includes(matchPlayer.team.match.mode)
      )
      .reduce(
        (allData, curr) => {
          const newTotalKills = allData.kills + curr.kills;
          const newTotalDeaths = allData.deaths + curr.deaths;

          const gameModeData = allData.gameModes[curr.team.match.mode];
          const modeTotalKills = (gameModeData?.kills || 0) + curr.kills;
          const modeTotalDeaths = (gameModeData?.deaths || 0) + curr.deaths;
          const newAllData = {
            ...allData,
            kills: newTotalKills,
            deaths: newTotalDeaths,
            kdRatio: newTotalKills / newTotalDeaths,
            gamesPlayed: allData.gamesPlayed + 1,
            gameModes: {
              ...allData.gameModes,
              [curr.team.match.mode]: {
                ...gameModeData,
                kills: modeTotalKills,
                deaths: modeTotalDeaths,
                kdRatio: modeTotalKills / modeTotalDeaths,
                gamesPlayed: (gameModeData?.gamesPlayed || 0) + 1,
              },
            },
          };

          return newAllData;
        },
        {
          gamesPlayed: 0,
          kills: 0,
          deaths: 0,
          kdRatio: 0,
          gameModes: {},
        } as SeasonDataResponse
      );

    return res.json({ seasonData });
  } catch (e) {
    logger.error(e);
    return res.status(404).json({ error: 'Weekly not found', uno });
  }
};

const router = Router();

router.get('/:uno/:season', getSeasonPlayer);

export default router;
