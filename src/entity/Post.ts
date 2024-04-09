import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Like } from "./Like";
import { User } from "./User";

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    type: "longtext",
  })
  post!: String;

  @Column({ type: "datetime" })
  date: Date;

  @Column({ nullable: true, type: "longtext" })
  photo: string;

  @Column({ default: 0 })
  count_likes: number;

  @Column({ default: false })
  is_spam: Boolean;

  @Column({ nullable: true })
  sharedPID: number;

  @Column({ default: 0 })
  reported_spam: number;

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => Like, (like) => like.post)
  like: Like[];
}
