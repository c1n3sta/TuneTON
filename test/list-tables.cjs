const { Client } = require('pg');

// Database connection configuration
const client = new Client({
  host: 'aws-0-us-west-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '47uuR_X9h#Ls-/p',
  ssl: {
    rejectUnauthorized: false
  }
});

async function listTables() {
  try {
    console.log('Connecting to Supabase database...');
    await client.connect();
    console.log('Connected successfully!');
    
    // Get all tables in public schema
    console.log('\n=== DATABASE TABLES ===');
    const tableQuery = `
      SELECT table_name, table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    const tableResult = await client.query(tableQuery);
    console.log('Tables:');
    tableResult.rows.forEach(row => {
      console.log(`- ${row.table_name} (${row.table_type})`);
    });
    
    await client.end();
    console.log('\n=== TABLE LISTING COMPLETE ===');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (client) {
      await client.end();
    }
  }
}

listTables();