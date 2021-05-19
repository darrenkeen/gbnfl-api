import { Request, Response, Router } from 'express';
import { SelectQueryBuilder } from 'typeorm';
import { logger } from '../config/logger';
import { LifetimePlayer } from '../entities/LifetimePlayer';

const getLifetimePlayer = async (req: Request, res: Response) => {
  const { uno } = req.params;

  try {
    const lifetimeData = await LifetimePlayer.findOneOrFail({
      join: { alias: 'lifetimes', innerJoin: { player: 'lifetimes.player' } },
      where: (queryBuilder: SelectQueryBuilder<LifetimePlayer>) => {
        queryBuilder.where('player.uno = :uno', { uno });
      },
      relations: ['player'],
    });
    return res.json({ data: lifetimeData });
  } catch (e) {
    logger.error(e);
    return res.status(404).json({ error: 'Match not found', uno });
  }
};

const router = Router();

router.get('/:uno', getLifetimePlayer);

export default router;
