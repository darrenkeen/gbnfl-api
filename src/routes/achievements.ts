import { Request, Response, Router } from 'express';
import { getRepository, IsNull, Not } from 'typeorm';
import { logger } from '../config/logger';
import { NON_SOLO_TROPHY_MODES, TROPHY_MODES } from '../constants';
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

  try {
    achievementTrack = (await AchievementTrack.findOne()) || null;
  } catch (e) {
    logger.error(JSON.stringify(e));
  }

  console.log(achievementTrack);

  if (!achievementTrack) {
    try {
      const newAchievementTrack = new AchievementTrack({});
      achievementTrack = await newAchievementTrack.save();
    } catch (e) {
      logger.error(JSON.stringify(e));
    }
  }

  if (achievementTrack) {
    let players: Player[] | null = null;
    try {
      players = await Player.find({
        where: { uno: Not(IsNull()) },
        relations: ['achievements', 'achievements.achievement'],
      });
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

    try {
      await Promise.all(
        players.map(async (player) => {
          try {
            const startSeconds = Math.floor(
              new Date(achievementTrack!.updatedAt).getTime() / 1000
            );

            const matchDataWithSolosQuery = getRepository(MatchData)
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

            const matchDataWithSolos = await matchDataWithSolosQuery
              .orderBy({
                'match.utcStartSeconds': 'DESC',
              })
              .take(20)
              .getMany();

            if (matchDataWithSolos.length < 1) {
              return;
            }

            const matchDataWithoutSolosQuery = getRepository(MatchData)
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
              .andWhere('match.mode IN(:...modes)', {
                modes: NON_SOLO_TROPHY_MODES,
              })
              .andWhere('match.utcStartSeconds >= :startSeconds', {
                startSeconds,
              });

            const matchDataWithoutSolos = await matchDataWithoutSolosQuery
              .orderBy({
                'match.utcStartSeconds': 'DESC',
              })
              .take(20)
              .getMany();

            const playerHasAchieved: Achievement[] = [];
            const playerAlreadyAchieved = player.achievements.map(
              (ach) => ach.achievement.id
            );

            // TODO: Just need to double check this does what it says on the tin - updatedAt time means no games so not getting this far
            achievements
              .filter((ach) => playerAlreadyAchieved.includes(ach.id))
              .map((achievement) => {
                if (player.uno === '8457816366480952913') {
                  console.log(achievement.id);
                }
                const achieved = getPlayersAchievements(
                  achievement,
                  {
                    withSolos: matchDataWithSolos,
                    withoutSolos: matchDataWithoutSolos,
                  },
                  player
                );
                if (achieved) {
                  playerHasAchieved.push(achievement);
                }
              });

            await Promise.all(
              playerHasAchieved.map(async (achievement) => {
                try {
                  const playerAchievement = new PlayerAchievement({
                    achievement,
                    player,
                  });
                  const savedPlayerAchievement = await playerAchievement.save();

                  if (!savedPlayerAchievement) {
                    throw new Error(
                      `Could not save ${achievement.id} for ${player.uno}`
                    );
                  }
                } catch (e) {
                  logger.error(JSON.stringify(e));
                }
              })
            );
          } catch (e) {
            logger.error(JSON.stringify(e));
          }
        })
      );
    } catch (e) {
      logger.error(JSON.stringify(e));
    }

    try {
      await AchievementTrack.update(achievementTrack.id, {});
    } catch (e) {
      logger.error('Couldnt update tracker');
    }
  } else {
    return res.status(404).json({ error: 'No achievement track' });
  }

  return res.status(202).json();
};

const router = Router();

router.get('/', getAchievements);
router.post('/', createAchievement);
router.delete('/:id', deleteAchievement);
router.get('/track-achievements', trackPlayerAchievement);
router.get('/uno/:uno', getAchievementsForPlayer);
router.post('/uno/:uno', createPlayerAchievement);

export default router;
