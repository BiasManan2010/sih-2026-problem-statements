"use client";

import { BookmarkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useShortlist } from "@/hooks/use-shortlist";

export function ShortlistButton({
  psNumber,
  variant = "ghost",
  size = "icon",
}: {
  psNumber: string;
  variant?: "ghost" | "outline" | "secondary";
  size?: "icon" | "sm";
}) {
  const { isShortlisted, toggle } = useShortlist();
  const active = isShortlisted(psNumber);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant={active ? "secondary" : variant}
            size={size}
            aria-label={active ? "Remove from shortlist" : "Add to shortlist"}
            aria-pressed={active}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(psNumber);
            }}
          >
            <BookmarkIcon className={active ? "size-4 fill-current" : "size-4"} />
          </Button>
        }
      />
      <TooltipContent>{active ? "Remove from shortlist" : "Add to shortlist"}</TooltipContent>
    </Tooltip>
  );
}
