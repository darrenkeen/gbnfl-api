import { Entity as TOEntity } from 'typeorm';
import Entity from './Entity';

@TOEntity('achievementTrack')
export class AchievementTrack extends Entity {
  constructor(achievementTrack: Partial<AchievementTrack>) {
    super();
    Object.assign(this, achievementTrack);
  }
}
