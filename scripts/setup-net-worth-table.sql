-- Run in Supabase SQL Editor before running import-net-worth.js

create table if not exists net_worth_snapshots (
  id               bigint primary key generated always as identity,
  period_date      date   not null unique,
  total_net_worth  bigint,
  net_cash         bigint,
  net_investments  bigint,
  fidelity_401k    bigint,
  betterment       bigint,
  roth_ira         bigint,
  hsa              bigint,
  kel_savings      bigint,
  debt             bigint,
  home_equity      bigint,
  home_value       bigint,
  mortgage_balance bigint
);
