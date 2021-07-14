import {
  Entity as TOEntity,
  Column,
  OneToMany,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Entity from './Entity';
import { MatchDataPlayer } from './MatchDataPlayer';
import { OverallGoal } from './OverallGoal';
import { Trophy } from './Trophy';
import { User } from './User';
import { PlayerAchievement } from './PlayerAchievement';

@TOEntity('players')
export class Player extends Entity {
  constructor(player: Partial<Player>) {
    super();
    Object.assign(this, player);
  }

  @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  sbmmUrl: string;

  @Column({ default: '' })
  platformId: string;

  @Column({ nullable: true })
  uno: string;

  @Column()
  platformType: string;

  @OneToMany(() => Trophy, (trophy) => trophy.player, {
    cascade: true,
  })
  trophies: Trophy[];

  @OneToMany(() => MatchDataPlayer, (mdt) => mdt.player)
  matches: MatchDataPlayer[];

  @OneToOne(() => User, (user) => user.player, { nullable: true })
  @JoinColumn()
  user: User;

  @OneToOne(() => OverallGoal, (overallGoal) => overallGoal.player, {
    nullable: true,
  })
  @JoinColumn()
  overallGoal: OverallGoal;

  @OneToMany(() => PlayerAchievement, (ua) => ua.player)
  achievements: PlayerAchievement[];

  public static mockTestUser(passedPlayer: Partial<Player>): Player {
    const player = new Player(passedPlayer);

    return player;
  }
}
