import { Entity as TOEntity, Column, OneToMany } from 'typeorm';
import Entity from './Entity';
import { PlayerAchievement } from './PlayerAchievement';

export enum AchievementType {
  Kills = 'KILLS',
  Kd = 'KD',
  Win = 'WIN',
  Gulag = 'GULAG',
  Killer = 'KILLER',
  TopTen = 'TOP_TEN',
}

export enum AchievementModifierType {
  Row = 'ROW',
  Last = 'LAST',
  Achieve = 'ACHIEVE',
}

export enum AchievementScope {
  Match = 'MATCH',
  Team = 'TEAM',
}

export enum AchievementSpecial {
  NoDeath = 'NO_DEATH',
  HighestKiller = 'HIGHEST_KILLER',
  Under250Dmg = 'UNDER_250_DMG',
}

@TOEntity('achievement')
export class Achievement extends Entity {
  constructor(achievement: Partial<Achievement>) {
    super();
    Object.assign(this, achievement);
  }

  @Column({ type: 'enum', enum: AchievementType })
  type: AchievementType;

  @Column()
  value: number;

  @Column()
  modifier: number;

  @Column({ type: 'enum', enum: AchievementModifierType })
  modifierType: AchievementModifierType;

  @Column({ type: 'enum', enum: AchievementScope, nullable: true })
  scope?: AchievementScope;

  @Column({ type: 'enum', enum: AchievementSpecial, array: true, default: [] })
  special: AchievementSpecial[];

  @OneToMany(() => PlayerAchievement, (ua) => ua.achievement)
  playersAchieved: PlayerAchievement[];
}
