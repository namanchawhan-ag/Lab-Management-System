import config from "../utils/config.js";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: config.HOST,
  user: config.USER,
  port: config.DB_PORT,
  password: config.PASSWORD,
  database: config.DATABASE,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection test successful');
    client.release();
  } catch (err) {
    console.error('Error testing database connection:', {
      host: config.HOST,
      user: config.USER,
      port: config.DB_PORT,
      database: config.DATABASE,
      error: err.message
    });
    process.exit(1);
  }
};

testConnection();

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
