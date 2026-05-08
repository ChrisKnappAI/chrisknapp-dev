-- Run this in the Supabase SQL editor (supabase.com → project → SQL Editor)

create table if not exists gym_log_chris (
  id          bigint primary key generated always as identity,
  log_date    date        not null,
  exercise_id text        not null,
  checked     boolean     not null default false,
  sets        integer,
  reps        integer,
  lbs         numeric,
  logged_at   timestamptz not null default now(),
  constraint gym_log_chris_unique unique (log_date, exercise_id)
);
