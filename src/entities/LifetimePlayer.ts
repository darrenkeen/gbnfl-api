import { Entity as TOEntity, Column, ManyToOne } from 'typeorm';
import Entity from './Entity';
import { Player } from './Player';

@TOEntity('lifetimePlayer')
export class LifetimePlayer extends Entity {
  constructor(lifetimePlayer: Partial<LifetimePlayer>) {
    super();
    Object.assign(this, lifetimePlayer);
  }

  @Column()
  wins: number;

  @Column()
  kills: number;

  @Column('decimal')
  kdRatio: number;

  @Column()
  downs: number;

  @Column()
  topTwentyFive: number;

  @Column()
  topTen: number;

  @Column()
  contracts: number;

  @Column()
  revives: number;

  @Column()
  topFive: number;

  @Column()
  score: number;

  @Column()
  timePlayed: number;

  @Column()
  gamesPlayed: number;

  @Column()
  tokens: number;

  @Column('decimal')
  scorePerMinute: number;

  @Column()
  cash: number;

  @Column()
  deaths: number;

  @ManyToOne(() => Player)
  player: Player;
}
