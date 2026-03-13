export type ErrorCategory =
    | "Runtime Error"
    | "Syntax Error"
    | "Type Error"
    | "Reference Error"
    | "Import Error"
    | "JS Interop Error";

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
    const col = err.column || 1;
    const randomVybeMsg = VYBE_MESSAGES[Math.floor(Math.random() * VYBE_MESSAGES.length)];
    const displayFile = filePath;

    let errorLine = lines[err.line - 1] || "";
    let displayLineNum = err.line;
    let isEOF = false;

    if (err.line > lines.length) {
        isEOF = true;
        displayLineNum = lines.length;
        errorLine = lines[lines.length - 1] || "";
    }

    const pointerPad = " ".repeat(Math.max(0, col - 1));

    let output = `------------------------------------\n`;
    output += `❌ Vybe ${err.category}\n\n`;
    output += `File: ${displayFile}\n`;
    output += `Line: ${err.line}${isEOF ? " (End of File)" : ""}\n`;
    output += `Column: ${col}\n\n`;

    output += `${displayLineNum} | ${errorLine}\n`;
    output += `${" ".repeat(String(displayLineNum).length)} | ${pointerPad}^\n\n`;

    output += `${err.message}\n`;

    if (err.tip) {
        output += `\nTip: ${err.tip}\n`;
    }

    output += `\nVybe says: ${randomVybeMsg}\n`;
    output += `------------------------------------`;

    console.error(output);
}
