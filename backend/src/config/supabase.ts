import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    console.log('URL found:', !!supabaseUrl);
    console.log('Key found:', !!supabaseServiceKey);
    process.exit(1);
}

console.log('Supabase initialized with URL:', supabaseUrl.substring(0, 20) + '...');
console.log('Using Service Role Key (prefix):', supabaseServiceKey.substring(0, 10) + '...');

// We use the service_role key to bypass RLS for registration and admin tasks
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
