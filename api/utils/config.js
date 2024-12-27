import dotenv from "dotenv";

dotenv.config();

const config = {
  HOST: process.env.HOST || 'localhost',
  USER: process.env.USER || 'postgres',
  PASSWORD: process.env.PASSWORD,
  DATABASE: process.env.DATABASE || 'postgres',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  PORT: parseInt(process.env.PORT || '3001')
};

export default config;
