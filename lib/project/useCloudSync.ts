"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parseIdeaLibrary } from "@/lib/project/storage";
import type { IdeaLibrary } from "@/lib/project/types";

export type CloudSyncState =
  | "hidden"
  | "checking"
  | "not_configured"
  | "needs_upload"
  | "needs_decision"
  | "syncing"
  | "saved"
  | "error";

type CloudRecord = {
  library: IdeaLibrary;
  revision: number;
  updatedAt: string;
};

type CloudResponse = {
  configured?: boolean;
  record?: { library?: unknown; revision?: unknown; updatedAt?: unknown } | null;
  error?: string;
};

function libraryText(library: IdeaLibrary): string {
  return JSON.stringify(library);
}

function validRecord(value: CloudResponse["record"]): CloudRecord | null {
  if (!value || typeof value.revision !== "number" || typeof value.updatedAt !== "string") {
    return null;
  }
  const library = parseIdeaLibrary(value.library);
  return library ? { library, revision: value.revision, updatedAt: value.updatedAt } : null;
}

export function useCloudSync({
  isAdmin,
  library,
  replaceIdeaLibrary,
}: {
  isAdmin: boolean;
  library: IdeaLibrary;
  replaceIdeaLibrary: (library: IdeaLibrary) => boolean;
}) {
  const [state, setState] = useState<CloudSyncState>("hidden");
  const [error, setError] = useState<string | null>(null);
  const [syncCycle, setSyncCycle] = useState(0);
  const libraryRef = useRef(library);
  const revisionRef = useRef<number | null>(null);
  const cloudRecordRef = useRef<CloudRecord | null>(null);
  const lastSyncedRef = useRef<string | null>(null);
  const syncEnabledRef = useRef(false);
  const initializedRef = useRef(false);
  const savingRef = useRef(false);

  useEffect(() => {
    libraryRef.current = library;
  }, [library]);

  const save = useCallback(async (nextLibrary: IdeaLibrary, expectedRevision = revisionRef.current) => {
    if (savingRef.current) {
      return;
    }

    savingRef.current = true;
    setState("syncing");
    setError(null);
    try {
      const response = await fetch("/api/admin/drafts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ library: nextLibrary, expectedRevision }),
      });
      const payload = await response.json() as CloudResponse;
      const record = validRecord(payload.record);
      if (response.status === 409 && record) {
        cloudRecordRef.current = record;
        revisionRef.current = record.revision;
        syncEnabledRef.current = false;
        setState("needs_decision");
        return;
      }
      if (!response.ok || !record) {
        throw new Error(payload.error || "Cloud storage is temporarily unavailable.");
      }

      cloudRecordRef.current = record;
      revisionRef.current = record.revision;
      lastSyncedRef.current = libraryText(nextLibrary);
      syncEnabledRef.current = true;
      setState("saved");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Cloud storage is temporarily unavailable.");
      setState("error");
    } finally {
      savingRef.current = false;
      const latest = libraryText(libraryRef.current);
      if (syncEnabledRef.current && latest !== lastSyncedRef.current) {
        setSyncCycle((value) => value + 1);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAdmin || initializedRef.current) {
      return;
    }

    let active = true;
    setState("checking");
    void fetch("/api/admin/drafts", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as CloudResponse;
        if (!response.ok) {
          throw new Error(payload.error || "Cloud storage is temporarily unavailable.");
        }
        return payload;
      })
      .then((payload) => {
        if (!active) {
          return;
        }
        initializedRef.current = true;
        if (!payload.configured) {
          setState("not_configured");
          return;
        }

        const record = validRecord(payload.record);
        if (!record) {
          setState("needs_upload");
          return;
        }

        cloudRecordRef.current = record;
        revisionRef.current = record.revision;
        const local = libraryRef.current;
        if (libraryText(local) === libraryText(record.library)) {
          lastSyncedRef.current = libraryText(record.library);
          syncEnabledRef.current = true;
          setState("saved");
          return;
        }

        if (local.ideas.length > 0) {
          setState("needs_decision");
          return;
        }

        replaceIdeaLibrary(record.library);
        lastSyncedRef.current = libraryText(record.library);
        syncEnabledRef.current = true;
        setState("saved");
      })
      .catch((reason) => {
        if (active) {
          initializedRef.current = true;
          setError(reason instanceof Error ? reason.message : "Cloud storage is temporarily unavailable.");
          setState("error");
        }
      });

    return () => {
      active = false;
    };
  }, [isAdmin, replaceIdeaLibrary]);

  useEffect(() => {
    if (!isAdmin || !syncEnabledRef.current) {
      return;
    }

    const serialized = libraryText(library);
    if (serialized === lastSyncedRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      void save(library);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [isAdmin, library, save, syncCycle]);

  const uploadLocal = useCallback(() => {
    void save(libraryRef.current, null);
  }, [save]);

  const keepLocalVersion = useCallback(() => {
    void save(libraryRef.current, revisionRef.current);
  }, [save]);

  const useCloudVersion = useCallback(() => {
    const record = cloudRecordRef.current;
    if (!record) {
      return;
    }
    replaceIdeaLibrary(record.library);
    revisionRef.current = record.revision;
    lastSyncedRef.current = libraryText(record.library);
    syncEnabledRef.current = true;
    setState("saved");
    setError(null);
  }, [replaceIdeaLibrary]);

  const retry = useCallback(() => {
    if (!initializedRef.current) {
      return;
    }
    void save(libraryRef.current, revisionRef.current);
  }, [save]);

  return {
    state,
    error,
    uploadLocal,
    keepLocalVersion,
    useCloudVersion,
    retry,
  };
}
