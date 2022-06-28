import pg from 'pg';
// import { password } from 'pg/lib/defaults';
const {Pool} = pg;

const poolConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectionUnauthorized: false
    } 
    } :
    {
        user: 'postgres',
        password: '19ephen',
        host: 'localhost',
        port: '5432',
        database: 'file_server_database'
    }

const pool = new Pool(poolConfig);
export default pool;