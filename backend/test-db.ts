import { supabase } from './src/config/supabase';

async function check() {
  const { data: profiles, error: err1 } = await supabase.from('user_profiles').select('*').limit(1);
  console.log('user_profiles', profiles, err1);
  
  const { data: students, error: err2 } = await supabase.from('students').select('*').limit(1);
  console.log('students', students, err2);
}
check();
