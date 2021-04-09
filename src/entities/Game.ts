import { Entity as TOEntity, Column, OneToMany } from 'typeorm';
import Entity from './Entity';
import { Trophy } from './Trophy';

@TOEntity('Game')
export class Game extends Entity {
  constructor(game: Partial<Game>) {
    super();
    Object.assign(this, game);
  }

  @Column()
  season: number;

  @Column({ type: 'timestamp' })
  dateTime: Date;

  @OneToMany(() => Trophy, (trophy) => trophy.game)
  trophies: Trophy[];
}
