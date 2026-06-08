import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { LocaleProvider } from "./context/LocaleContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mes dépenses",
  description: "Gérez vos revenus et dépenses du quotidien",
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("expenses-theme");
    var theme = stored === "light" || stored === "night"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "night");
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased bg-base-300`}
      >
        <LocaleProvider>
          <Toaster position="top-center" />
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex justify-center">{children}</div>
            <Footer />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
