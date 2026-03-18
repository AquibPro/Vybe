const { tokenize } = require('./src/lib/vybe/lexer');
const { Parser } = require('./src/lib/vybe/parser');
const { evaluate } = require('./src/lib/vybe/interpreter');
const { createGlobalEnv } = require('./src/lib/vybe/environment');

const code = `
gng Defender {
  init(name) {
    this.name = name
    this.power = 100
  }

  vibe activate() {
    say "System Online: {this.name}"
    say "Power Level: {this.power}"
  }
}

squad = [Defender("V-1"), Defender("X-9")]

each bot in squad {
  bot.activate()
}
`;

async function main() {
  try {
    const env = createGlobalEnv({}, (msg) => console.log("OUT:", msg));
    const tokens = tokenize(code);
    tokens.forEach((t, i) => console.log(`[${i}] ${require('./src/lib/vybe/lexer').TokenType[t.type]} '${t.value}' L${t.line} C${t.column}`));
    const parser = new Parser();
    const ast = parser.produceAST(tokens);
    await evaluate(ast, env);
    console.log("Success!");
  } catch (e) {
    console.error("Full Error:", e);
    if (e.category) console.error("Category:", e.category);
    if (e.line) console.error("Line:", e.line);
    if (e.column) console.error("Column:", e.column);
  }
}

main();
