import { Achievement, AchievementModifierType } from '../entities/Achievement';
import { MatchData } from '../entities/MatchData';
import { Player } from '../entities/Player';
import { getAchievedWhenAchieveModifier } from './achievements/achieve';
import { getAchievedWhenLastModifier } from './achievements/last';
import { getAchievedWhenRowModifier } from './achievements/row';

export const getPlayersAchievements = (
  achievement: Achievement,
  matches: { withSolos: MatchData[]; withoutSolos: MatchData[] },
  player: Player
) => {
  let achieved = false;

  switch (achievement.modifierType) {
    case AchievementModifierType.Achieve: {
      achieved = getAchievedWhenAchieveModifier(
        matches.withSolos,
        achievement,
        player
      );
      break;
    }
    case AchievementModifierType.Row: {
      achieved = getAchievedWhenRowModifier(matches, achievement, player);
      break;
    }
    case AchievementModifierType.Last: {
      const withSoloslastMatches =
        matches.withSolos.length > achievement.modifier
          ? matches.withSolos.slice(0, achievement.modifier)
          : matches.withSolos;
      const withoutSoloslastMatches =
        matches.withoutSolos.length > achievement.modifier
          ? matches.withoutSolos.slice(0, achievement.modifier)
          : matches.withoutSolos;
      achieved = getAchievedWhenLastModifier(
        {
          withSolos: withSoloslastMatches,
          withoutSolos: withoutSoloslastMatches,
        },
        achievement,
        player
      );
    }
  }
  return achieved;
};
