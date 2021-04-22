import { Expose } from 'class-transformer';
import { Entity as TOEntity, Column, OneToMany } from 'typeorm';
import Entity from './Entity';
import { MatchDataTeam } from './MatchDataTeam';
import { Trophy } from './Trophy';

@TOEntity('matchData')
export class MatchData extends Entity {
  constructor(matchData: Partial<MatchData>) {
    super();
    Object.assign(this, matchData);
  }

  @Column()
  inGameMatchId: string;

  @Column()
  playerCount: number;

  @Column()
  mode: string;

  @OneToMany(() => Trophy, (trophy) => trophy.match)
  trophies: Trophy[];

  @Column()
  utcStartSeconds: number;

  @Column()
  utcEndSeconds: number;

  @OneToMany(() => MatchDataTeam, (team) => team.match, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  teams: MatchDataTeam[];

  @Expose() get duration(): number {
    return this.utcEndSeconds - this.utcStartSeconds;
  }
}
