import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  eventName: string;

  @Column({ type: "longtext" })
  description: string;

  @Column({})
  date: Date;

  @Column({})
  hour: string;

  @Column({})
  minute: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ type: "longtext", nullable: true })
  photo: string;
}
