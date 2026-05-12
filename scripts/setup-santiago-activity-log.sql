-- Run this in the Supabase SQL editor (supabase.com → project → SQL Editor)

create table if not exists santiago_activity_log (
  id             bigint primary key generated always as identity,
  logged_at      timestamptz not null default now(),
  date           date        not null,
  country        text,
  question_id    text,
  question_text  text,
  topic          text,
  topic_group    text,
  question_type  int,
  answer_given   text,
  correct        boolean,
  grading_method text,
  response_given text,
  response_type  text
);
