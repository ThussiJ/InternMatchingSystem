const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    try {
        console.log('--- RLS Check ---');
        const { data, error } = await supabase.rpc('get_policies_for_table', { table_name: 'employers' });
        if (error) {
            console.log('RPC get_policies_for_table not found, checking manually...');
            // Try to select with service role - if it works, and anon/authenticated fails, it's RLS.
            const { data: emps, error: empError } = await supabase.from('employers').select('*');
            console.log('Service Role Select Success:', !!emps);
            console.log('Error:', empError);
        } else {
            console.log('Policies:', data);
        }
    } catch (e) {
        console.error('Execution Error:', e);
    }
}

check();
