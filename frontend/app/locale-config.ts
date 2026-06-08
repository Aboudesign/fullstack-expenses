import type { LocaleSettings } from "./types";

export const LOCALE_STORAGE_KEY = "expenses-locale";

export const DEFAULT_LOCALE_SETTINGS: LocaleSettings = {
  locale: "fr-FR",
  currency: "EUR",
};

export const LOCALES = [
  { value: "fr-FR", label: "Français (France)" },
  { value: "fr-CA", label: "Français (Canada)" },
  { value: "fr-MA", label: "Français (Maroc)" },
  { value: "fr-TN", label: "Français (Tunisie)" },
  { value: "fr-DZ", label: "Français (Algérie)" },
  { value: "fr-CH", label: "Français (Suisse)" },
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "en-CA", label: "English (Canada)" },
  { value: "es-ES", label: "Español" },
  { value: "de-DE", label: "Deutsch" },
  { value: "it-IT", label: "Italiano" },
  { value: "pt-PT", label: "Português" },
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "ar-MA", label: "العربية (المغرب)" },
  { value: "ar-SA", label: "العربية (السعودية)" },
  { value: "ar-AE", label: "العربية (الإمارات)" },
  { value: "nl-NL", label: "Nederlands" },
  { value: "tr-TR", label: "Türkçe" },
  { value: "ja-JP", label: "日本語" },
  { value: "zh-CN", label: "中文 (简体)" },
] as const;

export const CURRENCIES = [
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "USD", label: "Dollar américain", symbol: "$" },
  { value: "GBP", label: "Livre sterling", symbol: "£" },
  { value: "MAD", label: "Dirham marocain", symbol: "DH" },
  { value: "TND", label: "Dinar tunisien", symbol: "DT" },
  { value: "DZD", label: "Dinar algérien", symbol: "DA" },
  { value: "XOF", label: "Franc CFA (BCEAO)", symbol: "CFA" },
  { value: "XAF", label: "Franc CFA (BEAC)", symbol: "FCFA" },
  { value: "CHF", label: "Franc suisse", symbol: "CHF" },
  { value: "CAD", label: "Dollar canadien", symbol: "CA$" },
  { value: "JPY", label: "Yen japonais", symbol: "¥" },
  { value: "CNY", label: "Yuan chinois", symbol: "¥" },
  { value: "SAR", label: "Riyal saoudien", symbol: "SR" },
  { value: "AED", label: "Dirham des Émirats", symbol: "AED" },
  { value: "QAR", label: "Riyal qatari", symbol: "QR" },
  { value: "EGP", label: "Livre égyptienne", symbol: "E£" },
  { value: "TRY", label: "Livre turque", symbol: "₺" },
  { value: "INR", label: "Roupie indienne", symbol: "₹" },
  { value: "BRL", label: "Real brésilien", symbol: "R$" },
  { value: "MXN", label: "Peso mexicain", symbol: "MX$" },
  { value: "ZAR", label: "Rand sud-africain", symbol: "R" },
  { value: "NGN", label: "Naira nigérian", symbol: "₦" },
  { value: "SEK", label: "Couronne suédoise", symbol: "kr" },
  { value: "NOK", label: "Couronne norvégienne", symbol: "kr" },
  { value: "PLN", label: "Zloty polonais", symbol: "zł" },
] as const;

const LOCALE_VALUES = new Set<string>(LOCALES.map((l) => l.value));
const CURRENCY_VALUES = new Set<string>(CURRENCIES.map((c) => c.value));

export function isValidLocaleSettings(
  value: unknown
): value is LocaleSettings {
  if (!value || typeof value !== "object") return false;
  const v = value as LocaleSettings;
  return LOCALE_VALUES.has(v.locale) && CURRENCY_VALUES.has(v.currency);
}

export function loadLocaleSettings(): LocaleSettings {
  if (typeof window === "undefined") return DEFAULT_LOCALE_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (!raw) return DEFAULT_LOCALE_SETTINGS;
    const parsed: unknown = JSON.parse(raw);
    return isValidLocaleSettings(parsed) ? parsed : DEFAULT_LOCALE_SETTINGS;
  } catch {
    return DEFAULT_LOCALE_SETTINGS;
  }
}

export function saveLocaleSettings(settings: LocaleSettings) {
  localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(settings));
}
