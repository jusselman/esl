-- Listen & Recall: listen_recall_answers table
-- Run this in the Supabase SQL editor for the Pacewise project.
-- Mirrors grammar_answers/synonym_answers/fill_it_in_answers exactly: RLS
-- enabled, one named policy per operation, public role, permissive (true)
-- conditions.

create table if not exists listen_recall_answers (
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

create index if not exists listen_recall_answers_room_id_idx on listen_recall_answers (room_id);

alter table listen_recall_answers enable row level security;

create policy allow_insert_listen_recall_answers
  on listen_recall_answers for insert
  to public
  with check (true);

create policy allow_select_listen_recall_answers
  on listen_recall_answers for select
  to public
  using (true);

create policy allow_update_listen_recall_answers
  on listen_recall_answers for update
  to public
  using (true)
  with check (true);

-- Realtime: put listen_recall_answers in the same publication the other
-- answers tables use, so the host sees answers land live instead of
-- relying only on the 3-second polling fallback already built into the
-- host screen.
alter publication supabase_realtime add table listen_recall_answers;
