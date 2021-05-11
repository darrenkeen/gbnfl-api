import { Entity as TOEntity, Column, ManyToOne } from 'typeorm';
import Entity from './Entity';
import { MatchDataTeam } from './MatchDataTeam';
import { Player } from './Player';

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

  @Column({ nullable: true })
  headshots: number;

  @Column({ nullable: true })
  assists: number;

  @Column('decimal', { nullable: true })
  scorePerMinute: number;

  @Column({ nullable: true })
  kills: number;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true })
  medalXp: number;

  @Column({ nullable: true })
  matchXp: number;

  @Column({ nullable: true })
  scoreXp: number;

  @Column({ nullable: true })
  wallBangs: number;

  @Column({ nullable: true })
  totalXp: number;

  @Column({ nullable: true })
  challengeXp: number;

  @Column('decimal', { nullable: true })
  distanceTraveled: number;

  @Column('decimal', { nullable: true })
  teamSurvivalTime: number;

  @Column({ nullable: true })
  deaths: number;

  @Column('decimal', { nullable: true })
  kdRatio: number;

  @Column({ nullable: true })
  objectiveBrMissionPickupTablet: number;

  @Column({ nullable: true })
  bonusXp: number;

  @Column({ nullable: true })
  gulagDeaths: number;

  @Column({ nullable: true })
  timePlayed: number;

  @Column({ nullable: true })
  executions: number;

  @Column({ nullable: true })
  gulagKills: number;

  @Column({ nullable: true })
  nearmisses: number;

  @Column({ nullable: true })
  objectiveBrCacheOpen: number;

  @Column('decimal', { nullable: true })
  percentTimeMoving: number;

  @Column({ nullable: true })
  miscXp: number;

  @Column({ nullable: true })
  longestStreak: number;

  @Column({ nullable: true })
  damageDone: number;

  @Column({ nullable: true })
  damageTaken: number;

  @ManyToOne(() => Player, { nullable: true })
  player: Player;

  @ManyToOne(() => MatchDataTeam, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  team: MatchDataTeam;
}
