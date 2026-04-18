import { createBrowserClient } from '@supabase/ssr'
import { assertSupabaseBrowserEnv, getSupabasePublicApiKey, getSupabaseUrl } from '@/lib/supabase/env'

export { assertSupabaseBrowserEnv } from '@/lib/supabase/env'

export function createClient() {
  const url = getSupabaseUrl()
  const key = getSupabasePublicApiKey()
  return createBrowserClient(url, key)
}
