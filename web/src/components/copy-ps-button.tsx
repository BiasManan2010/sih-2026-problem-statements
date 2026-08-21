"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { psMarkdown, type ProblemStatement } from "@/lib/ps";

export function CopyPsButton({
  ps,
  size = "sm",
  className,
}: {
  ps: ProblemStatement;
  size?: "sm" | "icon";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(psMarkdown(ps));
      setCopied(true);
      toast.success(`${ps.ps_number} copied as Markdown`);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size={size === "icon" ? "icon" : "sm"}
            className={cn(size === "sm" && "gap-1.5 text-label-12", className)}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              copy();
            }}
            aria-label="Copy problem statement as Markdown"
          >
            {copied ? (
              <CheckIcon className="size-3.5 text-green-700 dark:text-green-500" />
            ) : (
              <ClipboardIcon className="size-3.5" />
            )}
            {size === "sm" && (copied ? "Copied" : "Copy")}
          </Button>
        }
      />
      <TooltipContent>Copy as Markdown</TooltipContent>
    </Tooltip>
  );
}
