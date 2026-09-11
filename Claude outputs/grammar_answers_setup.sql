-- Grammar Duel: grammar_answers table
-- Run this in the Supabase SQL editor for the Pacewise project.
-- Mirrors the shape/permissions of the existing reading_responses table.

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

-- Row Level Security: match whatever policy reading_responses currently
-- uses. If that table has RLS disabled (simplest — fine for a classroom
-- tool with no auth), do the same here:
alter table grammar_answers disable row level security;

-- If reading_responses instead has RLS enabled with permissive policies,
-- use this shape instead (and skip the "disable" line above):
--
-- alter table grammar_answers enable row level security;
-- create policy "Allow all access to grammar_answers"
--   on grammar_answers for all
--   using (true)
--   with check (true);

-- Realtime: enable this table in the same Realtime publication that
-- reading_responses uses, so the host sees answers land live instead of
-- relying only on the 3-second polling fallback already built into the
-- host screen.
alter publication supabase_realtime add table grammar_answers;
