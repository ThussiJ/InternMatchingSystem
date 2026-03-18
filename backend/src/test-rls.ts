
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRLS() {
    console.log('Checking RLS for user_profiles...');

    // Try to fetch something as service role
    const { data, error } = await supabase.from('user_profiles').select('*').limit(1);

    if (error) {
        console.error('Error fetching from user_profiles:', error);
    } else {
        console.log('Successfully fetched from user_profiles. Data:', data);
    }

    // Try to check table info
    const { data: tableInfo, error: tableError } = await supabase.rpc('get_table_rls_status', { table_name: 'user_profiles' });
    if (tableError) {
        console.log('RPC get_table_rls_status not available, trying direct query if possible...');
    } else {
        console.log('Table RLS Info:', tableInfo);
    }
}

checkRLS();
