import { MatchDataPlayer } from '../entities/MatchDataPlayer';
import { SeasonDataResponse } from '../routes/season';

const isGulagLoss = (kills: number, deaths: number) => {
  return kills < 1 && deaths > 0;
};

export const mapSeasonData = (data: MatchDataPlayer[]) =>
  data.reduce(
    (allData, curr) => {
      const allGameMode = allData[0];
      allGameMode.kills = allGameMode.kills + curr.kills;
      allGameMode.deaths = allGameMode.deaths + curr.deaths;
      allGameMode.wins =
        curr.team.teamPlacement === 1 ? allGameMode.wins + 1 : allGameMode.wins;
      allGameMode.gamesPlayed += 1;
      allGameMode.kdRatio = allGameMode.kills / allGameMode.deaths;
      allGameMode.assists = allGameMode.assists + curr.assists;
      allGameMode.gulagWins =
        curr.gulagKills > 0 ? allGameMode.gulagWins + 1 : allGameMode.gulagWins;
      allGameMode.gulagLosses = isGulagLoss(curr.gulagKills, curr.gulagDeaths)
        ? allGameMode.gulagLosses + 1
        : allGameMode.gulagLosses;

      const currentGameModeInd = allData.findIndex(
        (mode) => mode.mode === curr.team.match.mode
      );

      const modeTotalKills =
        (currentGameModeInd > -1 ? allData[currentGameModeInd].kills : 0) +
        curr.kills;
      const modeTotalDeaths =
        (currentGameModeInd > -1 ? allData[currentGameModeInd].deaths : 0) +
        curr.deaths;

      if (currentGameModeInd > -1) {
        allData[currentGameModeInd] = {
          ...allData[currentGameModeInd],
          wins:
            curr.team.teamPlacement === 1
              ? allData[currentGameModeInd].wins + 1
              : allData[currentGameModeInd].wins,
          kills: modeTotalKills,
          deaths: modeTotalDeaths,
          kdRatio: modeTotalKills / modeTotalDeaths,
          assists: allData[currentGameModeInd].assists + curr.assists,
          gamesPlayed: (allData[currentGameModeInd].gamesPlayed += 1),
          gulagWins:
            curr.gulagKills > 0
              ? allData[currentGameModeInd].gulagWins + 1
              : allData[currentGameModeInd].gulagWins,
          gulagLosses: isGulagLoss(curr.gulagKills, curr.gulagDeaths)
            ? allData[currentGameModeInd].gulagLosses + 1
            : allData[currentGameModeInd].gulagLosses,
        };
      } else {
        allData.push({
          mode: curr.team.match.mode as any,
          wins: curr.team.teamPlacement === 1 ? 1 : 0,
          kills: modeTotalKills,
          deaths: modeTotalDeaths,
          kdRatio: modeTotalKills / modeTotalDeaths,
          gulagWins: curr.gulagKills > 0 ? 1 : 0,
          gulagLosses: isGulagLoss(curr.gulagKills, curr.gulagDeaths) ? 1 : 0,
          assists: curr.assists,
          gamesPlayed: 1,
        });
      }

      return allData;
    },
    [
      {
        mode: 'all',
        gamesPlayed: 0,
        wins: 0,
        kills: 0,
        deaths: 0,
        gulagWins: 0,
        gulagLosses: 0,
        assists: 0,
        kdRatio: 0,
      },
    ] as SeasonDataResponse
  );
