-- Private MVPCompanion draft storage. Run this once in the Neon SQL Editor.
-- Draft data is scoped to the authenticated admin email and never exposed directly to browsers.

CREATE TABLE IF NOT EXISTS mvpcompanion_draft_libraries (
  owner_email TEXT PRIMARY KEY,
  library JSONB NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mvpcompanion_draft_revisions (
  id BIGSERIAL PRIMARY KEY,
  owner_email TEXT NOT NULL,
  revision INTEGER NOT NULL,
  library JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT mvpcompanion_draft_revisions_owner_revision_unique
    UNIQUE (owner_email, revision)
);

CREATE INDEX IF NOT EXISTS mvpcompanion_draft_revisions_owner_created_at_idx
  ON mvpcompanion_draft_revisions (owner_email, created_at DESC);
