import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

export const sequelize = new Sequelize(DB_NAME ?? "", DB_USER ?? "", DB_PASSWORD ?? "", {
  host: DB_HOST ?? "",
  dialect: "mysql",
});
