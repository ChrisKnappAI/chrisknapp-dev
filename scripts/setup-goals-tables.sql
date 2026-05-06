-- Run this in the Supabase SQL editor (supabase.com → project → SQL Editor)

create table if not exists goal_tracker_chris (
  id         bigint primary key generated always as identity,
  log_date   date        not null,
  goal_name  text        not null,
  checked    boolean     not null default false,
  logged_at  timestamptz not null default now(),
  constraint goal_tracker_chris_unique unique (log_date, goal_name)
);

create table if not exists goal_tracker_natalie (
  id         bigint primary key generated always as identity,
  log_date   date        not null,
  category   text        not null,
  goal_name  text        not null,
  checked    boolean     not null default false,
  logged_at  timestamptz not null default now(),
  constraint goal_tracker_natalie_unique unique (log_date, goal_name)
);
