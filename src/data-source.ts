import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
// import { Service } from "./entity/services";
import { Comment } from "./entity/Comment";
import { Doctor } from "./entity/Doctor";
import { Event } from "./entity/Event";
import { Like } from "./entity/Like";
import { Organization } from "./entity/Organization";
import { People } from "./entity/People";
import { Post } from "./entity/Post";
import { Scrap } from "./entity/scrapNews";
import { env } from "./utils/env";

// export const AppDataSource = new DataSource({
//   type: "mysql",
//   host: env.DATABASE_HOST,
//   port: env.DATABASE_PORT,
//   username: env.DATABASE_USER,
//   password: env.DATABASE_PASSWORD,
//   database: env.DATABASE_NAME,
//   logging: env.DATABASE_LOGGING,
//   entities: [
//     User,
//     People,
//     Organization,
//     Doctor,
//     Scrap,
//     Post,
//     Comment,
//     Like,
//     Event,
//   ],
//   migrations: [env.MIGRATION_URL],
//   subscribers: [],
// });

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "MYSQL5049.site4now.net",
  // port: 3306,
  username: "aa75f9_geomed",
  password: "Malisha2001",
  database: "db_aa75f9_geomed",
  // logging: env.DATABASE_LOGGING,
  entities: [
    User,
    People,
    Organization,
    Doctor,
    Scrap,
    Post,
    Comment,
    Like,
    Event,
  ],
  migrations: [env.MIGRATION_URL],
  subscribers: [],
});
