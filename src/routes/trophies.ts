import { Request, Response, Router } from 'express';
import { Game } from '../entities/Game';
import { Player } from '../entities/Player';
import { Trophy } from '../entities/Trophy';
import { getPlayerData } from '../utils/getPlayerData';

interface ApprovalGame {
  gameId: string;
  dateTime: Date;
  trophies: {
    trophyId: string;
    playerName: string;
    kills: number;
  }[];
}

const createTrophy = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ name: 'Trophy must not be empty' });
  }
  const { dateTime, players, season } = req.body;
  if (!dateTime || !players || !season) {
    console.error('Missing property', dateTime, players, season);
    return res.status(400).json({ error: 'Missing data' });
  }
  const data: Trophy[] = [];

  let game: Game | null = null;
  try {
    game = new Game({ dateTime, season });
    await game.save();
  } catch (err) {
    return res.status(500).json({ error: err });
  }

  await Promise.all(
    players.map(async (p: Partial<Trophy> & { playerId: number }) => {
      const { kills, playerId } = p;
      let player: Player | null = null;
      try {
        player = await Player.findOneOrFail(playerId);
        if (!player) {
          throw new Error();
        }
      } catch (e) {
        return res
          .status(404)
          .json({ player: `Player ${playerId} does not exist` });
      }

      try {
        const trophy = new Trophy({ kills, player, game: game! });
        await trophy.save();
        data.push(trophy);
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: `Something went wrong with player ${playerId}` });
      }
      return;
    })
  );
  return res.json({ data });
};

const getTrophies = async (_: Request, res: Response) => {
  try {
    const trophies = await Trophy.find({
      order: { createdAt: 'DESC' },
      relations: ['player', 'game'],
    });
    return res.json(trophies);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getTrophiesFromNameAndSeason = async (req: Request, res: Response) => {
  const { season, name } = req.params;
  try {
    const player = await Player.findOneOrFail({
      where: {
        name,
      },
      relations: ['trophies', 'trophies.game'],
    });

    const playerData = getPlayerData(player, season);
    return res.json(playerData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getApprovalTrophies = async (_: Request, res: Response) => {
  try {
    const trophies = await Trophy.find({
      order: { createdAt: 'DESC' },
      where: {
        approved: false,
      },
      relations: ['player', 'game'],
    });
    const games: ApprovalGame[] = [];
    trophies.forEach((trophy: Trophy) => {
      const findGameIndex = games.findIndex(
        (game) => game.gameId === trophy.game.id
      );
      if (findGameIndex === -1) {
        games.push({
          gameId: trophy.game.id,
          dateTime: trophy.game.dateTime,
          trophies: [
            {
              trophyId: trophy.id,
              playerName: trophy.name,
              kills: trophy.kills,
            },
          ],
        });
      } else {
        games[findGameIndex].trophies.push({
          trophyId: trophy.id,
          playerName: trophy.name,
          kills: trophy.kills,
        });
      }
    });

    return res.json(games);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getTrophiesBySeasonForPlayers = async (req: Request, res: Response) => {
  const { season } = req.params;
  if (!season) {
    return res.status(500).json({ error: 'No season' });
  }
  const data: any[] = [];
  try {
    const players = await Player.find({
      relations: ['trophies', 'trophies.game'],
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

const approveTrophies = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ name: 'Trophy must not be empty' });
  }
  const { trophies } = req.body;
  if (!trophies) {
    console.error('Missing property', trophies);
    return res.status(400).json({ error: 'Missing data' });
  }
  await Promise.all(
    trophies.map(async (id: string) => {
      try {
        const trophyUpdate = await Trophy.update(id, { approved: true });
        if (
          typeof trophyUpdate.affected !== 'undefined' &&
          trophyUpdate.affected !== null &&
          trophyUpdate.affected < 1
        ) {
          throw new Error();
        }
      } catch (e) {
        return res.status(404).json({ player: `Unable to approve ${id}` });
      }
      return;
    })
  );
  return res.status(204).json();
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

router.post('/', createTrophy);
router.get('/', getTrophies);
router.get('/:name/:season', getTrophiesFromNameAndSeason);
router.post('/approve', approveTrophies);
router.get('/approve', getApprovalTrophies);
router.delete('/:id', deleteTrophy);
router.get('/:season', getTrophiesBySeasonForPlayers);

export default router;
