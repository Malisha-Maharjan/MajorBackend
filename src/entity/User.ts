import { Length, Matches } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Like } from "./Like";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  userName: string;

  @Column({
    nullable: false,
  })
  @Length(8, 20, { message: "Password must be between 8 to 20 characters." })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z]).{8,}$/, {
    message: "Must contain one uppercase, one lowercase and min length is 8",
  })
  password: string;

  @Column({
    nullable: false,
  })
  address: string;

  @Column({})
  email: string;

  @Column({ nullable: false })
  type: number;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true, type: "longtext" })
  user_photo: string;

  @Column({ nullable: false })
  longitude: number;

  @Column({ nullable: false })
  latitude: number;

  @Column({ nullable: false })
  deviceId: string;

  @Column({ default: false })
  is_active: boolean;

  @OneToMany(() => Like, (like) => like.user)
  like: Like[];

  @Column({ default: false })
  inService: boolean;
}
