-- Word Builder: word_builder_progress table
-- Run this in the Supabase SQL editor for the Pacewise project.
-- Mirrors reading_responses and grammar_answers exactly: RLS enabled, one
-- named policy per operation, public role, permissive (true) conditions.
--
-- Unlike grammar_answers (one row per answer submitted), this table holds
-- one row per student per room that gets upserted in place as they play,
-- so the host's live leaderboard always reflects each student's current
-- points remaining and words completed. The unique constraint below is
-- what makes that upsert (on room_id, student_id) work.

create table if not exists word_builder_progress (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  student_id text not null,
  student_name text not null,
  points_remaining int not null default 20,
  words_completed int not null default 0,
  finished boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (room_id, student_id)
);

create index if not exists word_builder_progress_room_id_idx on word_builder_progress (room_id);

alter table word_builder_progress enable row level security;

create policy allow_insert_word_builder_progress
  on word_builder_progress for insert
  to public
  with check (true);

create policy allow_select_word_builder_progress
  on word_builder_progress for select
  to public
  using (true);

create policy allow_update_word_builder_progress
  on word_builder_progress for update
  to public
  using (true)
  with check (true);

-- Realtime: put word_builder_progress in the same publication reading_responses
-- and grammar_answers use, so the host's leaderboard updates live instead of
-- relying only on the 3-second polling fallback already built into the host
-- screen.
alter publication supabase_realtime add table word_builder_progress;
