// Database configuration for self-hosted PostgreSQL
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL connection pool
const { Pool } = pg;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'tuneton',
  password: process.env.DB_PASSWORD || '47uuR_X9h#Ls-/p',
  database: process.env.DB_NAME || 'tuneton',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully');
  }
});

export default pool;