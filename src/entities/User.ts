import { Exclude } from 'class-transformer';
import { Entity as TOEntity, Column, OneToOne, JoinColumn } from 'typeorm';
import Entity from './Entity';
import { Player } from './Player';

@TOEntity('user')
export class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => Player, { nullable: true })
  @JoinColumn()
  player: Player;
}
