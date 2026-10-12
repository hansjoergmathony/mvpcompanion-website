import { neon } from "@neondatabase/serverless";
import type { IdeaLibrary } from "@/lib/project/types";

const MAX_REVISIONS = 20;

export type CloudLibraryRecord = {
  library: IdeaLibrary;
  revision: number;
  updatedAt: string;
};

function sqlClient() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  return databaseUrl ? neon(databaseUrl) : null;
}

export function isCloudStorageConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export async function loadCloudLibrary(ownerEmail: string): Promise<CloudLibraryRecord | null> {
  const sql = sqlClient();
  if (!sql) {
    return null;
  }

  const rows = await sql`
    SELECT library, revision, updated_at
    FROM mvpcompanion_draft_libraries
    WHERE owner_email = ${ownerEmail}
    LIMIT 1
  `;
  const row = rows[0] as { library?: unknown; revision?: unknown; updated_at?: unknown } | undefined;
  if (!row || typeof row.revision !== "number" || typeof row.updated_at !== "string") {
    return null;
  }

  return { library: row.library as IdeaLibrary, revision: row.revision, updatedAt: row.updated_at };
}

export async function saveCloudLibrary(
  ownerEmail: string,
  library: IdeaLibrary,
  expectedRevision: number | null,
): Promise<CloudLibraryRecord | "conflict"> {
  const sql = sqlClient();
  if (!sql) {
    throw new Error("Cloud storage is not configured.");
  }

  const serialized = JSON.stringify(library);
  const updated = expectedRevision === null
    ? await sql`
        INSERT INTO mvpcompanion_draft_libraries (owner_email, library, revision, updated_at)
        VALUES (${ownerEmail}, ${serialized}::jsonb, 1, NOW())
        ON CONFLICT (owner_email) DO NOTHING
        RETURNING library, revision, updated_at
      `
    : await sql`
        UPDATE mvpcompanion_draft_libraries
        SET library = ${serialized}::jsonb, revision = revision + 1, updated_at = NOW()
        WHERE owner_email = ${ownerEmail} AND revision = ${expectedRevision}
        RETURNING library, revision, updated_at
      `;

  const row = updated[0] as { library?: unknown; revision?: unknown; updated_at?: unknown } | undefined;
  if (!row || typeof row.revision !== "number" || typeof row.updated_at !== "string") {
    return "conflict";
  }

  await sql`
    INSERT INTO mvpcompanion_draft_revisions (owner_email, revision, library)
    VALUES (${ownerEmail}, ${row.revision}, ${JSON.stringify(row.library)}::jsonb)
    ON CONFLICT (owner_email, revision) DO NOTHING
  `;
  await sql`
    DELETE FROM mvpcompanion_draft_revisions
    WHERE owner_email = ${ownerEmail}
      AND revision NOT IN (
        SELECT revision
        FROM mvpcompanion_draft_revisions
        WHERE owner_email = ${ownerEmail}
        ORDER BY revision DESC
        LIMIT ${MAX_REVISIONS}
      )
  `;

  return { library: row.library as IdeaLibrary, revision: row.revision, updatedAt: row.updated_at };
}
