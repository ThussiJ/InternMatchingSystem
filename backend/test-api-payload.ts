import { supabase } from './src/config/supabase';

async function check() {
  const { data: userProfile } = await supabase.from('user_profiles').select('*').limit(1).single();
  const { data: studentDetails } = await supabase.from('students').select('*').eq('id', userProfile.id).maybeSingle();
  
  console.log(JSON.stringify({ ...userProfile, ...studentDetails }, null, 2));
}
check().catch(console.error);
