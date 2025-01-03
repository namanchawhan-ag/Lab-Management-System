import config from "../utils/config.js";

const poolConfig = {
  host: config.HOST,
  user: config.USER,
  port: config.DB_PORT,
  password: config.PASSWORD,
  database: config.DATABASE,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export default poolConfig; 