import { styleText } from "util";

type Options = Parameters<typeof styleText>[0];

export type StyleOptions = {
  textColor?: Bun.ColorInput;
  backgroundColor?: Bun.ColorInput;
  style?: Options;
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

/**
 * Applies ANSI styles to text for terminal output formatting.
 * 
 * Combines foreground/background colors and text modifiers using ANSI escape sequences.
 * Colors are generated using Bun.color, while modifiers use Node.js inspect.colors.
 * 
 * Returns unmodified text if ANSI colors are disabled via Bun.enableANSIColors.
 *
 * @param text - Text string to apply styling to
 * @param opts - Styling configuration object:
 *   - textColor: Text color (Bun.ColorInput)
 *   - backgroundColor: Background color (Bun.ColorInput) 
 *   - style: Text modifiers like 'bold', 'italic', etc.
 * 
 * @returns Styled text with ANSI sequences
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

  return styleText(style ?? [], `${center}${text}`) + "\x1b[0m";
};
