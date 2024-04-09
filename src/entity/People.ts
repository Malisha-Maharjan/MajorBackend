import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
// @Check("password", "^(?=.*[A-Z])(?=.*[a-z]).{8,}$")
export class People extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  firstName: string;

  @Column({
    nullable: true,
    type: "text",
  })
  middleName!: string | null;

  @Column({
    nullable: false,
  })
  lastName: string;

  @Column({ default: false })
  is_donor: Boolean;

  @Column({ nullable: true })
  blood_Group: String;

  @Column({ default: false })
  is_doctor: Boolean;

  @Column({ nullable: true })
  gender: string;

  @OneToOne(() => User, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  user: User;
}
