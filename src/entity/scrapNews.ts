import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Scrap extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  headline: string;

  @Column({})
  headline_link: string;

  @Column({})
  date: Date;

  @Column()
  image_url: string;

  @Column({ type: "longtext" })
  paragraph: string;
}
