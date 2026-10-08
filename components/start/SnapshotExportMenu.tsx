"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/content/en";
import type { Locale } from "@/lib/i18n/config";
import {
  exportIdeaAsJson,
  exportIdeaAsMarkdown,
  exportIdeaAsPdf,
  type ExportScope,
} from "@/lib/project/export";
import type { Idea } from "@/lib/project/types";

export function SnapshotExportMenu({
  idea,
  locale,
  labels,
  pdf,
}: {
  idea: Idea;
  locale: Locale;
  labels: Dictionary["ui"]["exportMenu"];
  pdf: Dictionary["ui"]["pdf"];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scope, setScope] = useState<ExportScope>("snapshot");

  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="secondary"
        aria-expanded={isOpen}
        aria-controls="snapshot-export-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        {labels.export}
      </Button>
      {isOpen ? (
        <div
          id="snapshot-export-menu"
          className="absolute right-0 z-10 mt-2 w-72 rounded-xl border border-border bg-card p-3 shadow-lg"
          role="menu"
        >
          <fieldset>
            <legend className="px-1 text-xs uppercase tracking-[0.14em] text-muted">
              {labels.scopeLabel}
            </legend>
            <label className="mt-2 flex items-start gap-2 text-sm text-foreground">
              <input
                type="radio"
                name="export-scope"
                checked={scope === "snapshot"}
                onChange={() => setScope("snapshot")}
              />
              <span>{labels.scopeSnapshot}</span>
            </label>
            <label className="mt-2 flex items-start gap-2 text-sm text-foreground">
              <input
                type="radio"
                name="export-scope"
                checked={scope === "full"}
                onChange={() => setScope("full")}
              />
              <span>{labels.scopeFull}</span>
            </label>
          </fieldset>
          <p className="mt-3 px-1 text-xs leading-relaxed text-muted">{labels.jsonNote}</p>
          <button
            type="button"
            role="menuitem"
            className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-ice"
            onClick={() => {
              exportIdeaAsJson(idea, locale);
              setIsOpen(false);
            }}
          >
            {labels.json}
          </button>
          <button
            type="button"
            role="menuitem"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-ice"
            onClick={() => {
              exportIdeaAsPdf(idea, locale, pdf, scope);
              setIsOpen(false);
            }}
          >
            {labels.pdf}
          </button>
          <button
            type="button"
            role="menuitem"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-ice"
            onClick={() => {
              exportIdeaAsMarkdown(idea, locale, scope);
              setIsOpen(false);
            }}
          >
            {labels.markdown}
          </button>
        </div>
      ) : null}
    </div>
  );
}
