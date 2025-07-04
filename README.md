# bun-colors

A simple utility to apply ANSI text styling and colors in terminal output using Bun.

> [!IMPORTANT]  
> **Bun required at build time** — This utility depends on Bun’s color API and macro system to generate ANSI escape sequences.  
> However, once compiled (e.g. using `with { type: "macro" }`), the output is plain ANSI text and can be used in **any JavaScript runtime**, including **Node.js**, **Deno**, or **browsers** with terminal emulation. **See:** [Using Bun macro](#ussing-bun-macro)

## Features

- Supports foreground (`textColor`) and background (`backgroundColor`) colors.
- Applies common ANSI text modifiers like bold, underline, italic, blink, etc.
- Uses Bun’s color APIs to generate accurate ANSI sequences.
- Falls back gracefully when ANSI colors are disabled.

## Installation

```bash
bun add bun-colors
```

## Usage

```ts
import { style } from "bun-colors";

const styledText = style("Hello, world!", {
  textColor: "cyan",
  backgroundColor: [0, 0, 0],
  style: ["bold", "underline"],
});

console.log(styledText);
```

### Ussing Bun macro

You can use this function as a Bun **macro** to compute the styled result at build time:

```ts
import { style } from "bun-colors" with { type: "macro" };

const styledText = style("Hello, world!", {
  textColor: "#33FFFF",
  backgroundColor: [0, 0, 0],
  style: ["bold", "underline", "swapColors"],
});

console.log(styledText);
```

#### After compiling with Bun:

```ts
var styledText =
  "\x1B[0m\x1B[1m\x1B[4m\x1B[7m\x1B[48;2;0;0;0m\x1B[38;2;51;255;255mHello, world!\x1B[27m\x1B[24m\x1B[22m\x1B[0m";
console.log(styledText);
```

✅ **This output is just a plain string**, so you can use it in any JavaScript runtime, including **Node.js**, **Deno**, or even browsers (for emulated terminal rendering). This is ideal for publishing packages that include styled output without depending on Bun at runtime.

---

## API

### `style(text: string, opts: StyleOptions): string`

Applies ANSI styling and returns the styled text.

- `text`: The string to style.
- `opts`:

  - `textColor?: Bun.ColorInput` — Foreground color (e.g. `"red"`, `[255, 0, 0]`, `"#ff0000"`).
  - `backgroundColor?: Bun.ColorInput` — Background color.
  - `style?: Modifiers[]` — Array of text modifiers (`"bold"`, `"italic"`, `"underline"`, etc.).

### Supported Modifiers

- `faint`
- `strikethrough`
- `conceal`
- `swapColors`
- `doubleUnderline`
- `framed`
- `overlined`
- `bold`
- `dim`
- `italic`
- `underline`
- `blink`
- `inverse`
- `hidden`
