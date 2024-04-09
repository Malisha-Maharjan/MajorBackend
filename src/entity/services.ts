// import {
//   BaseEntity,
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from "typeorm";
// import { Organization } from "./Organization";

// @Entity("service")
// export class Service extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   type: number;

//   @ManyToOne(() => Organization, (organization) => organization.service, {
//     onDelete: "CASCADE",
//   })
//   @JoinColumn({
//     name: "organization_id",
//   })
//   organization: Organization;
// }
