const API = require('../api.js')();

const BR_KEYS = ['br_brtrios', 'br_brsolo', 'br_brduos', 'br_brquads'];

const attr = [
  'kills',
  'deaths',
  'assists',
  'avgLifeTime',
  'headshots',
  'gulagDeaths',
  'gulagKills',
  'matchesPlayed',
  'damageDone',
  'damageTaken',
  'kdRatio',
  'killsPerGame',
];

export const mapWeeklyData = async (
  platformId: string,
  platformType: string
) => {
  const data = await API.MWweeklystats(platformId, platformType);

  const modes = data.wz.mode;
  const KD = Object.keys(modes)
    .filter((key) => BR_KEYS.includes(key))
    .reduce(
      (acc, modeName) => {
        const modeData = modes[modeName].properties;
        const modeDataByKey = attr.reduce((allData, currKey) => {
          return {
            ...allData,
            [currKey]: acc[modeName]?.[currKey] || 0 + modeData[currKey],
          };
        }, {} as any);
        const allModeDataByKey = attr.reduce((accumData, currKey) => {
          return {
            ...accumData,
            [currKey]: modeDataByKey[currKey] + (acc.all[currKey] || 0),
          };
        }, acc.all);

        const total = {
          ...acc,
          [modeName]: {
            ...modeDataByKey,
            kdRatio: Number(
              (
                modeDataByKey.kills /
                (modeDataByKey.deaths === 0 ? 1 : modeDataByKey.deaths)
              ).toFixed(2)
            ),
          },
          all: {
            ...allModeDataByKey,
            kdRatio: Number(
              (
                allModeDataByKey.kills /
                (allModeDataByKey.deaths === 0 ? 1 : allModeDataByKey.deaths)
              ).toFixed(2)
            ),
          },
        };
        return total;
      },
      { all: {} } as any
    );

  KD.all.killsPerGame = KD.all.kills / KD.all.matchesPlayed;

  return KD;
};
