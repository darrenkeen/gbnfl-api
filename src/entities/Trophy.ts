import { Entity as TOEntity, Column, ManyToOne, JoinColumn } from 'typeorm';
import Entity from './Entity';
import { Game } from './Game';
import { Player } from './Player';

@TOEntity('trophies')
export class Trophy extends Entity {
  constructor(trophy: Partial<Trophy>) {
    super();
    Object.assign(this, trophy);
  }

  @Column()
  kills: number;

  @Column()
  name: string;

  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => Game, (game) => game.trophies)
  @JoinColumn()
  game: Game;

  @ManyToOne(() => Player, (player) => player.trophies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'name', referencedColumnName: 'name' }])
  player: Player;
}
