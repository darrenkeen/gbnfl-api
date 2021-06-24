import { Max, Min } from 'class-validator';
import { Entity as TOEntity, Column, OneToOne, JoinColumn } from 'typeorm';
import Entity from './Entity';
import { Player } from './Player';

@TOEntity('overallGoal')
export class OverallGoal extends Entity {
  constructor(overallGoal: Partial<OverallGoal>) {
    super();
    Object.assign(this, overallGoal);
  }

  @Column('decimal')
  kd: number;

  @Column()
  @Max(100)
  @Min(0)
  winPercent: number;

  @Column('int')
  @Max(100)
  @Min(0)
  topTenPercent: number;

  @OneToOne(() => Player, (player) => player.overallGoal)
  @JoinColumn()
  player: Player;
}
