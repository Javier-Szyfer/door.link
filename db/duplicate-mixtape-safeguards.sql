-- Safeguards against duplicate mixtapes.
--
-- Background: editing a mixtape was producing a second row on the dashboard. The
-- duplicates always came as one draft + one published with DIFFERENT statuses,
-- where the newer row's status matched whatever was in the form at save time.
-- That rules out a row-cloning trigger (which would copy the source status and
-- yield same-status pairs) and points at the edit flow performing an INSERT that
-- carried the form's status instead of an in-place UPDATE. The app fix lives in
-- this PR (Save button disabled while saving + re-entry guard; updateMixtape now
-- strips `id` and treats a matched-zero update as an error). The constraint below
-- is the DB-level catch-all that makes a recurrence impossible regardless of
-- which frontend/code path is running.
--
-- Run in the Supabase SQL editor (or psql with the service-role connection).

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1 — Lock it down. Enforce uniqueness so a duplicate can NEVER silently
-- persist again: any duplicate write fails loudly with a unique-violation error.
--
-- The 4 known duplicate drafts (ids 372, 375, 376, 382 for numbers 203/204/205/
-- 208) were removed manually on 2026-06-04, so this should apply cleanly. If it
-- errors with "could not create unique index ... duplicate key value", a leftover
-- duplicate remains — run the OPTIONAL block below to find and clear it first.
-- ─────────────────────────────────────────────────────────────────────────────
alter table mixtapes
  add constraint mixtapes_number_unique unique (number);

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2 (optional sanity check) — list any triggers on the mixtapes table.
-- Expected: no rows. (If something shows up that inserts/clones on UPDATE, that
-- would be a second source of duplicates — inspect and drop it:
--   DROP TRIGGER <tgname> ON public.mixtapes; )
-- ─────────────────────────────────────────────────────────────────────────────
select tgname,
       case tgenabled when 'O' then 'enabled' when 'D' then 'disabled' else tgenabled end as state,
       pg_get_triggerdef(oid) as definition
from pg_trigger
where tgrelid = 'public.mixtapes'::regclass
  and not tgisinternal;

-- ─────────────────────────────────────────────────────────────────────────────
-- OPTIONAL — only if STEP 1 fails because duplicates still exist.
-- Inspect duplicates by number, then delete the unwanted copy (review first!),
-- and re-run STEP 1.
-- ─────────────────────────────────────────────────────────────────────────────
-- select number,
--        count(*)                      as copies,
--        array_agg(id     order by id) as ids,
--        array_agg(status order by id) as statuses
-- from mixtapes
-- group by number
-- having count(*) > 1
-- order by number;
--
-- -- Delete the draft duplicate of any number that also has another row.
-- -- (Confirm the row you want to KEEP holds the correct content before deleting.)
-- delete from mixtapes a
-- using mixtapes b
-- where a.number = b.number
--   and a.id     <> b.id
--   and a.status = 'draft';
