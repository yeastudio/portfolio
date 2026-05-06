export default function Footer() {
  return (
    <footer className="px-6 md:px-12 py-8 border-t border-[#1A1A1A] flex items-center justify-between">
      <span className="text-[11px] text-[#888888] tracking-wider uppercase">
        © YEA Studios LLC
      </span>
      <a
        href="mailto:andrew@yea.studio"
        className="text-[11px] text-[#888888] tracking-wider uppercase transition-colors duration-200 hover:text-[#EDEDED]"
      >
        andrew@yea.studio
      </a>
    </footer>
  );
}
