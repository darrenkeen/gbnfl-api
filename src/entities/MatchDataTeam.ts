import { Entity as TOEntity, Column, OneToMany, ManyToOne } from 'typeorm';
import Entity from './Entity';
import { MatchData } from './MatchData';
import { MatchDataPlayer } from './MatchDataPlayer';

@TOEntity('matchDataTeam')
export class MatchDataTeam extends Entity {
  constructor(matchDataTeam: Partial<MatchDataTeam>) {
    super();
    Object.assign(this, matchDataTeam);
  }

  @Column()
  teamName: string;

  @Column({ nullable: true })
  teamPlacement: number;

  @OneToMany(() => MatchDataPlayer, (player) => player.team, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  players: MatchDataPlayer[];

  @ManyToOne(() => MatchData, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  match: MatchData;
}
