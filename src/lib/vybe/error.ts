

export type ErrorCategory =
    | "Runtime Error"
    | "Syntax Error"
    | "Type Error"
    | "Reference Error"
    | "Import Error";

const VYBE_MESSAGES = [
    "Lowkey this line is acting sus.",
    "This operation ain't bussin.",
    "Something here is straight cap.",
    "That variable ghosted the runtime.",
    "The parser is not vibing with this syntax.",
    "Deadass something broke here."
];

export class VybeError extends Error {
    constructor(
        public category: ErrorCategory,
        message: string,
        public line: number,
        public column: number,
        public tip?: string,
        public filePath?: string
    ) {
        super(message);
        this.name = "VybeError";
    }
}

export function printVybeError(err: VybeError, sourceCode: string, filePath: string) {
    const lines = sourceCode.split(/\r?\n/);
    let errorLine = lines[err.line - 1];
    let isEOF = false;
    let displayLineNum = err.line;
    if (errorLine === undefined || errorLine.trim() === "") {
        // Find nearest non-empty line upwards for context
        let contextLineIdx = err.line - 1;
        while (contextLineIdx >= 0 && (!lines[contextLineIdx] || lines[contextLineIdx].trim() === "")) {
            contextLineIdx--;
        }

        if (contextLineIdx >= 0) {
            errorLine = lines[contextLineIdx];
            displayLineNum = contextLineIdx + 1;
            // If the error is beyond the EOF, mark it
            if (err.line > lines.length) isEOF = true;
        } else {
            errorLine = lines[err.line - 1] || "";
        }
    }

    // Safety check for weird column values
    const col = Math.max(1, err.column);
    const pointerPad = " ".repeat(col > 0 ? col - 1 : 0);

    const randomVybeMsg = VYBE_MESSAGES[Math.floor(Math.random() * VYBE_MESSAGES.length)];

    const displayFile = filePath.replace(process.cwd(), "").replace(/^[\\\/]/, "");

    let output = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    output += `❌ Vybe ${err.category}\n\n`;
    output += `File: \x1b[36m${displayFile}\x1b[0m\n`;
    output += `Line: \x1b[33m${err.line}\x1b[0m${isEOF ? " \x1b[90m(End of File)\x1b[0m" : ""}\n`;
    output += `Column: \x1b[33m${col}\x1b[0m\n\n`;

    output += `\x1b[90m${displayLineNum} | \x1b[0m${errorLine}\n`;
    output += `\x1b[90m${" ".repeat(String(displayLineNum).length)} | \x1b[0m${pointerPad}\x1b[31m^\x1b[0m\n\n`;

    output += `\x1b[31m${err.message}\x1b[0m\n`;

    if (err.tip) {
        output += `\n💡 Tip:\n${err.tip}\n`;
    }

    output += `\n🔥 Vybe says:\n${randomVybeMsg}\n`;
    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    console.error(output);
}
