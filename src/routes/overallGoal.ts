// import { validate } from 'class-validator';
import { validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import { logger } from '../config/logger';
import { LifetimePlayer } from '../entities/LifetimePlayer';
import { OverallGoal } from '../entities/OverallGoal';
import { Player } from '../entities/Player';
import isAuth from '../middleware/isAuth';
import lastUpdated from '../middleware/lastUpdated';
import { buildLastUpdatedResponse } from '../utils/buildResponse';

const getPlayersOverallGoal = async (req: Request, res: Response) => {
  const { userId } = req.session;
  let player: Player | null = null;

  try {
    player = await Player.findOneOrFail({
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (!player) {
      throw new Error();
    }
  } catch (e) {
    logger.error(`Cant find player with ${userId} user ID`);
    return res
      .status(404)
      .json({ error: `Cant find player with ${userId} ID` });
  }

  let goals: OverallGoal | undefined = undefined;

  try {
    goals = await OverallGoal.findOne({
      where: {
        player: {
          id: player.id,
        },
      },
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(404).json({ error: `Can't find any overall data` });
  }

  let lifetimeData: LifetimePlayer | null = null;

  try {
    lifetimeData = await LifetimePlayer.findOneOrFail({
      where: {
        player: {
          id: player.id,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    });
  } catch (e) {
    logger.error(e.message);
    return res
      .status(404)
      .json({ error: `Can't find lifetime for ${player.uno}` });
  }

  if (!lifetimeData) {
    return res
      .status(404)
      .json({ error: `Can't find lifetime for ${player.uno}` });
  }

  if (goals) {
    const kDKillsRequired =
      Math.ceil(lifetimeData.deaths * goals.kd) - lifetimeData.kills;
    const winsRequired = Math.ceil(
      lifetimeData.gamesPlayed * (goals.winPercent / 100) - lifetimeData.wins
    );
    const topTenRequired = Math.ceil(
      lifetimeData.gamesPlayed * (goals.topTenPercent / 100) -
        lifetimeData.topTen
    );

    return res.json(
      buildLastUpdatedResponse(res, {
        kd: {
          goal: goals.kd,
          current: Math.floor(lifetimeData.kdRatio * 100) / 100,
          required: Math.max(kDKillsRequired, 0),
          isComplete: kDKillsRequired <= 0,
        },
        winPercent: {
          goal: goals.winPercent,
          current:
            Math.floor(
              (lifetimeData.wins / lifetimeData.gamesPlayed) * 100 * 100
            ) / 100,
          required: Math.max(winsRequired, 0),
          isComplete: winsRequired <= 0,
        },
        topTenPercent: {
          goal: goals.topTenPercent,
          current:
            Math.floor(
              (lifetimeData.topTen / lifetimeData.gamesPlayed) * 100 * 100
            ) / 100,
          required: Math.max(topTenRequired, 0),
          isComplete: topTenRequired <= 0,
        },
      })
    );
  } else {
    return res.json(
      buildLastUpdatedResponse(res, {
        kd: {
          goal: 0,
          current: Math.floor(lifetimeData.kdRatio * 100) / 100,
          required: 0,
          isComplete: false,
        },
        winPercent: {
          goal: 0,
          current:
            Math.floor(
              (lifetimeData.wins / lifetimeData.gamesPlayed) * 100 * 100
            ) / 100,
          required: 0,
          isComplete: false,
        },
        topTenPercent: {
          goal: 0,
          current:
            Math.floor(
              (lifetimeData.topTen / lifetimeData.gamesPlayed) * 100 * 100
            ) / 100,
          required: 0,
          isComplete: false,
        },
      })
    );
  }
};

const setOverallGoal = async (req: Request, res: Response) => {
  const { userId } = req.session;
  const { body } = req;
  let player: Player | null = null;

  try {
    player = await Player.findOneOrFail({
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (!player) {
      throw new Error();
    }
  } catch (e) {
    logger.error(`Cant find player with ${userId} user ID`);
    return res
      .status(404)
      .json({ error: `Cant find player with ${userId} ID` });
  }

  try {
    const currentGoal = await OverallGoal.findOne({
      where: {
        player: {
          id: player.id,
        },
      },
    });

    if (!currentGoal) {
      const newGoal = new OverallGoal({
        player,
        kd: body.kd,
        winPercent: body.winPercent,
        topTenPercent: body.topTenPercent,
      });

      const errors = await validate(newGoal);
      if (errors.length > 0) {
        throw new Error('validation-error');
      } else {
        await newGoal.save();
        return res.status(204).json();
      }
    } else {
      const goal = new OverallGoal(body);
      const errors = await validate(goal);
      if (errors.length > 0) {
        throw new Error('validation-error');
      } else {
        const updatedGoal = await OverallGoal.update(currentGoal.id, body);
        if (updatedGoal.affected && updatedGoal.affected < 1) {
          throw new Error(
            `Could not update goal for ${player?.uno || '(no player)'}`
          );
        }
        return res.status(204).json();
      }
    }
  } catch (e) {
    logger.error(e.toString());
    return res.status(500).json({
      error:
        e.message === 'validation-error'
          ? 'Validation error'
          : `There was a problem updating the goal for ${
              player?.uno || '(no player)'
            }`,
    });
  }
};

const router = Router();

router.get('/', isAuth, lastUpdated, getPlayersOverallGoal);
router.post('/', isAuth, setOverallGoal);

export default router;
