import { Achievement, AchievementType } from '../../entities/Achievement';
import { MatchData } from '../../entities/MatchData';
import { Player } from '../../entities/Player';
import { getHighestKillerInTeam } from './achieve';

export const getIsKillsInLast = (
  matches: MatchData[],
  killsRequired: number,
  player: Player
) => {
  let achieved = false;

  const flatPlayerStats = matches.map((match) => {
    const team = match.teams.find((team) => {
      return team.players.find((p) => p.uno === player.uno);
    });
    if (!team) {
      throw new Error('Cant find team in players list for flatPlayerStats');
    }
    const playerInTeam = team.players.find((p) => p.uno === player.uno);
    return playerInTeam!;
  });

  let count = 0;
  for (let i = 0; i < flatPlayerStats.length; i++) {
    count = flatPlayerStats[i].kills + count;
    if (count >= killsRequired) {
      achieved = true;
      break;
    }
  }

  return achieved;
};

export const getIsTopKillerInLast = (
  matches: MatchData[],
  modifierRequired: number,
  player: Player
) => {
  let achieved = false;

  const flatTeamStats = matches
    .map((match) => {
      const teamWithPlayer = match.teams.find((team) =>
        team.players.some((p) => p.uno === player.uno)
      );
      if (!teamWithPlayer) {
        throw new Error('Player not in match');
      }
      return getHighestKillerInTeam(teamWithPlayer, player);
    })
    .filter((isHighest) => isHighest);

  achieved = flatTeamStats.length >= modifierRequired;
  return achieved;
};

export const getIsGulagInLast = (
  matches: MatchData[],
  modifierRequired: number,
  player: Player
) => {
  let achieved = false;

  const flatPlayerStats = matches
    .map((match) => {
      const team = match.teams.find((team) => {
        return team.players.find((p) => p.uno === player.uno);
      });
      if (!team) {
        throw new Error('Cant find team in players list for flatPlayerStats');
      }
      const playerInTeam = team.players.find((p) => p.uno === player.uno);
      if (!playerInTeam) {
        return false;
      }
      return playerInTeam.gulagKills > 0;
    })
    .filter((wonGulag) => wonGulag);

  achieved = flatPlayerStats.length >= modifierRequired;
  return achieved;
};

export const getIsTopTenInLast = (
  matches: MatchData[],
  modifierRequired: number,
  player: Player
) => {
  let achieved = false;

  const flatTeamStats = matches
    .map((match) => {
      const teamWithPlayer = match.teams.find((team) =>
        team.players.some((p) => p.uno === player.uno)
      );
      if (!teamWithPlayer) {
        throw new Error('Player not in match');
      }
      return teamWithPlayer.teamPlacement <= 10;
    })
    .filter((isTopTen) => isTopTen);

  achieved = flatTeamStats.length >= modifierRequired;
  return achieved;
};

export const getIsWinInLast = (
  matches: MatchData[],
  modifierRequired: number,
  player: Player
) => {
  let achieved = false;

  const flatTeamStats = matches
    .map((match) => {
      const teamWithPlayer = match.teams.find((team) =>
        team.players.some((p) => p.uno === player.uno)
      );
      if (!teamWithPlayer) {
        throw new Error('Player not in match');
      }
      return teamWithPlayer.teamPlacement === 1;
    })
    .filter((isWin) => isWin);

  achieved = flatTeamStats.length >= modifierRequired;
  return achieved;
};

export const getAchievedWhenLastModifier = (
  matches: MatchData[],
  achievement: Achievement,
  player: Player
) => {
  let achieved = false;
  switch (achievement.type) {
    case AchievementType.Kills: {
      achieved = getIsKillsInLast(matches, achievement.value, player);
      break;
    }
    case AchievementType.Killer: {
      achieved = getIsTopKillerInLast(matches, achievement.value, player);
      break;
    }
    case AchievementType.Gulag: {
      achieved = getIsGulagInLast(matches, achievement.value, player);
      break;
    }
    case AchievementType.TopTen: {
      achieved = getIsTopTenInLast(matches, achievement.value, player);
      break;
    }
    case AchievementType.Win: {
      achieved = getIsWinInLast(matches, achievement.value, player);
      break;
    }
  }
  return achieved;
};
