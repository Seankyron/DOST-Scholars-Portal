import { createBrowserClient } from '@supabase/ssr'
import { type Database } from './type'

export const createClient = () => {
  // 2. Pass it as a "generic" to the client
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}