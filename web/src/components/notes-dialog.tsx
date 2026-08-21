"use client";

import { NotebookPenIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useNotes } from "@/hooks/use-notes";

export function NotesDialog({ psNumber, title }: { psNumber: string; title: string }) {
  const { getNote, setNote, clearNote } = useNotes();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const openDialog = (isOpen: boolean) => {
    if (isOpen && !loaded) {
      setText(getNote(psNumber));
      setLoaded(true);
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={openDialog}>
      <DialogTrigger
        render={<Button variant="outline" size="sm">Notes</Button>}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Private notes · {psNumber}</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Key requirements, ideas, links, contacts - stored only in your browser…"
          className="min-h-40"
        />
        <DialogFooter>
          <Button
            variant="ghost"
            disabled={!getNote(psNumber)}
            onClick={() => {
              clearNote(psNumber);
              setText("");
              toast.success("Notes cleared");
            }}
          >
            Clear
          </Button>
          <Button
            onClick={() => {
              setNote(psNumber, text);
              toast.success("Notes saved");
              setOpen(false);
            }}
          >
            <NotebookPenIcon className="size-4" />
            Save note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
