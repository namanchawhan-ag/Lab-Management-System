import config from "../utils/config.js";

const poolConfig = {
  host: config.POSTGRES_HOST,
  user: config.POSTGRES_USER,
  port: config.POSTGRES_DB_PORT,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DATABASE,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export default poolConfig; 