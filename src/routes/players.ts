import { isEmpty } from 'class-validator';
import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { Player } from '../entities/Player';
import cacheTimestamp from '../middleware/cacheTimestamp';
import { buildResponse } from '../utils/buildResponse';

const getPlayers = async (_: Request, res: Response) => {
  try {
    const players = await Player.find({
      order: { createdAt: 'DESC' },
      relations: ['matches', 'matches.team', 'matches.team.match'],
    });
    return res.json(buildResponse(res, players));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getPlayerByName = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const player = await Player.findOneOrFail({
      where: [
        {
          name,
        },
      ],
      relations: ['matches', 'matches.team', 'matches.team.match'],
    });
    return res.json(buildResponse(res, player));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: `${name} does not exist` });
  }
};

const getPlayerByUno = async (req: Request, res: Response) => {
  const { uno } = req.params;
  try {
    const player = await Player.findOneOrFail({
      where: {
        uno,
      },
    });
    return res.json(buildResponse(res, player));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: `${name} does not exist` });
  }
};

const createPlayer = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ name: 'Player must not be empty' });
  }
  const { id, name, sbmmUrl } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ name: 'Player must not be empty' });
  }

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = 'Name must not be empty';
    if (isEmpty(sbmmUrl)) errors.title = 'SBMM URL must not be empty';

    const player = await getRepository(Player)
      .createQueryBuilder('player')
      .where('lower(player.name) = :name', { name: name.toLowerCase() })
      .getOne();

    if (player) errors.name = 'Player exists already';

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  }

  try {
    const player = new Player({ id, name, sbmmUrl });
    await player.save();
    return res.json(buildResponse(res, player));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

const deletePlayer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const del = await Player.delete(id);
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
      .json({ error: 'There was a problem deleting the player' });
  }
};

const updatePlayer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const del = await Player.update(id, data);
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

router.get('/', cacheTimestamp, getPlayers);
router.get('/:name', getPlayerByName);
router.get('/uno/:name', getPlayerByUno);
router.post('/', createPlayer);
router.delete('/:id', deletePlayer);
router.put('/:id', updatePlayer);

export default router;
