interface MatchPlayers {
  utcStartSeconds: number;
  utcEndSeconds: number;
  map: string;
  mode: string;
  matchID: string;
  duration: number;
  playlistName: string | null;
  version: number;
  gameType: string;
  playerCount: number;
  playerStats: {
    kills: number;
    medalXp: number;
    objectiveLastStandKill: number;
    matchXp: number;
    scoreXp: number;
    wallBangs: number;
    score: number;
    totalXp: number;
    headshots: number;
    assists: number;
    challengeXp: number;
    rank: number;
    scorePerMinute: number;
    distanceTraveled: number;
    teamSurvivalTime: number;
    deaths: number;
    kdRatio: number;
    objectiveBrDownEnemyCircle2: number;
    objectiveBrMissionPickupTablet: number;
    bonusXp: number;
    objectiveReviver: number;
    objectiveBrKioskBuy: number;
    gulagDeaths: number;
    timePlayed: number;
    executions: number;
    gulagKills: number;
    nearmisses: number;
    objectiveBrCacheOpen: number;
    percentTimeMoving: number;
    miscXp: number;
    longestStreak: number;
    teamPlacement: number;
    damageDone: number;
    damageTaken: number;
  };
  player: {
    team: string;
    rank: number;
    username: string;
    uno: string;
    clantag: string;
    brMissionStats: {
      missionsComplete: number;
      totalMissionXpEarned: number;
      totalMissionWeaponXpEarned: number;
      missionStatsByType: {
        assassination: {
          weaponXp: number;
          xp: number;
          count: number;
        };
        scavenger: {
          weaponXp: number;
          xp: number;
          count: number;
        };
      };
    };
  };
  teamCount: number;
  privateMatch: boolean;
}

interface MatchData {
  status: string;
  data: {
    allPlayers: MatchPlayers[];
  };
}

export const buildMatchData = (data: MatchData) => {
  const players = data.data.allPlayers;

  const groups = players.reduce((groups, player) => {
    const group = groups[player.player.team]?.players || [];
    group.push(player);
    if (!groups[player.player.team]) {
      groups[player.player.team] = {
        players: group,
        kills: player.playerStats.kills,
        deaths: player.playerStats.deaths,
        teamKdRatio: player.playerStats.kills / player.playerStats.deaths,
        teamSurvivalTime: player.playerStats.teamSurvivalTime,
        teamPlacement: player.playerStats.teamPlacement,
      };
    } else {
      const kills = groups[player.player.team].kills + player.playerStats.kills;
      const deaths =
        groups[player.player.team].deaths + player.playerStats.deaths;

      groups[player.player.team].players = group;
      groups[player.player.team].kills = kills;
      groups[player.player.team].deaths = deaths;
      groups[player.player.team].teamKdRatio = kills / deaths;
    }
    return groups;
  }, {} as Record<string, any>);

  return {
    teams: groups,
    playerCount: players[0].playerCount,
    mode: players[0].mode,
    duration: players[0].duration,
    utcStartSeconds: players[0].utcStartSeconds,
    utcEndSeconds: players[0].utcEndSeconds,
  };
};
