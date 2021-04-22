import { SEASON_START_END } from '../constants';
import { Player } from '../entities/Player';

export const getPlayerData = (player: Player, season: number | string) => {
  const playerData = {
    name: player.name,
    platformId: player.platformId,
    platformType: player.platformType,
    uno: player.uno,
    trophyCount: 0,
  };
  const trophies =
    season === 'all'
      ? player.trophies
      : player.trophies.filter((trophy) => {
          let isSeason = false;
          for (const key in SEASON_START_END) {
            const { start, end } = SEASON_START_END[key];
            console.log(
              new Date(start),
              new Date(end),
              new Date(trophy.match.utcStartSeconds * 1000),
              trophy.match.utcStartSeconds * 1000 > start
            );
            if (
              trophy.match.utcStartSeconds * 1000 > start &&
              trophy.match.utcStartSeconds * 1000 < end &&
              key === season
            ) {
              isSeason = true;
              break;
            }
          }
          return isSeason;
        });
  playerData.trophyCount = trophies.length;
  return playerData;
};
