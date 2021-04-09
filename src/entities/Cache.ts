import { Entity as TOEntity, Column } from 'typeorm';
import Entity from './Entity';

@TOEntity('Cache')
export class Cache extends Entity {
  constructor(cache: Partial<Cache>) {
    super();
    Object.assign(this, cache);
  }

  @Column({ unique: true })
  route: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
