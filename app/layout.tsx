import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import CursorProvider from "@/components/CursorProvider";
import GrainOverlay from "@/components/GrainOverlay";
import PageTransition from "@/components/PageTransition";
import PageLoader from "@/components/PageLoader";

const generalSans = localFont({
  src: [
    { path: "../public/fonts/general-sans/GeneralSans-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/general-sans/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/general-sans/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Andrew Ye — Director, Editor, Colorist",
  description: "Commercial director, editor, and colorist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${generalSans.variable} ${newsreader.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0B0A09] text-[#EAE6E0] antialiased">
        {/* SVG filter definitions — globally available for mosaic pixelation on unreleased projects */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
          <defs>
            <filter id="mosaic-pixelate" x="0" y="0" width="100%" height="100%">
              <feFlood x="20" y="20" height="2" width="2" />
              <feComposite width="40" height="40" />
              <feTile result="a" />
              <feComposite in="SourceGraphic" in2="a" operator="in" />
              <feMorphology operator="dilate" radius="20" />
            </filter>
          </defs>
        </svg>
        <PageLoader />
        <GrainOverlay />
        <CursorProvider>
          <Header />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
        </CursorProvider>
      </body>
    </html>
  );
}
