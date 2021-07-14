import { Achievement, AchievementType } from '../../entities/Achievement';
import { MatchData } from '../../entities/MatchData';
import { Player } from '../../entities/Player';
import { checkTruthyInARow } from '../helpers';
import { getHighestKillerInTeam } from './achieve';

const checkReqInARow = (array: any, length: number, req: number) => {
  let count = 0;

  return array.some((a: any) => {
    if (a < req) {
      count = 0;
    } else {
      count++;
    }
    return count === length;
  });
};

export const getIsGulagInARow = (
  matches: MatchData[],
  rowRequired: number,
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

  achieved = checkTruthyInARow(
    flatPlayerStats.map((p) => p.gulagKills > 0),
    rowRequired
  );

  return achieved;
};

export const getIsTopKillerInARow = (
  matches: MatchData[],
  rowRequired: number,
  player: Player
) => {
  let achieved = false;

  const flatTeamStats = matches.map((match) => {
    const teamWithPlayer = match.teams.find((team) =>
      team.players.some((p) => p.uno === player.uno)
    );
    if (!teamWithPlayer) {
      throw new Error('Player not in match');
    }
    return getHighestKillerInTeam(teamWithPlayer, player);
  });

  achieved = checkTruthyInARow(flatTeamStats, rowRequired);

  return achieved;
};

export const getIsTopTenInARow = (
  matches: MatchData[],
  rowRequired: number,
  player: Player
) => {
  let achieved = false;

  const flatTeamStats = matches.map((match) => {
    const teamWithPlayer = match.teams.find((team) =>
      team.players.some((p) => p.uno === player.uno)
    );
    if (!teamWithPlayer) {
      throw new Error('Player not in match');
    }
    return teamWithPlayer;
  });

  achieved = checkTruthyInARow(
    flatTeamStats.map((team) => team.teamPlacement <= 10),
    rowRequired
  );

  return achieved;
};

export const getIsWinInARow = (
  matches: MatchData[],
  rowRequired: number,
  player: Player
) => {
  let achieved = false;

  const flatTeamStats = matches.map((match) => {
    const teamWithPlayer = match.teams.find((team) =>
      team.players.some((p) => p.uno === player.uno)
    );
    if (!teamWithPlayer) {
      throw new Error('Player not in match');
    }
    return teamWithPlayer;
  });

  achieved = checkTruthyInARow(
    flatTeamStats.map((team) => team.teamPlacement === 1),
    rowRequired
  );

  return achieved;
};

export const getIsKillsInARow = (
  matches: MatchData[],
  killsRequired: number,
  rowRequired: number,
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

  achieved = checkReqInARow(
    flatPlayerStats.map((stat) => stat.kills),
    rowRequired,
    killsRequired
  );

  return achieved;
};

export const getAchievedWhenRowModifier = (
  matches: MatchData[],
  achievement: Achievement,
  player: Player
) => {
  let achieved = false;
  switch (achievement.type) {
    case AchievementType.Kills: {
      achieved = getIsKillsInARow(
        matches,
        achievement.value,
        achievement.modifier,
        player
      );
      break;
    }
    case AchievementType.Killer: {
      achieved = getIsTopKillerInARow(matches, achievement.modifier, player);
      break;
    }
    case AchievementType.Gulag: {
      achieved = getIsGulagInARow(matches, achievement.modifier, player);
      break;
    }
    case AchievementType.TopTen: {
      achieved = getIsTopTenInARow(matches, achievement.modifier, player);
      break;
    }
    case AchievementType.Win: {
      achieved = getIsWinInARow(matches, achievement.modifier, player);
      break;
    }
  }
  return achieved;
};
