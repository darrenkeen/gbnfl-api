import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { classToPlain } from 'class-transformer';
import { nanoid } from 'nanoid';

export default abstract class Entity extends BaseEntity {
  @PrimaryColumn('varchar', { length: 10 })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return classToPlain(this);
  }
  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = nanoid(10);
    }
  }
}
