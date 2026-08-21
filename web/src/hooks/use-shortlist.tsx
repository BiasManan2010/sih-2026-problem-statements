"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useLocalStorage } from "@/hooks/use-local-storage";

interface ShortlistContextValue {
  shortlisted: Set<string>;
  isShortlisted: (psNumber: string) => boolean;
  toggle: (psNumber: string) => void;
  clear: () => void;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

const KEY = "sih2026:shortlist";

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useLocalStorage<string[]>(KEY, []);
  const [shortlisted, setShortlisted] = useState<Set<string>>(() => new Set(raw));

  const toggle = useCallback(
    (psNumber: string) => {
      setShortlisted((prev) => {
        const next = new Set(prev);
        if (next.has(psNumber)) next.delete(psNumber);
        else next.add(psNumber);
        setRaw([...next]);
        return next;
      });
    },
    [setRaw],
  );

  const clear = useCallback(() => {
    setShortlisted(new Set());
    setRaw([]);
  }, [setRaw]);

  const isShortlisted = useCallback(
    (psNumber: string) => shortlisted.has(psNumber),
    [shortlisted],
  );

  const value = useMemo(
    () => ({ shortlisted, isShortlisted, toggle, clear }),
    [shortlisted, isShortlisted, toggle, clear],
  );

  return (
    <ShortlistContext.Provider value={value}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used within ShortlistProvider");
  return ctx;
}
