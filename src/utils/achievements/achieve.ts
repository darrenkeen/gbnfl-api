import { Achievement, AchievementType } from '../../entities/Achievement';
import { MatchData } from '../../entities/MatchData';
import { MatchDataPlayer } from '../../entities/MatchDataPlayer';
import { MatchDataTeam } from '../../entities/MatchDataTeam';
import { Player } from '../../entities/Player';

export const getAchievedWhenAchieveModifier = (
  matches: MatchData[],
  achievement: Achievement,
  player: Player
) => {
  let achieved = false;
  for (
    let matchInd = 0, matchLen = matches.length;
    matchInd < matchLen;
    matchInd++
  ) {
    const match = matches[matchInd];
    for (
      let teamInd = 0, teamLen = match.teams.length;
      teamInd < teamLen;
      teamInd++
    ) {
      let matchedPlayer = false;
      const team = match.teams[teamInd];
      for (
        let playerInd = 0, playerLen = team.players.length;
        playerInd < playerLen;
        playerInd++
      ) {
        const matchPlayer = team.players[playerInd];
        if (matchPlayer.uno === player.uno) {
          matchedPlayer = true;
          switch (achievement.type) {
            case AchievementType.Kills: {
              achieved = matchPlayer.kills >= achievement.value;
              break;
            }
            case AchievementType.Killer: {
              achieved = getHighestKillerInTeam(team, player);
              break;
            }
            case AchievementType.Gulag: {
              achieved = getIsGulagWinInMatch(team.players[playerInd]);
              break;
            }
            case AchievementType.Win: {
              achieved = team.teamPlacement === 1;
              break;
            }
            case AchievementType.TopTen: {
              achieved = team.teamPlacement < 11;
              break;
            }
          }
          break;
        }
      }
      if (matchedPlayer) {
        break;
      }
    }
    if (achieved) {
      break;
    }
  }
  return achieved;
};

export const getIsGulagWinInMatch = (playerInMatch: MatchDataPlayer) => {
  return playerInMatch.gulagKills > 0;
};

export const getHighestKillerInTeam = (team: MatchDataTeam, player: Player) => {
  let achieved = false;
  const max = team.players.sort((prev, current) => {
    return prev.kills > current.kills ? -1 : 1;
  });
  if (max.length > 1) {
    achieved = max[0].uno === player.uno && max[1].kills !== max[0].kills;
  } else if (max.length > 0) {
    achieved = max[0].uno === player.uno;
  }

  return achieved;
};
