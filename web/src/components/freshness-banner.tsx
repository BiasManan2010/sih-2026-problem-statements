import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { problemStatements } from "@/lib/ps";

export function FreshnessBanner() {
  const scraped = problemStatements[0]?.scraped_at;
  if (!scraped) return null;
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <Alert className="border-amber-500/40 bg-amber-500/5">
        <InfoIcon className="size-4 text-amber-500" />
        <AlertTitle>Snapshot from {scraped}</AlertTitle>
        <AlertDescription>
          Deadlines and submitted-idea counts may change on sih.gov.in. Always
          verify on the official portal before submitting.
        </AlertDescription>
      </Alert>
    </div>
  );
}
