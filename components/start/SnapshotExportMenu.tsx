"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { exportIdeaAsJson, exportIdeaAsPdf } from "@/lib/project/export";
import type { Idea } from "@/lib/project/types";

export function SnapshotExportMenu({ idea }: { idea: Idea }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="secondary"
        aria-expanded={isOpen}
        aria-controls="snapshot-export-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        Export
      </Button>
      {isOpen ? (
        <div
          id="snapshot-export-menu"
          className="absolute right-0 z-10 mt-2 w-52 rounded-xl border border-border bg-card p-2 shadow-lg"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-ice"
            onClick={() => {
              exportIdeaAsJson(idea);
              setIsOpen(false);
            }}
          >
            Export as JSON
          </button>
          <button
            type="button"
            role="menuitem"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-ice"
            onClick={() => {
              exportIdeaAsPdf(idea);
              setIsOpen(false);
            }}
          >
            Export as PDF
          </button>
        </div>
      ) : null}
    </div>
  );
}
