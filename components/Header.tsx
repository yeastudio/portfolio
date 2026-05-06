import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-6 bg-transparent">
      <Link href="/" className="shrink-0">
        <Image
          src="/logo.png"
          alt="Yea Studios"
          height={32}
          width={0}
          style={{ width: "auto", height: "32px" }}
          priority
        />
      </Link>
      <nav className="flex gap-8">
        <Link
          href="/index"
          className="text-[14px] text-[#EDEDED] tracking-wider lowercase"
        >
          index
        </Link>
        <Link
          href="/info"
          className="text-[14px] text-[#EDEDED] tracking-wider lowercase"
        >
          info
        </Link>
      </nav>
    </header>
  );
}
