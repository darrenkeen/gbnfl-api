import { Request, Response, Router } from 'express';
import { SelectQueryBuilder } from 'typeorm';
import { logger } from '../config/logger';
import { LifetimePlayer } from '../entities/LifetimePlayer';
import lastUpdated from '../middleware/lastUpdated';
import { buildLastUpdatedResponse } from '../utils/buildResponse';

const getLifetimePlayer = async (req: Request, res: Response) => {
  const { uno } = req.params;

  try {
    const lifetimeData = await LifetimePlayer.findOneOrFail({
      join: { alias: 'lifetimes', innerJoin: { player: 'lifetimes.player' } },
      where: (queryBuilder: SelectQueryBuilder<LifetimePlayer>) => {
        queryBuilder.where('player.uno = :uno', { uno });
      },
      order: {
        updatedAt: 'DESC',
      },
    });
    return res.json(buildLastUpdatedResponse(res, lifetimeData));
  } catch (e) {
    logger.error(e.message);
    return res.status(404).json({ error: 'Lifetime not found', uno });
  }
};

const router = Router();

router.get('/:uno', lastUpdated, getLifetimePlayer);

export default router;
