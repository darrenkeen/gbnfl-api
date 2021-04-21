import { Request, Response, Router } from 'express';
import { getConnection, IsNull, Not } from 'typeorm';
import { nanoid } from 'nanoid';

import { MatchData } from '../entities/MatchData';
import { Player } from '../entities/Player';
import auth from '../middleware/auth';
import { buildMatchData } from '../utils/buildMatchData';
import { getMissionStats } from '../utils/getMissionStats';

const API = require('call-of-duty-api')();

const getMatches = async (_: Request, res: Response) => {
  try {
    const matchData = await MatchData.find({
      relations: ['trophies', 'trophies.player', 'teams', 'teams.players'],
    });
    return res.json({ data: matchData });
  } catch (e) {
    console.error(e);
    return res.send(500).json({ error: e });
  }
};

const trackMatch = async (_: Request, res: Response) => {
  // const { pass } = req.params;
  // Take all players with uno
  let players: Player[] | null = null;
  try {
    players = await Player.find({ where: { uno: Not(IsNull()) } });
    if (!players || players.length < 1) {
      throw new Error('No players');
    }
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e });
  }

  // Look at API for each player and store matchId for wins
  const winMatches: Record<string, { unos: string[] }> = {};
  try {
    await Promise.all(
      players!.map(async (player) => {
        const latestPlayerData = await API.MWcombatwz(
          player.platformId,
          player.platformType
        );
        latestPlayerData.matches.forEach((match: any) => {
          if (match.playerStats.teamPlacement === 3) {
            if (!Object.keys(winMatches).includes(match.matchID)) {
              winMatches[match.matchID] = {
                unos: [match.player.uno],
              };
            } else {
              winMatches[match.matchID] = {
                ...winMatches[match.matchID],
                unos: [...winMatches[match.matchID].unos, match.player.uno],
              };
            }
          }
        });
      })
    );
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e });
  }

  console.log('winMatches', winMatches);

  // Get match Data for each Win
  const winData: Record<
    string,
    {
      data: any;
      unos: string[];
    }
  > = {};

  try {
    await Promise.all(
      Object.keys(winMatches).map(async (key) => {
        const matchExist = await MatchData.findOne({
          where: { inGameMatchId: key },
        });
        if (matchExist) {
          return;
        }
        const currentMatch = await API.MWFullMatchInfowz(key, 'all');
        winData[key] = {
          data: buildMatchData(currentMatch),
          unos: winMatches[key].unos,
        };
      })
    );
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e });
  }

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
                  await tm.query(
                    `
                  insert into "matchDataPlayer" (
                    "id", "username", "teamId", "uno", "missionsComplete", "missionStats", "headshots", "assists", "scorePerMinute", "kills", "score", "medalXp", "matchXp", "scoreXp", "wallBangs", "totalXp", "challengeXp", "distanceTraveled", "teamSurvivalTime", "deaths", "kdRatio", "objectiveBrMissionPickupTablet", "bonusXp", "gulagDeaths", "timePlayed", "executions", "gulagKills", "nearmisses", "objectiveBrCacheOpen","percentTimeMoving", "miscXp", "longestStreak", "damageDone", "damageTaken"
                  )
                  values (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34
                  )
                  returning *
                  `,
                    [
                      nanoid(10),
                      teamPlayer.player.username,
                      matchDataTeam[0].id,
                      teamPlayer.player.uno,
                      teamPlayer.player.brMissionStats.missionsComplete,
                      getMissionStats(
                        teamPlayer.player.brMissionStats.missionStatsByType
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
                    ]
                  );
                })
              );
            })
          );
          // TODO: How to get existing matches in and trophies added ??

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
                throw new Error(`No player with ${uno} uno.`);
              }

              console.log(player[0]);

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
        return res.json({ message: 'success' });
      })
    );
    return res.status(204).json();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
  }
};

const router = Router();

router.get('/:pass', auth, trackMatch);
router.get('/', getMatches);

export default router;
