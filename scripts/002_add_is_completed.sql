-- Add is_completed column to calendar_events table
alter table public.calendar_events 
add column if not exists is_completed boolean default false not null;
