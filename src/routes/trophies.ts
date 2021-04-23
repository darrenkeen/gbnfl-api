import { Request, Response, Router } from 'express';
import { SEASON_START_END } from '../constants';
import { Player } from '../entities/Player';
import { Trophy } from '../entities/Trophy';
import { getPlayerData } from '../utils/getPlayerData';

const getTrophies = async (_: Request, res: Response) => {
  try {
    const trophies = await Trophy.find({
      order: { createdAt: 'DESC' },
      relations: ['player', 'match'],
    });
    return res.json(trophies);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getTrophiesBySeasonForPlayers = async (req: Request, res: Response) => {
  const { season } = req.params;
  const data: any[] = [];
  if (!SEASON_START_END[season]) {
    return res.status(400).json({ error: 'Season not valid' });
  }
  try {
    const players = await Player.find({
      relations: ['trophies', 'trophies.match'],
    });

    players.forEach((player) => {
      const playerData = getPlayerData(player, season);
      data.push(playerData);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  return res.json(
    data.sort((a: { trophyCount: number }, b: { trophyCount: number }) =>
      a.trophyCount > b.trophyCount ? -1 : 0
    )
  );
};

const getTrophiesFromNameAndSeason = async (req: Request, res: Response) => {
  const { season, name } = req.params;
  try {
    const player = await Player.findOneOrFail({
      where: {
        name,
      },
      relations: ['trophies', 'trophies.match'],
    });

    const playerData = getPlayerData(player, season);
    return res.json(playerData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
const getTrophiesFromUnoAndSeason = async (req: Request, res: Response) => {
  const { season, uno } = req.params;
  try {
    const player = await Player.findOneOrFail({
      where: {
        uno,
      },
      relations: ['trophies', 'trophies.match'],
    });

    const playerData = getPlayerData(player, season);
    return res.json(playerData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const deleteTrophy = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const del = await Trophy.delete(id);
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
      .status(500)
      .json({ error: 'There was a problem deleting the trophy' });
  }
};

const router = Router();

router.get('/', getTrophies);
router.get('/:season', getTrophiesBySeasonForPlayers);
router.get('/:name/:season', getTrophiesFromNameAndSeason);
router.get('/uno/:uno/:season', getTrophiesFromUnoAndSeason);
router.delete('/:id', deleteTrophy);

export default router;
