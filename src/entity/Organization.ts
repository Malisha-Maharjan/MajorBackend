import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity("organization")
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({})
  bio: string;

  @Column({ nullable: false })
  organizationType: number;

  @Column("simple-array")
  services: number[];

  @OneToOne(() => User, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  user: User;
}
