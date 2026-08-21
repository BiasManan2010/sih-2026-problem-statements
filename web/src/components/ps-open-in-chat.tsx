"use client";

import { ChevronDownIcon, SparklesIcon } from "lucide-react";

import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInLabel,
  OpenInScira,
  OpenInSeparator,
  OpenInT3,
  OpenInv0,
} from "@/components/ai-elements/open-in-chat";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { psChatPrompt, type ProblemStatement } from "@/lib/ps";

export function PsOpenInChat({
  ps,
  size = "sm",
  className,
}: {
  ps: ProblemStatement;
  size?: "sm" | "icon";
  className?: string;
}) {
  const query = psChatPrompt(ps);

  return (
    <OpenIn query={query}>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size={size === "icon" ? "icon" : "sm"}
            className={cn(
              size === "sm" && "gap-1.5 text-label-12",
              className,
            )}
            aria-label="Open problem statement in a chat"
          >
            {size === "icon" ? (
              <SparklesIcon className="size-4" />
            ) : (
              <>
                <SparklesIcon className="size-3.5" />
                Open in chat
                <ChevronDownIcon className="size-3.5" />
              </>
            )}
          </Button>
        }
      />
      <OpenInContent>
        <DropdownMenuGroup>
          <OpenInLabel>Open with problem statement</OpenInLabel>
          <OpenInSeparator />
          <OpenInChatGPT />
          <OpenInClaude />
          <OpenInCursor />
          <OpenInScira />
          <OpenInT3 />
          <OpenInv0 />
        </DropdownMenuGroup>
      </OpenInContent>
    </OpenIn>
  );
}
