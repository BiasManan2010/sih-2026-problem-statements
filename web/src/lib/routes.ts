import { problemStatements } from "@/lib/ps";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const themes = [...new Set(problemStatements.map((ps) => ps.theme))].sort();
export const orgs = [...new Set(problemStatements.map((ps) => ps.org))].sort();

export const themeSlugs: Record<string, string> = Object.fromEntries(
  themes.map((name) => [name, slugify(name)]),
);
export const orgSlugs: Record<string, string> = Object.fromEntries(
  orgs.map((name) => [name, slugify(name)]),
);

export const themeBySlug: Record<string, string> = Object.fromEntries(
  themes.map((name) => [slugify(name), name]),
);
export const orgBySlug: Record<string, string> = Object.fromEntries(
  orgs.map((name) => [slugify(name), name]),
);

export function themePs(name: string) {
  return problemStatements.filter((ps) => ps.theme === name);
}

export function orgPs(name: string) {
  return problemStatements.filter((ps) => ps.org === name);
}
