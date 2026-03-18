const { tokenize } = require('./src/lib/vybe/lexer');
const { Parser } = require('./src/lib/vybe/parser');
const { evaluate } = require('./src/lib/vybe/interpreter');
const { createGlobalEnv } = require('./src/lib/vybe/environment');

const code = `
vibe fib(n) {
  sus n <= 1 -> return n
  return fib(n-1) + fib(n-2)
}

say "Fibonacci 10: {fib(10)}"

// Stress tests
grind 100 {
  x = it * it
}

s = stash []
for i = 1 to 50 {
  push i to s
}
say "List size: {size(s)}"

try {
  say "Trying recursion limit..."
  // fib(20) is safe, fib(40) might be slow
  say "Fib 15: {fib(15)}"
} catch e {
  say "Caught: {e}"
}
`;

async function main() {
  try {
    const env = createGlobalEnv({}, (msg) => console.log("OUT:", msg));
    const tokens = tokenize(code);
    const parser = new Parser();
    const ast = parser.produceAST(tokens);
    await evaluate(ast, env);
    console.log("Stress Test Finished!");
  } catch (e) {
    console.error("Stress Test Error:", e);
  }
}

main();
