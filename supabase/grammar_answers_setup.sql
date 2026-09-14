-- Grammar Duel: grammar_answers table
-- Run this in the Supabase SQL editor for the Pacewise project.
-- Mirrors reading_responses exactly: RLS enabled, one named policy per
-- operation, public role, permissive (true) conditions.

create table if not exists grammar_answers (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  student_id text not null,
  student_name text not null,
  question_index int not null,
  question_id text not null,
  choice_index int not null,
  correct boolean not null,
  time_taken_ms int not null,
  points int not null default 0,
  answered_at timestamptz not null default now()
);

create index if not exists grammar_answers_room_id_idx on grammar_answers (room_id);

alter table grammar_answers enable row level security;

create policy allow_insert_grammar_answers
  on grammar_answers for insert
  to public
  with check (true);

create policy allow_select_grammar_answers
  on grammar_answers for select
  to public
  using (true);

create policy allow_update_grammar_answers
  on grammar_answers for update
  to public
  using (true)
  with check (true);

-- Realtime: put grammar_answers in the same publication reading_responses
-- uses, so the host sees answers land live instead of relying only on the
-- 3-second polling fallback already built into the host screen.
alter publication supabase_realtime add table grammar_answers;
