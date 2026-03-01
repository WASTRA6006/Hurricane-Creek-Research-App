import pg from 'pg';
const { Pool } = pg;

const poolConfig = {
    host:  'localhost',
    port: 5432,
    database: 'hcdb',
    user: 'postgres',
    password: 'postgres'
}

const pool = new Pool(poolConfig);

export default pool;