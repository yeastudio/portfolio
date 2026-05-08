import NavLink from "@/components/NavLink";
import LogoMark from "@/components/LogoMark";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-6 bg-transparent">
      <LogoMark />
      <div className="flex items-center gap-4">
        <NavLink href="/">Work</NavLink>
        <NavLink href="/info">Info</NavLink>
        <NavLink href="/index">Index</NavLink>
      </div>
    </header>
  );
}
