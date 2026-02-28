import { createClient } from '@supabase/supabase-js'

// ✅ Your Supabase project URL
const supabaseUrl = 'https://mejczdubbwenwtjsnxpo.supabase.co'

// ⚡ Your frontend-safe publishable key
const supabaseKey = 'sb_publishable_NwzXtrkKk4QcUen_zUN4uw_qpK6NGZb'

// ✅ Create Supabase client with proper auth settings
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,          // ✅ Save session in localStorage
    autoRefreshToken: true,        // ✅ Auto refresh expired tokens
    detectSessionInUrl: true,      // ✅ Detect login session in URL
    flowType: 'pkce',              // ✅ More reliable auth flow (important for mobile)
  },
})