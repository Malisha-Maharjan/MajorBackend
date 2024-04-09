import { load } from "ts-dotenv";
// dotenv.config();

export const env = load({
  DATABASE_HOST: String,
  DATABASE_PORT: Number,
  DATABASE_USER: String,
  DATABASE_PASSWORD: String,
  DATABASE_NAME: String,
  DATABASE_LOGGING: Boolean,
  MIGRATION_URL: String,
  SECRET_KEY: String,
  SMTP_HOST: String,
  SMTP_PORT: Number,
  SMTP_USER: String,
  SMTP_PASSWORD: String,
});
