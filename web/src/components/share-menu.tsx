"use client";

import {
  CheckIcon,
  ClipboardCopyIcon,
  FileTextIcon,
  Link2Icon,
  SendIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { psMarkdown, type ProblemStatement } from "@/lib/ps";

function useClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(message);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }, []);
  return { copied, copy };
}

export function ShareMenu({ ps }: { ps: ProblemStatement }) {
  const { copy } = useClipboard();
  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = `${ps.ps_number} · ${ps.title}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm">Share</Button>} />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share {ps.ps_number}</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => copy(url, "Link copied")}
        >
          <Link2Icon className="size-4" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            copy(psMarkdown(ps), "Problem statement copied as Markdown")
          }
        >
          <FileTextIcon className="size-4" />
          Copy as Markdown
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
              "_blank",
              "noopener",
            )
          }
        >
          <SendIcon className="size-4" />
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
              "_blank",
              "noopener",
            )
          }
        >
          <SendIcon className="size-4" />
          Share on Telegram
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n${url}`)}`,
              "_blank",
              "noopener",
            )
          }
        >
          <CheckIcon className="size-4" />
          Post on X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copy(url, "Link copied")}>
          <ClipboardCopyIcon className="size-4" />
          Copy short description
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
