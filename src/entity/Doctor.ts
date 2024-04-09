import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { People } from "./People";
@Entity()
export class Doctor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  NMC: number;

  @Column({ nullable: false })
  degree: string;

  @Column({ default: false })
  is_verified: Boolean;

  @OneToOne(() => People, {
    onDelete: "CASCADE",
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  person: People;
  // donor: Promise<User[]>;
}
