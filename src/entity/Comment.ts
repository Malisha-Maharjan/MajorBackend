import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  comment: String;

  @Column({ type: "datetime" })
  date: Date;

  // @Column({ nullable: true })
  // photo: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: false })
  is_spam: boolean;

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Post, { eager: true, onDelete: "CASCADE" })
  post: Post;
}
