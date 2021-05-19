import { Entity as TOEntity, Column, ManyToOne } from 'typeorm';
import Entity from './Entity';
import { Player } from './Player';

@TOEntity('weeklyMode')
export class WeeklyMode extends Entity {
  constructor(weeklyMode: Partial<WeeklyMode>) {
    super();
    Object.assign(this, weeklyMode);
  }

  @Column()
  mode: string;

  @Column()
  kills: number;

  @Column()
  deaths: number;

  @Column()
  assists: number;

  @Column('decimal')
  avgLifeTime: number;

  @Column()
  headshots: number;

  @Column()
  gulagDeaths: number;

  @Column()
  gulagKills: number;

  @Column()
  matchesPlayed: number;

  @Column()
  damageDone: number;

  @Column()
  damageTaken: number;

  @Column('decimal')
  kdRatio: number;

  @Column('decimal')
  killsPerGame: number;

  @ManyToOne(() => Player)
  player: Player;
}
