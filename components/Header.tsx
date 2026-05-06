import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 bg-[#0A0A0A]">
      <Link
        href="/"
        className="flex items-center justify-center w-8 h-8 bg-black border border-[#2A2A2A] text-[#EDEDED] shrink-0"
        style={{ fontSize: "11px", letterSpacing: "0.02em" }}
      >
        yea
      </Link>
      <nav className="flex gap-8">
        <Link
          href="/index"
          className="text-[12px] text-[#888888] tracking-[0.08em] lowercase transition-colors duration-200 hover:text-[#EDEDED]"
        >
          index
        </Link>
        <Link
          href="/info"
          className="text-[12px] text-[#888888] tracking-[0.08em] lowercase transition-colors duration-200 hover:text-[#EDEDED]"
        >
          info
        </Link>
      </nav>
    </header>
  );
}
