import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import CursorProvider from "@/components/CursorProvider";
import GrainOverlay from "@/components/GrainOverlay";

// General Sans — place font files in /public/fonts/general-sans/
// Expected filenames from Fontshare download:
//   GeneralSans-Light.woff2   (300)
//   GeneralSans-Regular.woff2 (400)
//   GeneralSans-Medium.woff2  (500)
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
        <GrainOverlay />
        <CursorProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </CursorProvider>
      </body>
    </html>
  );
}
