import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dthrpvpuzinmevrvqlhv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aHJwdnB1emlubWV2cnZxbGh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI5NTc4NSwiZXhwIjoyMDcwODcxNzg1fQ.idSuWMHyDLwrIUJqO7Xp6LJAIb-yeXjKkKeO0SLjOkg';

console.log('Connecting to Supabase at:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchSchema() {
  try {
    // Get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return;
    }

    console.log('Tables in database:');
    for (const table of tables) {
      console.log(`- ${table.table_name}`);
      
      // Get columns for each table
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', table.table_name)
        .eq('table_schema', 'public')
        .order('ordinal_position');

      if (columnsError) {
        console.error(`Error fetching columns for ${table.table_name}:`, columnsError);
        continue;
      }

      console.log(`  Columns in ${table.table_name}:`);
      for (const column of columns) {
        console.log(`    - ${column.column_name} (${column.data_type}) ${column.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
      }
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

fetchSchema();