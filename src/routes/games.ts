import { Request, Response, Router } from 'express';
import { Game } from '../entities/Game';

const getGames = async (_: Request, res: Response) => {
  try {
    const games = await Game.find({
      order: { dateTime: 'DESC' },
      relations: ['trophies', 'trophies.player'],
    });
    return res.json(games);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const router = Router();

router.get('/', getGames);

export default router;
