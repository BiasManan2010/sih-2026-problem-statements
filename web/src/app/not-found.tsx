import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-6xl font-bold text-muted-foreground">404</p>
      <h1 className="text-xl font-semibold">Problem statement not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This statement does not exist or has been removed from the archive.
      </p>
      <Button render={<Link href="/" />}>Browse all statements</Button>
    </div>
  );
}
