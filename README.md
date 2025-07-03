# bun-colors

A simple utility to apply ANSI text styling and colors in terminal output using Bun.

> [!IMPORTANT]  
> **Bun runtime only** — this utility depends on Bun's color API and does not support other JavaScript runtimes like Node.js or Deno.

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

## Requirements

- Bun environment.

