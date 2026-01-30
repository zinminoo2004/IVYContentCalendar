-- Create content_types enum table for dynamic content types
create table if not exists public.content_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#000000',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create calendar_events table
create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  content_type_id uuid references public.content_types(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster date queries
create index if not exists calendar_events_date_idx on public.calendar_events(event_date);

-- Insert default content types based on the design
insert into public.content_types (name, color) values
  ('Daily Content', '#1a1a1a'),
  ('Products Video for TT', '#22c55e'),
  ('Knowledge Sharing Video Content', '#a855f7'),
  ('Knowledge Sharing Photo Content', '#f97316')
on conflict (name) do nothing;

-- Enable Row Level Security
alter table public.content_types enable row level security;
alter table public.calendar_events enable row level security;

-- Create policies for public access (no auth required for this calendar app)
create policy "Allow public read access to content_types" on public.content_types for select using (true);
create policy "Allow public insert to content_types" on public.content_types for insert with check (true);
create policy "Allow public update to content_types" on public.content_types for update using (true);
create policy "Allow public delete to content_types" on public.content_types for delete using (true);

create policy "Allow public read access to calendar_events" on public.calendar_events for select using (true);
create policy "Allow public insert to calendar_events" on public.calendar_events for insert with check (true);
create policy "Allow public update to calendar_events" on public.calendar_events for update using (true);
create policy "Allow public delete to calendar_events" on public.calendar_events for delete using (true);
