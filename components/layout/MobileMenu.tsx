"use client";

import { useEffect, useRef } from "react";
import { PrimaryNav } from "@/components/layout/PrimaryNav";

export function MobileMenu() {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && detailsRef.current?.open) {
        detailsRef.current.open = false;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <details ref={detailsRef} className="relative lg:hidden">
      <summary className="cursor-pointer list-none rounded-md border border-border bg-card px-3 py-2 text-sm text-navy [&::-webkit-details-marker]:hidden">
        Menu
      </summary>
      <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-border bg-card p-3 shadow-lg shadow-navy/5">
        <PrimaryNav
          variant="mobile"
          onNavigate={() => {
            if (detailsRef.current) {
              detailsRef.current.open = false;
            }
          }}
        />
      </div>
    </details>
  );
}
