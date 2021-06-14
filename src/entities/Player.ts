import {
  Entity as TOEntity,
  Column,
  OneToMany,
  Index,
  OneToOne,
} from 'typeorm';
import Entity from './Entity';
import { MatchDataPlayer } from './MatchDataPlayer';
import { Trophy } from './Trophy';
import { User } from './User';

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
  user: User;

  public static mockTestUser(passedPlayer: Partial<Player>): Player {
    const player = new Player(passedPlayer);

    return player;
  }
}
