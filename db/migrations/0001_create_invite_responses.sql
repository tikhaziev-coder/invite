CREATE TABLE IF NOT EXISTS invite_responses (
  id TEXT PRIMARY KEY,
  invitation_id TEXT NOT NULL,
  activity TEXT NOT NULL,
  activity_label TEXT NOT NULL,
  location_id TEXT NOT NULL,
  location_name TEXT NOT NULL,
  map_url TEXT NOT NULL,
  meeting_date TEXT NOT NULL,
  meeting_time TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  submitted_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invite_responses_invitation_submitted
ON invite_responses (invitation_id, submitted_at DESC);
