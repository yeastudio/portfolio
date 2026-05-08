"use client";

import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} style={{ animation: "pageFadeIn 700ms ease forwards" }}>
      {children}
    </div>
  );
}
