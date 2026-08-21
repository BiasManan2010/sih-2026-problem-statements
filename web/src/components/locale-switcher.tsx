"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check, Globe } from "@/components/icons/geist";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeNames, routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-lg border-border/80 px-2.5 font-mono text-xs font-medium"
            aria-label={t("header.themeToggle")}
          >
            <Globe className="size-3.5" />
            <span className="uppercase">{locale}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            disabled={isPending}
            onClick={() => {
              startTransition(() => {
                router.replace(pathname, { locale: loc });
              });
            }}
          >
            {locale === loc ? (
              <Check className="size-3.5" />
            ) : (
              <span className="size-3.5" />
            )}
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
