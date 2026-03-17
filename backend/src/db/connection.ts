import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use Railway's DATABASE_URL if available, otherwise use local Docker config
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
      }
    : {
        host: 'localhost',
        port: 5432,
        database: 'hcdb',
        user: 'postgres',
        password: 'postgres',
      }
);

export default pool;