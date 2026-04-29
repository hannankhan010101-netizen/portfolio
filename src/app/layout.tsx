import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { SITE_META } from "@/constants/site-meta";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { SiteLoader } from "@/components/portfolio/site-loader";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_META.title,
  description: SITE_META.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Anti-flash: set theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t||m);}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} min-h-full bg-zinc-950 font-sans text-zinc-50 antialiased`}
      >
        <QueryProvider>
          <ThemeProvider>
            <SiteLoader>{children}</SiteLoader>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
