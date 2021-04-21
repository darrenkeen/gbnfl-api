type MissionStats = Record<
  string,
  {
    count: number;
  }
>;

export const getMissionStats = (missionStats: MissionStats) => {
  return Object.keys(missionStats).map(
    (key) => `${key}-${missionStats[key].count}`
  );
};
