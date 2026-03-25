const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    try {
        const { data, error } = await supabase.from('employers').select('*').limit(1);
        console.log('--- Employers Check ---');
        console.log('Error:', error);
        if (data && data.length > 0) {
            console.log('Columns:', Object.keys(data[0]));
        } else {
            console.log('No data in employers table');
        }

        const { data: intData, error: intError } = await supabase.from('internships').select('*').limit(1);
        console.log('--- Internships Check ---');
        console.log('Error:', intError);
        if (intData && intData.length > 0) {
            console.log('Columns:', Object.keys(intData[0]));
        } else {
            console.log('No data in internships table');
        }
    } catch (e) {
        console.error('Execution Error:', e);
    }
}

check();
