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
            if (
              key === season &&
              trophy.match.utcStartSeconds > start / 1000 &&
              trophy.match.utcStartSeconds < end / 1000
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
