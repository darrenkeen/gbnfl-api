import { Player } from '../entities/Player';

const API = require('call-of-duty-api')();

const BR_KEYS = ['br_brtrios', 'br_brsolo', 'br_brduos', 'br_brquads'];

export const mapWeeklyData = async (player: Partial<Player>) => {
  const data = await API.MWweeklystats(player.platformId, player.platformType);

  const modes = data.wz.mode;
  const KD = Object.keys(modes)
    .filter((key) => BR_KEYS.includes(key))
    .reduce(
      (acc, modeName) => {
        const data = modes[modeName].properties;
        const modeKills = acc[modeName]?.kills || 0 + data.kills;
        const modeDeaths = acc[modeName]?.deaths || 0 + data.deaths;
        const allKills = modeKills + acc.all.kills;
        const allDeaths = modeDeaths + acc.all.deaths;
        const total = {
          ...acc,
          [modeName]: {
            kills: modeKills,
            deaths: modeDeaths,
            kdRatio: Number(
              (modeKills / (modeDeaths === 0 ? 1 : modeDeaths)).toFixed(2)
            ),
          },
          all: {
            kills: allKills,
            deaths: allDeaths,
            kdRatio: Number(
              (allKills / (allDeaths === 0 ? 1 : allDeaths)).toFixed(2)
            ),
          },
        };
        return total;
      },
      { all: { kills: 0, deaths: 0, kdRatio: 0 } } as any
    );

  return KD;
};
