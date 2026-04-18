/**
 * Supabase public URL + browser-safe API key.
 * New dashboards use NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; older projects use NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * @supabase/supabase-js accepts either with createClient / createBrowserClient.
 */
export function getSupabaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
}

export function getSupabasePublicApiKey(): string {
  const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim()
  const publishable = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '').trim()
  return anon || publishable
}

const PLACEHOLDER_URL = 'your-project-ref'
const PLACEHOLDER_ANON = 'your-anon-key'
const PLACEHOLDER_PUBLISHABLE = 'your-publishable-key'

export function assertSupabaseBrowserEnv(): void {
  const url = getSupabaseUrl()
  const key = getSupabasePublicApiKey()

  if (!url || !key) {
    throw new Error(
      'Supabase env missing: set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (Connect modal) or NEXT_PUBLIC_SUPABASE_ANON_KEY (legacy) in .env.local, then restart pnpm dev.',
    )
  }
  if (
    url.includes(PLACEHOLDER_URL) ||
    key.includes(PLACEHOLDER_ANON) ||
    key.includes(PLACEHOLDER_PUBLISHABLE)
  ) {
    throw new Error(
      'Supabase .env.local still has placeholder values. Copy the real Project URL and publishable (or anon) key from Supabase → Project Settings → API or the Connect dialog, then restart pnpm dev.',
    )
  }
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is not a valid URL (check for typos and include https://).',
    )
  }
  if (parsed.protocol !== 'https:') {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be an https:// URL from your Supabase project.')
  }
}
