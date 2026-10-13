import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

let client = null
let configurationError = ''

if (!supabaseUrl || !supabaseKey) {
  configurationError = 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the project .env file, then restart npm run dev.'
} else {
  try {
    client = createClient(supabaseUrl, supabaseKey)
  } catch {
    configurationError = 'Invalid Supabase configuration. Check the project URL and public anon key in .env, then restart npm run dev.'
  }
}

// A missing configuration must not crash module imports before React renders.
export const supabase = client
export const supabaseConfigurationError = configurationError
