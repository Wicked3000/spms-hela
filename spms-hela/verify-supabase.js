
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createClient } = require('@supabase/supabase-js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '.env.local' });

async function checkConnection() {
  console.log('Checking Supabase connection...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`Connecting to ${supabaseUrl}...`);

  try {
    const { data: student, error } = await supabase
      .from('student_profiles')
      .select('*')
      .limit(1)
      .single();

    if (error) {
           console.error('Error fetching student:', error.message);
    } else {
      console.log('Sample Student Data:', JSON.stringify(student, null, 2));
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkConnection();
