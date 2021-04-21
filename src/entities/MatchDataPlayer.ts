import { Entity as TOEntity, Column, ManyToOne } from 'typeorm';
import Entity from './Entity';
import { MatchDataTeam } from './MatchDataTeam';

@TOEntity('matchDataPlayer')
export class MatchDataPlayer extends Entity {
  constructor(matchDataPlayer: Partial<MatchDataPlayer>) {
    super();
    Object.assign(this, matchDataPlayer);
  }

  @Column()
  username: string;

  @Column()
  uno: string;

  @Column()
  missionsComplete: number;

  @Column('text', { array: true })
  missionStats: string[]; // scavenger-1 OR bounty-2

  @Column()
  headshots: number;

  @Column()
  assists: number;

  @Column('decimal')
  scorePerMinute: number;

  @Column()
  kills: number;

  @Column()
  score: number;

  @Column()
  medalXp: number;

  @Column()
  matchXp: number;

  @Column()
  scoreXp: number;

  @Column()
  wallBangs: number;

  @Column()
  totalXp: number;

  @Column()
  challengeXp: number;

  @Column('decimal')
  distanceTraveled: number;

  @Column('decimal')
  teamSurvivalTime: number;

  @Column()
  deaths: number;

  @Column('decimal')
  kdRatio: number;

  @Column()
  objectiveBrMissionPickupTablet: number;

  @Column()
  bonusXp: number;

  @Column()
  gulagDeaths: number;

  @Column()
  timePlayed: number;

  @Column()
  executions: number;

  @Column()
  gulagKills: number;

  @Column()
  nearmisses: number;

  @Column()
  objectiveBrCacheOpen: number;

  @Column('decimal')
  percentTimeMoving: number;

  @Column()
  miscXp: number;

  @Column()
  longestStreak: number;

  @Column()
  damageDone: number;

  @Column()
  damageTaken: number;

  @ManyToOne(() => MatchDataTeam, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  team: MatchDataTeam;
}
