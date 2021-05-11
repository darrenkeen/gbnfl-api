import { Request, Response, Router } from 'express';
import { Between, getConnection, IsNull, Not } from 'typeorm';
import { nanoid } from 'nanoid';

import { MatchData } from '../entities/MatchData';
import { Player } from '../entities/Player';
import auth from '../middleware/auth';
import { buildMatchData } from '../utils/buildMatchData';
import { getMissionStats } from '../utils/getMissionStats';
import {
  SEASON_START_END,
  TROPHY_MODES,
  WITH_RANK_SOLO_MODE,
} from '../constants';
import cache from '../middleware/cache';
import { logger } from '../config/logger';

const API = require('call-of-duty-api')();

const getMatches = async (_: Request, res: Response) => {
  try {
    const matchData = await MatchData.find({
      relations: ['trophies', 'trophies.player', 'teams', 'teams.players'],
    });
    return res.json({ data: matchData });
  } catch (e) {
    logger.error(e);
    return res.send(500).json({ error: e });
  }
};

const getSingleMatch = async (req: Request, res: Response) => {
  const { matchDataId } = req.params;
  try {
    const matchData = await MatchData.findOneOrFail(matchDataId, {
      relations: ['trophies', 'trophies.player', 'teams', 'teams.players'],
    });
    return res.json({ data: matchData });
  } catch (e) {
    logger.error(e);
    return res.send(404).json({ error: 'Match not found' });
  }
};

const getMatchesBySeason = async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-cache');
  const { season } = req.params;
  if (!SEASON_START_END[season]) {
    logger.error(`Season ${season} doesn't exist`);
    return res.status(404).json({ error: `Season ${season} doesn't exist` });
  }
  try {
    const { start, end } = SEASON_START_END[season];

    const matchData = await MatchData.find({
      where: { utcStartSeconds: Between(start / 1000, end / 1000) },
      relations: ['trophies', 'trophies.player', 'teams', 'teams.players'],
    });
    return res.json({ data: matchData });
  } catch (e) {
    logger.error(e);
    return res.send(500).json({ error: e });
  }
};

const trackMatch = async (_: Request, res: Response) => {
  // Take all players with uno
  let players: Player[] | null = null;
  try {
    players = await Player.find({ where: { uno: Not(IsNull()) } });
    if (!players || players.length < 1) {
      throw new Error('No players');
    }
  } catch (e) {
    logger.error(e);
    return res.status(400).json({ error: e });
  }

  // Look at API for each player and store matchId for wins and losses (wins contain only ranked game modes - losses contain them all!)
  const wonRankedMatches: Record<string, { unos: string[] }> = {};
  const lostMatches: Record<string, { unos: string[] }> = {};
  try {
    await Promise.all(
      players.map(async (player) => {
        try {
          const latestPlayerData = await API.MWcombatwz(
            player.platformId,
            player.platformType
          );
          latestPlayerData.matches.forEach((match: any) => {
            if (
              match.playerStats.teamPlacement === 1 &&
              TROPHY_MODES.includes(match.mode)
            ) {
              if (!Object.keys(wonRankedMatches).includes(match.matchID)) {
                wonRankedMatches[match.matchID] = {
                  unos: [match.player.uno],
                };
              } else {
                wonRankedMatches[match.matchID] = {
                  ...wonRankedMatches[match.matchID],
                  unos: [
                    ...wonRankedMatches[match.matchID].unos,
                    match.player.uno,
                  ],
                };
              }
            } else {
              if (!Object.keys(lostMatches).includes(match.matchID)) {
                lostMatches[match.matchID] = {
                  unos: [match.player.uno],
                };
              } else {
                lostMatches[match.matchID] = {
                  ...lostMatches[match.matchID],
                  unos: [...lostMatches[match.matchID].unos, match.player.uno],
                };
              }
            }
          });
        } catch (e) {
          logger.error(
            JSON.stringify({
              error: {
                message: e,
                platformId: player.platformId,
              },
            })
          );
        }
      })
    );
  } catch (e) {
    logger.error(JSON.stringify(e));
  }
  // Get match Data for each Win and each loss
  const winData: Record<
    string,
    {
      data: any;
      unos: string[];
    }
  > = {};
  const lostData: Record<
    string,
    {
      data: any;
      unos: string[];
    }
  > = {};

  try {
    await Promise.all(
      Object.keys(wonRankedMatches).map(async (key) => {
        const matchExist = await MatchData.findOne({
          where: { inGameMatchId: key },
        });
        if (matchExist) {
          return;
        }
        const currentMatch = await API.MWFullMatchInfowz(key, 'all');
        winData[key] = {
          data: buildMatchData(currentMatch),
          unos: wonRankedMatches[key].unos,
        };
      })
    );
  } catch (e) {
    logger.error(e);
    return res.status(400).json({ error: e });
  }

  try {
    await Promise.all(
      Object.keys(lostMatches).map(async (key) => {
        const matchExist = await MatchData.findOne({
          where: { inGameMatchId: key },
        });
        if (matchExist) {
          return;
        }
        const currentMatch = await API.MWFullMatchInfowz(key, 'all');
        lostData[key] = {
          data: buildMatchData(currentMatch),
          unos: lostMatches[key].unos,
        };
      })
    );
  } catch (e) {
    logger.error(e);
    return res.status(400).json({ error: e });
  }

  // For each win, save match data, then look through teams and save team data, then loop through players in team and save player data
  // If players uno matches an uno in the unos list, then save the playerId for tracking
  try {
    await Promise.all(
      Object.keys(winData).map(async (winKey) => {
        const data = winData[winKey].data;
        const unos = winData[winKey].unos;

        await getConnection().transaction(async (tm) => {
          const matchData = await tm.query(
            `
              insert into "matchData" ("id", "playerCount", "mode", "utcStartSeconds", "utcEndSeconds", "inGameMatchId")
              values ($1, $2, $3, $4, $5, $6)
              returning *
            `,
            [
              nanoid(10),
              data.playerCount,
              data.mode,
              data.utcStartSeconds,
              data.utcEndSeconds,
              winKey,
            ]
          );

          await Promise.all(
            Object.keys(data.teams).map(async (teamName) => {
              const team = data.teams[teamName];

              const matchDataTeam = await tm.query(
                `
                  insert into "matchDataTeam" ("id", "teamName", "teamPlacement", "matchId")
                  values ($1, $2, $3, $4)
                  returning *
                `,
                [nanoid(10), teamName, team.teamPlacement, matchData[0].id]
              );

              await Promise.all(
                team.players.map(async (teamPlayer: any) => {
                  let playerId: string | null = null;
                  if (unos.includes(teamPlayer.player.uno)) {
                    const player = await tm.query(
                      `
                        select * from "players" where uno=$1 LIMIT 1
                      `,
                      [teamPlayer.player.uno]
                    );
                    if (player && player.length !== 0) {
                      playerId = player[0].id;
                    }
                  }
                  await tm.query(
                    `
                    insert into "matchDataPlayer" (
                      "id", "username", "teamId", "uno", "missionsComplete", "missionStats", "headshots", "assists", "scorePerMinute", "kills", "score", "medalXp", "matchXp", "scoreXp", "wallBangs", "totalXp", "challengeXp", "distanceTraveled", "teamSurvivalTime", "deaths", "kdRatio", "objectiveBrMissionPickupTablet", "bonusXp", "gulagDeaths", "timePlayed", "executions", "gulagKills", "nearmisses", "objectiveBrCacheOpen","percentTimeMoving", "miscXp", "longestStreak", "damageDone", "damageTaken", "playerId"
                    )
                    values (
                      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35
                    )
                    returning *
                    `,
                    [
                      nanoid(10),
                      teamPlayer.player.username,
                      matchDataTeam[0].id,
                      teamPlayer.player.uno,
                      teamPlayer.player.brMissionStats?.missionsComplete || 0,
                      getMissionStats(
                        teamPlayer.player.brMissionStats?.missionStatsByType ||
                          {}
                      ),
                      teamPlayer.playerStats.headshots,
                      teamPlayer.playerStats.assists,
                      teamPlayer.playerStats.scorePerMinute,
                      teamPlayer.playerStats.kills,
                      teamPlayer.playerStats.score,
                      teamPlayer.playerStats.medalXp,
                      teamPlayer.playerStats.matchXp,
                      teamPlayer.playerStats.scoreXp,
                      teamPlayer.playerStats.wallBangs,
                      teamPlayer.playerStats.totalXp,
                      teamPlayer.playerStats.challengeXp,
                      teamPlayer.playerStats.distanceTraveled,
                      teamPlayer.playerStats.teamSurvivalTime,
                      teamPlayer.playerStats.deaths,
                      teamPlayer.playerStats.kdRatio,
                      teamPlayer.playerStats.objectiveBrMissionPickupTablet ||
                        0,
                      teamPlayer.playerStats.bonusXp,
                      teamPlayer.playerStats.gulagDeaths,
                      teamPlayer.playerStats.timePlayed,
                      teamPlayer.playerStats.executions,
                      teamPlayer.playerStats.gulagKills,
                      teamPlayer.playerStats.nearmisses,
                      teamPlayer.playerStats.objectiveBrCacheOpen || 0,
                      teamPlayer.playerStats.percentTimeMoving,
                      teamPlayer.playerStats.miscXp,
                      teamPlayer.playerStats.longestStreak,
                      teamPlayer.playerStats.damageDone,
                      teamPlayer.playerStats.damageTaken,
                      playerId,
                    ]
                  );
                })
              );
            })
          );

          const matchPlayerUnos = unos.filter((uno) =>
            players!.some((player) => player.uno === uno)
          );

          const isSoloRanked = WITH_RANK_SOLO_MODE.includes(data.mode);

          if (isSoloRanked || matchPlayerUnos.length > 1)
            await Promise.all(
              unos.map(async (uno: string) => {
                let player: Player[] | null = null;
                player = await tm.query(
                  `
                  select * from "players" where uno=$1 LIMIT 1
                `,
                  [uno]
                );

                if (!player || player.length < 1) {
                  return;
                }

                await tm.query(
                  `
                  insert into "trophies" ("id", "name", "matchId")
                  values ($1, $2, $3)
                `,
                  [nanoid(10), player[0].name, matchData[0].id]
                );
              })
            );
        });
      })
    );
    await Promise.all(
      Object.keys(lostData).map(async (lostKey) => {
        const data = lostData[lostKey].data;
        const unos = lostData[lostKey].unos;

        await getConnection().transaction(async (tm) => {
          const matchData = await tm.query(
            `
              insert into "matchData" ("id", "playerCount", "mode", "utcStartSeconds", "utcEndSeconds", "inGameMatchId")
              values ($1, $2, $3, $4, $5, $6)
              returning *
            `,
            [
              nanoid(10),
              data.playerCount,
              data.mode,
              data.utcStartSeconds,
              data.utcEndSeconds,
              lostKey,
            ]
          );

          await Promise.all(
            Object.keys(data.teams).map(async (teamName) => {
              const team = data.teams[teamName];

              const matchDataTeam = await tm.query(
                `
                  insert into "matchDataTeam" ("id", "teamName", "teamPlacement", "matchId")
                  values ($1, $2, $3, $4)
                  returning *
                `,
                [nanoid(10), teamName, team.teamPlacement, matchData[0].id]
              );

              await Promise.all(
                team.players.map(async (teamPlayer: any) => {
                  let playerId: string | null = null;
                  if (unos.includes(teamPlayer.player.uno)) {
                    const player = await tm.query(
                      `
                        select * from "players" where uno=$1 LIMIT 1
                      `,
                      [teamPlayer.player.uno]
                    );
                    if (player && player.length !== 0) {
                      playerId = player[0].id;
                    }
                  }
                  await tm.query(
                    `
                    insert into "matchDataPlayer" (
                      "id", "username", "teamId", "uno", "missionsComplete", "missionStats", "headshots", "assists", "scorePerMinute", "kills", "score", "medalXp", "matchXp", "scoreXp", "wallBangs", "totalXp", "challengeXp", "distanceTraveled", "teamSurvivalTime", "deaths", "kdRatio", "objectiveBrMissionPickupTablet", "bonusXp", "gulagDeaths", "timePlayed", "executions", "gulagKills", "nearmisses", "objectiveBrCacheOpen","percentTimeMoving", "miscXp", "longestStreak", "damageDone", "damageTaken", "playerId"
                    )
                    values (
                      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35
                    )
                    returning *
                    `,
                    [
                      nanoid(10),
                      teamPlayer.player.username,
                      matchDataTeam[0].id,
                      teamPlayer.player.uno,
                      teamPlayer.player.brMissionStats?.missionsComplete || 0,
                      getMissionStats(
                        teamPlayer.player.brMissionStats?.missionStatsByType ||
                          {}
                      ),
                      teamPlayer.playerStats.headshots,
                      teamPlayer.playerStats.assists,
                      teamPlayer.playerStats.scorePerMinute,
                      teamPlayer.playerStats.kills,
                      teamPlayer.playerStats.score,
                      teamPlayer.playerStats.medalXp,
                      teamPlayer.playerStats.matchXp,
                      teamPlayer.playerStats.scoreXp,
                      teamPlayer.playerStats.wallBangs,
                      teamPlayer.playerStats.totalXp,
                      teamPlayer.playerStats.challengeXp,
                      teamPlayer.playerStats.distanceTraveled,
                      teamPlayer.playerStats.teamSurvivalTime,
                      teamPlayer.playerStats.deaths,
                      teamPlayer.playerStats.kdRatio,
                      teamPlayer.playerStats.objectiveBrMissionPickupTablet ||
                        0,
                      teamPlayer.playerStats.bonusXp,
                      teamPlayer.playerStats.gulagDeaths,
                      teamPlayer.playerStats.timePlayed,
                      teamPlayer.playerStats.executions,
                      teamPlayer.playerStats.gulagKills,
                      teamPlayer.playerStats.nearmisses,
                      teamPlayer.playerStats.objectiveBrCacheOpen || 0,
                      teamPlayer.playerStats.percentTimeMoving,
                      teamPlayer.playerStats.miscXp,
                      teamPlayer.playerStats.longestStreak,
                      teamPlayer.playerStats.damageDone,
                      teamPlayer.playerStats.damageTaken,
                      playerId,
                    ]
                  );
                })
              );
            })
          );
        });
      })
    );
    logger.info(
      `Track Match: Updated ${Object.keys(winData).length} wins and ${
        Object.keys(lostData).length
      } losses`
    );
    return res.status(204).json();
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ error: e });
  }
};

const router = Router();

router.get('/track-match', cache('5 minutes'), auth, trackMatch);
router.get('/:season', getMatchesBySeason);
router.get('/id/:matchDataId', getSingleMatch);
router.get('/', getMatches);

export default router;
