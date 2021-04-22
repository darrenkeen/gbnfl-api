import { Entity as TOEntity, Column, ManyToOne, JoinColumn } from 'typeorm';

import Entity from './Entity';
import { MatchData } from './MatchData';
import { Player } from './Player';

@TOEntity('trophies')
export class Trophy extends Entity {
  constructor(trophy: Partial<Trophy>) {
    super();
    Object.assign(this, trophy);
  }

  @Column()
  name: string;

  @ManyToOne(() => MatchData, (match) => match.trophies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  match: MatchData;

  @ManyToOne(() => Player, (player) => player.trophies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'name', referencedColumnName: 'name' }])
  player: Player;
}
