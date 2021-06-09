import { Entity as TOEntity } from 'typeorm';
import Entity from './Entity';

@TOEntity('matchTrack')
export class MatchTrack extends Entity {
  constructor(matchTrack: Partial<MatchTrack>) {
    super();
    Object.assign(this, matchTrack);
  }
}
