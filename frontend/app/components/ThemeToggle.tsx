"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "../constants";
import type { ThemeMode } from "../types";

function getTheme(): ThemeMode {
  const value = document.documentElement.getAttribute("data-theme");
  return value === "light" ? "light" : "night";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "night");

  const toggle = () => {
    const next: ThemeMode = getTheme() === "night" ? "light" : "night";
    applyTheme(next);
  };

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm btn-circle"
      onClick={toggle}
      aria-label={
        theme === "night" ? "Activer le thème clair" : "Activer le thème sombre"
      }
      title={theme === "night" ? "Thème clair" : "Thème sombre"}
    >
      {theme === "night" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
