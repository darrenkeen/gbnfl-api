// import { validate } from 'class-validator';
import { validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import { logger } from '../config/logger';
import { OverallGoal } from '../entities/OverallGoal';
import { Player } from '../entities/Player';
import isAuth from '../middleware/isAuth';

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

  try {
    const overallGoal = await OverallGoal.findOneOrFail({
      where: {
        player: {
          id: player.id,
        },
      },
    });

    return res.json({ data: overallGoal });
  } catch (err) {
    logger.error(err.message);
    return res.status(404).json({ error: `Can't find any overall data` });
  }
};

const setOverallGoal = async (req: Request, res: Response) => {
  const { uno } = req.params;
  const body = req.body;

  let player: Player | null = null;

  try {
    player = await Player.findOneOrFail({
      where: {
        uno,
      },
    });
  } catch (e) {
    logger.error(e.message);
    return res.status(404).json({ error: `Can't find player with uno ${uno}` });
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

router.get('/', isAuth, getPlayersOverallGoal);
router.post('/:uno', setOverallGoal);

export default router;
