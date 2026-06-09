"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  DEFAULT_LOCALE_SETTINGS,
  getLocaleSnapshot,
  LOCALE_CHANGE_EVENT,
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

function subscribeLocale(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  };
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const settings = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    () => DEFAULT_LOCALE_SETTINGS
  );

  const setLocale = useCallback((locale: string) => {
    const next = { ...loadLocaleSettings(), locale };
    saveLocaleSettings(next);
    document.documentElement.lang = locale.split("-")[0];
  }, []);

  const setCurrency = useCallback((currency: string) => {
    const next = { ...loadLocaleSettings(), currency };
    saveLocaleSettings(next);
  }, []);

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
