import { Entity as TOEntity, ManyToOne } from 'typeorm';
import { Achievement } from './Achievement';
import Entity from './Entity';
import { Player } from './Player';

@TOEntity('playerAchievement')
export class PlayerAchievement extends Entity {
  constructor(playerAchievement: Partial<PlayerAchievement>) {
    super();
    Object.assign(this, playerAchievement);
  }

  @ManyToOne(() => Player)
  player: Player;

  @ManyToOne(() => Achievement)
  achievement: Achievement;
}
