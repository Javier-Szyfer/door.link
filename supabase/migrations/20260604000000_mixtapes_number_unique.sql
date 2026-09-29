-- Editing a mixtape could persist a second row instead of updating in place.
-- The app-side fix is in the edit flow; this makes a recurrence impossible
-- regardless of which code path is writing.

alter table mixtapes
  add constraint mixtapes_number_unique unique (number);
