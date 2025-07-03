import { inspect } from "node:util";

type Modifiers =
  | "faint"
  | "strikethrough"
  | "conceal"
  | "swapColors"
  | "doubleUnderline"
  | "framed"
  | "overlined"
  | "bold"
  | "dim"
  | "italic"
  | "underline"
  | "blink"
  | "inverse"
  | "hidden";

type StyleOptions = {
  textColor?: Bun.ColorInput;
  backgroundColor?: Bun.ColorInput;
  style?: Modifiers[];
};

/**
 * Converts text ANSI color sequences (38/3X/90-97) to background equivalents (48/4X/100-107)
 */
function convertTextAnsiToBgAnsi(ansi: string): string {
  const rules: [RegExp, (match: RegExpExecArray) => string][] = [
    // RGB 24-bit
    [
      /\x1b\[38;2;(\d{1,3});(\d{1,3});(\d{1,3})m/g,
      (m) => `\x1b[48;2;${m[1]};${m[2]};${m[3]}m`,
    ],
    // ANSI 256
    [/\x1b\[38;5;(\d{1,3})m/g, (m) => `\x1b[48;5;${m[1]}m`],
    // Basic/Bright ANSI
    [/\x1b\[(3[0-7]|9[0-7])m/g, (m) => `\x1b[${+(m[1] ?? 0) + 10}m`],
  ];

  for (const [regex, replacer] of rules) {
    ansi = ansi.replace(regex, (...args) =>
      replacer(args as unknown as RegExpExecArray)
    );
  }

  return ansi;
}

const esc = (code: number) => `\x1b[${code}m`;

/**
 * Applies ANSI styles (colors and modifiers) to a text string for terminal output formatting.
 *
 * Uses `Bun.color` to generate ANSI sequences from color inputs,
 * and Node.js `inspect.colors` for modifiers (bold, italic, underline, etc.).
 *
 * If `Bun.enableANSIColors` is disabled, the original text is returned unchanged.
 *
 * @param text The text to style.
 * @param opts Style options:
 *   - textColor: foreground text color, accepts `Bun.ColorInput`
 *   - backgroundColor: background color, accepts `Bun.ColorInput`
 *   - style: array of modifiers to apply, e.g., ['bold', 'underline', 'italic']
 *
 * @returns The text with applied ANSI escape sequences.
 *
 * @example
 * style("Hello World!", {
 *   textColor: "cyan",
 *   backgroundColor: [0, 0, 0],
 *   style: ["bold", "underline"]
 * });
 */
export const style = (text: string, opts: StyleOptions): string => {
  if (!Bun.enableANSIColors) return text;

  const { textColor: fg, backgroundColor: bg, style } = opts;

  let center = "";
  if (bg) {
    const bgColor = Bun.color(bg, "ansi");
    if (bgColor) center += convertTextAnsiToBgAnsi(bgColor);
  }
  if (fg) center += Bun.color(fg, "ansi");

  const openSeq: string[] = [];
  const closeSeq: string[] = [];

  if (style) {
    for (const key of style) {
      const codes = inspect.colors[key];
      if (codes) {
        openSeq.push(esc(codes[0]));
        closeSeq.unshift(esc(codes[1]));
      }
    }
  }

  return `${esc(0)}${openSeq.join("")}${center}${text}${closeSeq.join("")}${esc(
    0
  )}`;
};
