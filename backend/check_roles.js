const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    try {
        console.log('--- User Roles Check ---');
        // Check what columns are in user_profiles
        const { data: sample, error: sampleError } = await supabase.from('user_profiles').select('*').limit(1);
        if (sampleError) {
            console.error('Error fetching user_profiles:', sampleError);
        } else {
            console.log('User Profile Columns:', sample.length > 0 ? Object.keys(sample[0]) : 'No profiles found');
            const { data, error } = await supabase.from('user_profiles').select('id, role');
            console.log('All Users:', data);
        }
        
        console.log('--- Employers Check ---');
        const { data: emps, count, error: empError } = await supabase.from('employers').select('*', { count: 'exact' });
        console.log('Employer Count:', count);
        console.log('Employers:', emps);
        if (empError) console.error('Employer Error:', empError);

    } catch (e) {
        console.error('Execution Error:', e);
    }
}

check();
