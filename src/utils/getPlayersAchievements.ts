import { Achievement, AchievementModifierType } from '../entities/Achievement';
import { MatchData } from '../entities/MatchData';
import { Player } from '../entities/Player';
import { getAchievedWhenAchieveModifier } from './achievements/achieve';
import { getAchievedWhenLastModifier } from './achievements/last';
import { getAchievedWhenRowModifier } from './achievements/row';

export const getPlayersAchievements = (
  achievement: Achievement,
  matches: MatchData[],
  player: Player
) => {
  let achieved = false;

  switch (achievement.modifierType) {
    case AchievementModifierType.Achieve: {
      achieved = getAchievedWhenAchieveModifier(matches, achievement, player);
      break;
    }
    case AchievementModifierType.Row: {
      achieved = getAchievedWhenRowModifier(matches, achievement, player);
      break;
    }
    case AchievementModifierType.Last: {
      const lastMatches =
        matches.length > achievement.modifier
          ? matches.slice(0, achievement.modifier)
          : matches;
      achieved = getAchievedWhenLastModifier(lastMatches, achievement, player);
    }
  }
  return achieved;
};
