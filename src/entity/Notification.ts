import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  longitude: number;

  @Column({ nullable: false })
  latitude: number;

  @Column()
  bloodRequest: string;
}
