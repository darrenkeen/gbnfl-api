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

const updateGame = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const del = await Game.update(id, data);
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
      .json({ error: 'There was a problem updating the player' });
  }
};

const router = Router();

router.get('/', getGames);
router.put('/:id', updateGame);

export default router;
