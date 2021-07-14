import { Request, Response, Router } from 'express';
import { getRepository, IsNull, Not } from 'typeorm';
import { logger } from '../config/logger';
import { TROPHY_MODES } from '../constants';
import { Achievement } from '../entities/Achievement';
import { AchievementTrack } from '../entities/AchievementTrack';
import { MatchData } from '../entities/MatchData';
import { Player } from '../entities/Player';
import { PlayerAchievement } from '../entities/PlayerAchievement';
import { getPlayersAchievements } from '../utils/getPlayersAchievements';
// import { getPlayersAchievements } from '../utils/getPlayersAchievements';

const getAchievements = async (_: Request, res: Response) => {
  try {
    const achievementData = await Achievement.find();
    return res.json(achievementData);
  } catch (e) {
    logger.error(e.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const createAchievement = async (req: Request, res: Response) => {
  const { body } = req;
  try {
    const achievement = new Achievement(body);
    const createdAchievement = await achievement.save();
    return res.json(createdAchievement);
  } catch (e) {
    logger.error(e.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const deleteAchievement = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const del = await Achievement.delete(id);
    if (
      typeof del.affected !== 'undefined' &&
      del.affected !== null &&
      del.affected < 1
    ) {
      console.error('Nothing affected');
      throw new Error();
    }
    return res.status(204).json();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'There was a problem deleting the achievement' });
  }
};

const getAchievementsForPlayer = async (req: Request, res: Response) => {
  const { uno } = req.params;
  let player: Player | null = null;

  try {
    player = await Player.findOneOrFail({
      where: {
        uno,
      },
    });
  } catch (e) {
    logger.error(JSON.stringify(e));
    return res.status(404).json({ error: `Player with uno ${uno} not found` });
  }

  try {
    const achievementData = await PlayerAchievement.find({
      where: {
        player: {
          id: player.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['achievement', 'player'],
    });
    return res.json(achievementData);
  } catch (e) {
    logger.error(e.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const createPlayerAchievement = async (req: Request, res: Response) => {
  const {
    body,
    params: { uno },
  } = req;

  let player: Player | null = null;
  try {
    player = await Player.findOneOrFail({
      where: {
        uno,
      },
    });
  } catch (e) {
    logger.error(JSON.stringify(e));
    return res.status(404).json({ error: `Player with uno ${uno} not found` });
  }

  let achievement: Achievement | null = null;

  try {
    achievement = await Achievement.findOneOrFail(body.achievementId);
  } catch (e) {
    logger.error(JSON.stringify(e));
    return res
      .status(404)
      .json({ error: `Achievement with id ${body.achievementId} not found` });
  }

  try {
    const newPlayerAchievement = new PlayerAchievement({
      player,
      achievement,
    });

    const createdPlayerAchievement = await newPlayerAchievement.save();

    return res.json(createdPlayerAchievement);
  } catch (e) {
    logger.error(JSON.stringify(e));
    return res.status(500).json({ error: `Something went wrong` });
  }
};

const trackPlayerAchievement = async (_: Request, res: Response) => {
  let achievementTrack: AchievementTrack | null = null;
  let testRes: any = null;

  try {
    achievementTrack = (await AchievementTrack.findOne()) || null;
  } catch (e) {
    logger.error(JSON.stringify(e));
  }

  console.log(achievementTrack);

  if (achievementTrack) {
    achievementTrack.createdAt;
    let players: Player[] | null = null;
    try {
      players = await Player.find({ where: { uno: Not(IsNull()) } });
      if (!players || players.length < 1) {
        throw new Error('No players');
      }
    } catch (e) {
      logger.error(e);
      return res.status(400).json({ error: e });
    }

    let achievements: Achievement[] = [];

    try {
      achievements = await Achievement.find();
      if (achievements && achievements.length < 1) {
        throw new Error('No achievements');
      }
    } catch (e) {
      logger.error(JSON.stringify(e));
      return res.status(500).json({ error: 'Something went wrong' });
    }

    let data: MatchData[][] = [];

    try {
      await Promise.all(
        players.map(async (player) => {
          try {
            const startSeconds = Math.floor(
              new Date(achievementTrack!.updatedAt).getTime() / 1000
            );

            const matchDataQuery = getRepository(MatchData)
              .createQueryBuilder('match')
              .leftJoinAndSelect('match.teams', 'teams')
              .leftJoinAndSelect('teams.players', 'players')
              .where((qb) => {
                const subQuery = qb
                  .subQuery()
                  .select('match.id')
                  .from(MatchData, 'match')
                  .leftJoin('match.teams', 'teams')
                  .leftJoin('teams.players', 'players')
                  .where('players.uno = :uno')
                  .getQuery();
                return 'match.id IN ' + subQuery;
              })
              .setParameter('uno', player.uno)
              .andWhere('match.mode IN(:...modes)', { modes: TROPHY_MODES })
              .andWhere('match.utcStartSeconds >= :startSeconds', {
                startSeconds,
              });

            const matchData = await matchDataQuery
              .orderBy({
                'match.utcStartSeconds': 'DESC',
              })
              .take(20)
              .getMany();

            if (matchData.length < 1) {
              return;
            }

            achievements.map((achievement) => {
              const achieved = getPlayersAchievements(
                achievement,
                matchData,
                player
              );
              console.log(achievement.id, achieved, player.name);
            });

            // await Promise.all(
            //   matchData.map(async (m) => {
            //     const playerTeam = m.teams[0];
            //     const player = playerTeam.players[0];
            //     const match = await MatchData.findOne(m.id, {
            //       relations: ['teams', 'teams.players'],
            //     });
            //     if (!match) {
            //       return;
            //     }

            //     const team = match.teams.find((t) => t.id === playerTeam.id);
            //     if (!team) {
            //       return;
            //     }
            //     getPlayersAchievements(achievements, team, player);
            //   })
            // );

            // TODO: Upadate track date
          } catch (e) {
            logger.error(JSON.stringify(e));
          }
        })
      );
    } catch (e) {
      logger.error(JSON.stringify(e));
    }
    if (data.length > 0) {
      return res.json({ data });
    }
  } else {
    try {
      const newAchievementTrack = new AchievementTrack({});
      await newAchievementTrack.save();
    } catch (e) {
      logger.error(JSON.stringify(e));
    }
  }

  return res.json(testRes);
};

const router = Router();

router.get('/', getAchievements);
router.post('/', createAchievement);
router.delete('/:id', deleteAchievement);
router.get('/track-achievements', trackPlayerAchievement);
router.get('/uno/:uno', getAchievementsForPlayer);
router.post('/uno/:uno', createPlayerAchievement);

export default router;
