import { createClient } from '@supabase/supabase-js'
import { Database } from './types/supabaseTypes'

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseURL || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient<Database>(supabaseURL, supabaseServiceRoleKey)


export default supabase;