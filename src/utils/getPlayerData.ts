import { Player } from '../entities/Player';

export const getPlayerData = (player: Player, season: number | string) => {
  const playerData = {
    name: player.name,
    platformId: player.platformId,
    platformType: player.platformType,
    sbmmUrl: player.sbmmUrl,
    totalKills: 0,
    trophyCount: 0,
    unapprovedCount: 0,
  };
  const trophies =
    season === 'all'
      ? player.trophies
      : player.trophies.filter(
          (trophy) => trophy.game.season === Number(season)
        );
  const approvedTrophies = trophies.filter((trophy) => trophy.approved);
  playerData.totalKills = approvedTrophies.reduce((acc, curr) => {
    return acc + curr.kills;
  }, 0);
  playerData.trophyCount = approvedTrophies.length;
  playerData.unapprovedCount = trophies.filter(
    (trophy) => !trophy.approved
  ).length;

  return playerData;
};
