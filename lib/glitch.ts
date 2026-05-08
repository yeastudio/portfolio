export interface GlitchStyle {
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  letterSpacing: string;
  color: string;
  backgroundColor: string;
}

export const GLITCH_STATES: GlitchStyle[] = [
  // Newsreader italic
  { fontFamily: "var(--font-serif)", fontWeight: "300", fontStyle: "italic",  letterSpacing: "0.05em", color: "#EAE6E0", backgroundColor: "" },
  // Stretched sans
  { fontFamily: "var(--font-sans)",  fontWeight: "300", fontStyle: "normal",  letterSpacing: "0.4em",  color: "#EAE6E0", backgroundColor: "" },
  // Newsreader upright
  { fontFamily: "var(--font-serif)", fontWeight: "400", fontStyle: "normal",  letterSpacing: "0.1em",  color: "#EAE6E0", backgroundColor: "" },
  // Tight muted
  { fontFamily: "var(--font-sans)",  fontWeight: "500", fontStyle: "normal",  letterSpacing: "0em",    color: "#888880", backgroundColor: "" },
  // Newsreader italic 400
  { fontFamily: "var(--font-serif)", fontWeight: "400", fontStyle: "italic",  letterSpacing: "0.08em", color: "#EAE6E0", backgroundColor: "" },
  // Wide muted
  { fontFamily: "var(--font-sans)",  fontWeight: "300", fontStyle: "normal",  letterSpacing: "0.25em", color: "#888880", backgroundColor: "" },
  // HIGHLIGHT: full invert — dark text on off-white
  { fontFamily: "var(--font-sans)",  fontWeight: "500", fontStyle: "normal",  letterSpacing: "0.1em",  color: "#0B0A09", backgroundColor: "#EAE6E0" },
  // HIGHLIGHT: invert + serif
  { fontFamily: "var(--font-serif)", fontWeight: "300", fontStyle: "italic",  letterSpacing: "0.05em", color: "#0B0A09", backgroundColor: "#EAE6E0" },
  // HIGHLIGHT: muted bg — dark text on warm gray
  { fontFamily: "var(--font-sans)",  fontWeight: "500", fontStyle: "normal",  letterSpacing: "0.1em",  color: "#0B0A09", backgroundColor: "#888880" },
  // HIGHLIGHT: invert stretched
  { fontFamily: "var(--font-sans)",  fontWeight: "300", fontStyle: "normal",  letterSpacing: "0.3em",  color: "#0B0A09", backgroundColor: "#EAE6E0" },
];

export const STEP_MS = 60;
export const GLITCH_STEPS = 5;

export function applyGlitch(el: HTMLElement, s: GlitchStyle) {
  el.style.fontFamily      = s.fontFamily;
  el.style.fontWeight      = s.fontWeight;
  el.style.fontStyle       = s.fontStyle;
  el.style.letterSpacing   = s.letterSpacing;
  el.style.color           = s.color;
  el.style.backgroundColor = s.backgroundColor;
}

export function resetGlitch(el: HTMLElement) {
  el.style.fontFamily      = "";
  el.style.fontWeight      = "";
  el.style.fontStyle       = "";
  el.style.letterSpacing   = "";
  el.style.color           = "";
  el.style.backgroundColor = "";
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
