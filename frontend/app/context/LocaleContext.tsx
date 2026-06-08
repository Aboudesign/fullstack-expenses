"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LOCALE_SETTINGS,
  loadLocaleSettings,
  saveLocaleSettings,
} from "../locale-config";
import type { LocaleSettings } from "../types";
import { createFormatters } from "../utils";

type LocaleContextValue = ReturnType<typeof createFormatters> & {
  settings: LocaleSettings;
  setLocale: (locale: string) => void;
  setCurrency: (currency: string) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<LocaleSettings>(() =>
    typeof window !== "undefined"
      ? loadLocaleSettings()
      : DEFAULT_LOCALE_SETTINGS
  );

  const setLocale = useCallback(
    (locale: string) => setSettings((prev) => {
      const next = { ...prev, locale };
      saveLocaleSettings(next);
      document.documentElement.lang = locale.split("-")[0];
      return next;
    }),
    []
  );

  const setCurrency = useCallback(
    (currency: string) => setSettings((prev) => {
      const next = { ...prev, currency };
      saveLocaleSettings(next);
      return next;
    }),
    []
  );

  const formatters = useMemo(() => createFormatters(settings), [settings]);

  const value = useMemo(
    () => ({
      settings,
      setLocale,
      setCurrency,
      ...formatters,
    }),
    [settings, setLocale, setCurrency, formatters]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
