import {InfoIcon} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { problemStatements } from "@/lib/ps";

export function FreshnessBanner() {
  const scraped = problemStatements[0]?.scraped_at;
  if (!scraped) return null;
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <Alert className="border-amber-600/30 bg-amber-600/10 text-foreground backdrop-blur-xs rounded-xl">
        <InfoIcon className="size-4 text-amber-700 dark:text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <AlertTitle className="font-semibold text-xs flex items-center gap-2">
            <span>Verified Database Snapshot</span>
            <span className="rounded border border-amber-600/30 bg-amber-600/10 px-1.5 py-0.5 font-mono text-[10px] text-amber-700 dark:text-amber-500">
              {scraped}
            </span>
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
            Deadlines and idea counts reflect official sih.gov.in records. Always verify final guidelines on the official portal prior to team submission.
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}

