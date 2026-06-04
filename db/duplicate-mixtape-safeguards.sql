-- Safeguards against duplicate mixtapes.
--
-- Context: editing a mixtape was producing a second row (a *draft* clone) on the
-- frontpage / dashboard. The app's edit path only issues `UPDATE ... WHERE id`,
-- which cannot create a row — so a "new draft row on edit" points at the database,
-- most likely a TRIGGER that inserts a copy on UPDATE. Run these in the Supabase
-- SQL editor (or psql with the service-role connection string). Run STEP 1 and
-- STEP 2 first and read the output before running the destructive/DDL steps.

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1 — PRIME SUSPECT: list triggers on the mixtapes table.
-- If anything shows up here (other than nothing), that trigger is almost certainly
-- what clones the row on edit. Inspect its definition, then drop/fix it:
--   DROP TRIGGER <tgname> ON public.mixtapes;
-- ─────────────────────────────────────────────────────────────────────────────
select tgname,
       case tgenabled when 'O' then 'enabled' when 'D' then 'disabled' else tgenabled end as state,
       pg_get_triggerdef(oid) as definition
from pg_trigger
where tgrelid = 'public.mixtapes'::regclass
  and not tgisinternal;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2 — See the current duplicates (grouped by mixtape number).
-- ─────────────────────────────────────────────────────────────────────────────
select number,
       count(*)                          as copies,
       array_agg(id     order by id)     as ids,
       array_agg(status order by id)     as statuses
from mixtapes
group by number
having count(*) > 1
order by number;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 3 — Clean up: delete the *draft* duplicate of any number that also has
-- another row. (Review STEP 2 output first — this is destructive.)
-- ─────────────────────────────────────────────────────────────────────────────
delete from mixtapes a
using mixtapes b
where a.number = b.number
  and a.id     <> b.id
  and a.status = 'draft';

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 4 — Enforce uniqueness so a duplicate can NEVER silently persist again,
-- regardless of source (app double-submit, a stray trigger, manual edit, etc.).
-- A duplicate write will now fail loudly with a unique-violation error instead.
-- (Run STEP 3 first; this fails if duplicates still exist.)
-- ─────────────────────────────────────────────────────────────────────────────
alter table mixtapes
  add constraint mixtapes_number_unique unique (number);
