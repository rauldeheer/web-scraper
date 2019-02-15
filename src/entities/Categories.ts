import {
  Column,
  CreateDateColumn,
  Entity, ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Content } from './Content';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public category!: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  @ManyToMany(type => Content, content => content.categories)
  public content!: Content[];
}
