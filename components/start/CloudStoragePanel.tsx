"use client";

import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/content/en";
import type { CloudSyncState } from "@/lib/project/useCloudSync";

type Labels = Dictionary["ui"]["library"];

export function CloudStoragePanel({
  labels,
  state,
  error,
  onUploadLocal,
  onKeepLocal,
  onUseCloud,
  onRetry,
}: {
  labels: Labels;
  state: CloudSyncState;
  error: string | null;
  onUploadLocal: () => void;
  onKeepLocal: () => void;
  onUseCloud: () => void;
  onRetry: () => void;
}) {
  if (state === "hidden") {
    return null;
  }

  const title = {
    checking: labels.cloudChecking,
    not_configured: labels.cloudNotConfigured,
    needs_upload: labels.cloudNeedsUpload,
    needs_decision: labels.cloudDecisionRequired,
    syncing: labels.cloudSyncing,
    saved: labels.cloudSaved,
    error: labels.cloudError,
  }[state];

  return (
    <section className="mt-5 rounded-xl border border-blue bg-ice px-4 py-4" aria-live="polite">
      <p className="text-sm font-medium text-navy">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        {state === "not_configured" ? labels.cloudNotConfiguredBody :
          state === "needs_upload" ? labels.cloudNeedsUploadBody :
          state === "needs_decision" ? labels.cloudDecisionBody :
          state === "saved" ? labels.cloudSavedBody :
          state === "error" ? error || labels.cloudErrorBody : labels.cloudPrivateNote}
      </p>
      {state === "needs_upload" ? (
        <div className="mt-3"><Button type="button" variant="secondary" onClick={onUploadLocal}>{labels.cloudUpload}</Button></div>
      ) : null}
      {state === "needs_decision" ? (
        <div className="mt-3 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={onUseCloud}>{labels.cloudUseVersion}</Button>
          <Button type="button" variant="secondary" onClick={onKeepLocal}>{labels.cloudKeepLocal}</Button>
        </div>
      ) : null}
      {state === "error" ? (
        <div className="mt-3"><Button type="button" variant="secondary" onClick={onRetry}>{labels.cloudRetry}</Button></div>
      ) : null}
    </section>
  );
}
