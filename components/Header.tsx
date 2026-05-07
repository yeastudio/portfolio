import NavLink from "@/components/NavLink";
import LogoMark from "@/components/LogoMark";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 grid grid-cols-3 items-center px-4 md:px-6 py-6 bg-transparent">
      <div className="flex justify-start">
        <NavLink href="/index">Index</NavLink>
      </div>
      <div className="flex justify-center">
        <LogoMark />
      </div>
      <div className="flex justify-end">
        <NavLink href="/info">Info</NavLink>
      </div>
    </header>
  );
}
