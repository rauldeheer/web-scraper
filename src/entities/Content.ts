import {
  Column,
  CreateDateColumn,
  Entity, JoinTable, ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { Categories } from './Categories';

@Entity()
export class Content {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ default: 'undefined' })
  public title!: string;

  @Column({ default: 'undefined' })
  public date!: string;

  @Column({ default: 'undefined' })
  public url!: string;

  @Column({ default: 'undefined' })
  public image!: string;

  @Column({ type: 'longtext' })
  public description!: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  @ManyToMany(type => Categories, category => category.content)
  @JoinTable()
  public categories!: Categories[];
}
