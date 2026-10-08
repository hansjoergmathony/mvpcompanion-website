import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/content/en";

type AppEntryLinksProps = {
  appEntry: Dictionary["appEntry"];
  inverted?: boolean;
  showContinue?: boolean;
  showDirect?: boolean;
  directPrompt?: string;
  className?: string;
};

export function AppEntryLinks({
  appEntry,
  inverted = false,
  showContinue = true,
  showDirect = true,
  directPrompt,
  className = "",
}: AppEntryLinksProps) {
  const primaryVariant = inverted ? "inverse" : "primary";
  const linkClassName = inverted
    ? "text-sm font-medium text-white/80 underline-offset-2 hover:text-white hover:underline"
    : "text-sm font-medium text-blue underline-offset-2 hover:underline";

  if (!appEntry.href) {
    return (
      <div className={`space-y-3 ${className}`}>
        {showContinue ? (
          <p className={inverted ? "text-sm text-white/70" : "text-sm text-muted"}>
            {appEntry.unavailableContinueLabel}
          </p>
        ) : null}
        {showDirect ? (
          <p className={inverted ? "text-sm text-white/70" : "text-sm text-muted"}>
            {appEntry.unavailableDirectLabel}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-start gap-4 ${className}`}>
      {showContinue ? (
        <Button href={appEntry.href} variant={primaryVariant}>
          {appEntry.continueLabel}
        </Button>
      ) : null}
      {showDirect ? (
        <div className="space-y-2">
          {directPrompt ? (
            <p className={inverted ? "text-sm text-white/65" : "text-sm text-muted"}>
              {directPrompt}
            </p>
          ) : null}
          <a href={appEntry.href} className={linkClassName}>
            {appEntry.directStartLabel}
          </a>
        </div>
      ) : null}
    </div>
  );
}
