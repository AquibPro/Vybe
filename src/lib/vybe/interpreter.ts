import { RuntimeVal, NumberVal, StringVal, BooleanVal, MK_NULL, MK_NUMBER, MK_STRING, MK_BOOL, MK_LIST, ListVal, NativeFnVal, FunctionVal, ObjectVal, MK_OBJECT, MK_NATIVE_FN, getPrintable } from "./values";
import { VybeError } from "./error";
import { Environment, createGlobalEnv } from "./environment";
import { Stmt, Program, VarDeclaration, ExpressionStatement, AssignmentExpr, BinaryExpr, CallExpr, Identifier, NumericLiteral, StringLiteral, BooleanLiteral, NullLiteral, ArrayLiteral, BlockStatement, IfStatement, WhileStatement, LoopStatement, ReturnStatement, FunctionDeclaration, SayStatement, FlexStatement, PushStatement, PopStatement, AskExpr, StashExpr, SizeExpr, TypeExpr, BreakStatement, ContinueStatement, TryCatchStatement, ObjectLiteral, MemberExpr, NamespaceDeclaration, ImportStatement, ForEachStatement, ForStatement, MatchStatement, MatchCase, SquadDeclaration, AwaitExpr, OnceStatement, ConditionalExpr, UnaryExpr, NaturalCommandStmt, JsBlock, FetchExpr } from "./ast";
import { tokenize } from "./lexer";
import { Parser } from "./parser";

// Custom exception for control flow
class BreakException { }
class ContinueException { }
class ReturnException { constructor(public value: RuntimeVal) { } }

const onceExecuted = new Set<string>();

export async function evaluate(astNode: Stmt, env: Environment): Promise<RuntimeVal> {
    try {
        switch (astNode.kind) {
            case "NumericLiteral":
                return MK_NUMBER((astNode as NumericLiteral).value);
            case "StringLiteral":
                return MK_STRING((astNode as StringLiteral).value);
            case "BooleanLiteral":
                return MK_BOOL((astNode as BooleanLiteral).value);
            case "NullLiteral":
                return MK_NULL();
            case "Identifier":
                return await evalIdentifier(astNode as Identifier, env);
            case "AssignmentExpr":
                return await evalAssignment(astNode as AssignmentExpr, env);
            case "UnaryExpr":
                return await evalUnaryExpr(astNode as UnaryExpr, env);
            case "BinaryExpr":
                return await evalBinaryExpr(astNode as BinaryExpr, env);
            case "CallExpr":
                return await evalCallExpr(astNode as CallExpr, env);
            case "ArrayLiteral":
                return await evalArrayExpr(astNode as ArrayLiteral, env);
            case "ObjectLiteral":
                return await evalObjectExpr(astNode as ObjectLiteral, env);
            case "MemberExpr":
                return await evalMemberExpr(astNode as MemberExpr, env);
            case "ConditionalExpr":
                return await evalConditionalExpr(astNode as ConditionalExpr, env);

            // Expressions representing built-ins
            case "AskExpr":
                return await evalAskExpr(astNode as AskExpr, env);
            case "StashExpr":
                return await evalStashExpr(astNode as StashExpr, env);
            case "SizeExpr":
                return await evalSizeExpr(astNode as SizeExpr, env);
            case "TypeExpr":
                return await evalTypeExpr(astNode as TypeExpr, env);
            case "AwaitExpr":
                return await evalAwaitExpr(astNode as AwaitExpr, env);
            case "PopExpr":
                return await evalPopExpr(astNode as any, env);
            case "PanicExpr":
                return await evalPanicExpr(astNode as any, env);
            case "FetchExpr":
                return await evalFetchExpr(astNode as FetchExpr, env);

            // Statements
            case "Program":
                return await evalProgram(astNode as Program, env);
            case "ExpressionStatement":
                return await evaluate((astNode as ExpressionStatement).expression, env);
            case "VarDeclaration":
                return await evalVarDeclaration(astNode as VarDeclaration, env);
            case "FunctionDeclaration":
                return await evalFunctionDeclaration(astNode as FunctionDeclaration, env);
            case "BlockStatement":
                return await evalBlockStatement(astNode as BlockStatement, env);
            case "IfStatement":
                return await evalIfStatement(astNode as IfStatement, env);
            case "WhileStatement":
                return await evalWhileStatement(astNode as WhileStatement, env);
            case "LoopStatement":
                return await evalLoopStatement(astNode as LoopStatement, env);
            case "ForEachStatement":
                return await evalForEachStatement(astNode as ForEachStatement, env);
            case "ForStatement":
                return await evalForStatement(astNode as ForStatement, env);
            case "MatchStatement":
                return await evalMatchStatement(astNode as MatchStatement, env);
            case "TryCatchStatement":
                return await evalTryCatchStatement(astNode as TryCatchStatement, env);
            case "SquadDeclaration":
                return await evalSquadDeclaration(astNode as SquadDeclaration, env);
            case "NamespaceDeclaration":
                return await evalNamespaceDeclaration(astNode as NamespaceDeclaration, env);
            case "ImportStatement":
                return await evalImportStatement(astNode as ImportStatement, env);
            case "ReturnStatement":
                const returnStmt = astNode as ReturnStatement;
                const value = returnStmt.argument ? await evaluate(returnStmt.argument, env) : MK_NULL();
                throw new ReturnException(value);
            case "BreakStatement":
                throw new BreakException();
            case "ContinueStatement":
                throw new ContinueException();

            // Built-in statements
            case "SayStatement":
                return await evalSayStatement(astNode as SayStatement, env);
            case "NaturalCommandStmt":
                return await evalNaturalCommandStmt(astNode as NaturalCommandStmt, env);
            case "JsBlock":
                return await evalJsBlock(astNode as JsBlock, env);
            case "FlexStatement":
                return await evalFlexStatement(astNode as FlexStatement, env);
            case "PushStatement":
                return await evalPushStatement(astNode as PushStatement, env);
            case "OnceStatement":
                return await evalOnceStatement(astNode as OnceStatement, env);
            case "PopStatement":
                return await evalPopStatement(astNode as PopStatement, env);

            default:
                throw new VybeError("Runtime Error", `Unsupported AST node: ${astNode.kind}`, (astNode as any).line || 1, (astNode as any).column || 1);
        }
    } catch (e) {
        if (e instanceof VybeError || e instanceof BreakException || e instanceof ContinueException || e instanceof ReturnException) {
            throw e;
        }
        const errMsg = e instanceof Error ? e.message : String(e);
        const category = errMsg.includes("cooked yet") || errMsg.includes("already cooked") ? "Reference Error" : "Runtime Error";
        throw new VybeError(category, errMsg, (astNode as any).line || 1, (astNode as any).column || 1);
    }
}

// --- EXPRESSIONS ---

async function evalIdentifier(ident: Identifier, env: Environment): Promise<RuntimeVal> {
    return env.lookupVar(ident.symbol);
}

async function evalAssignment(node: AssignmentExpr, env: Environment): Promise<RuntimeVal> {
    let rhsValue = await evaluate(node.value, env);

    if (node.operator && node.operator !== "=") {
        const currentValue = await evaluate(node.assignee, env);
        if (currentValue.type !== "number" || rhsValue.type !== "number") {
            throw new VybeError("Type Error", `Compound assignment ${node.operator} requires numbers`, node.line || 1, node.column || 1);
        }
        const currentNum = (currentValue as NumberVal).value;
        const rhsNum = (rhsValue as NumberVal).value;
        let newNum = currentNum;

        switch (node.operator) {
            case "+=": newNum = currentNum + rhsNum; break;
            case "-=": newNum = currentNum - rhsNum; break;
            case "*=": newNum = currentNum * rhsNum; break;
            case "/=": newNum = currentNum / rhsNum; break;
            case "%=": newNum = currentNum % rhsNum; break;
            default: break;
        }
        rhsValue = MK_NUMBER(newNum);
    }

    if (node.assignee.kind === "Identifier") {
        const varname = (node.assignee as Identifier).symbol;
        return env.assignVar(varname, rhsValue);
    }

    if (node.assignee.kind === "MemberExpr") {
        const memberExpr = node.assignee as MemberExpr;
        const object = await evaluate(memberExpr.object, env);

        if (object.type === "list") {
            const indexVal = await evaluate(memberExpr.property, env);
            if (indexVal.type !== "number") throw new VybeError("Type Error", "List index must be a number", node.line || 1, node.column || 1);
            const index = (indexVal as NumberVal).value;
            (object as ListVal).elements[index] = rhsValue;
            return rhsValue;
        }

        if (object.type !== "object") throw new VybeError("Type Error", `Cannot assign property on non-object ${object.type}`, node.line || 1, node.column || 1);

        let propertyKey: string;
        if (memberExpr.computed) {
            const computedVal = await evaluate(memberExpr.property, env);
            if (computedVal.type !== "string") throw new VybeError("Type Error", "Computed property must be string", node.line || 1, node.column || 1);
            propertyKey = (computedVal as StringVal).value;
        } else {
            propertyKey = (memberExpr.property as Identifier).symbol;
        }

        (object as ObjectVal).properties.set(propertyKey, rhsValue);
        return rhsValue;
    }

    throw new VybeError("Syntax Error", "Invalid assignment target", node.line || 1, node.column || 1);
}

async function evalUnaryExpr(expr: UnaryExpr, env: Environment): Promise<RuntimeVal> {
    if (expr.operator === "not") {
        const val = await evaluate(expr.argument, env);
        const boolVal = val.type === "boolean" ? (val as BooleanVal).value : !!(val as NumberVal).value;
        return MK_BOOL(!boolVal);
    }

    if (expr.operator === "++" || expr.operator === "--") {
        const isIncrement = expr.operator === "++";
        const val = await evaluate(expr.argument, env);
        if (val.type !== "number") {
            throw new VybeError("Type Error", `Unary ${expr.operator} requires a number, got ${val.type}`, expr.line || 1, expr.column || 1);
        }

        const currentNum = (val as NumberVal).value;
        const newNum = isIncrement ? currentNum + 1 : currentNum - 1;
        const newVal = MK_NUMBER(newNum);

        if (expr.argument.kind === "Identifier") {
            const varname = (expr.argument as Identifier).symbol;
            env.assignVar(varname, newVal);
        } else if (expr.argument.kind === "MemberExpr") {
            await evalAssignment({
                kind: "AssignmentExpr",
                assignee: expr.argument,
                operator: "=",
                value: { kind: "NumericLiteral", value: newNum } as NumericLiteral
            } as AssignmentExpr, env);
        } else {
            throw new VybeError("Syntax Error", `Invalid target for ${expr.operator}`, expr.line || 1, expr.column || 1);
        }

        return expr.prefix ? newVal : val;
    }

    throw new VybeError("Syntax Error", `Unsupported unary operator ${expr.operator}`, expr.line || 1, expr.column || 1);
}

async function evalConditionalExpr(expr: ConditionalExpr, env: Environment): Promise<RuntimeVal> {
    const condition = await evaluate(expr.condition, env);
    if ((condition as BooleanVal).value) {
        return await evaluate(expr.trueExpr, env);
    }
    return await evaluate(expr.falseExpr, env);
}

async function evalOnceStatement(stmt: OnceStatement, env: Environment): Promise<RuntimeVal> {
    if (!onceExecuted.has(stmt.id)) {
        onceExecuted.add(stmt.id);
        return evaluate(stmt.body, env);
    }
    return MK_NULL();
}

async function evalBinaryExpr(binop: BinaryExpr, env: Environment): Promise<RuntimeVal> {
    const lhs = await evaluate(binop.left, env);
    const rhs = await evaluate(binop.right, env);

    if (lhs.type === "number" && rhs.type === "number") {
        return evalNumericBinaryExpr(lhs as NumberVal, rhs as NumberVal, binop.operator);
    }

    // String concatenation
    if (binop.operator === "+") {
        if (lhs.type === "string" || rhs.type === "string") {
            const lstr = lhs.type === "string" ? (lhs as StringVal).value : (lhs as NumberVal).value?.toString();
            const rstr = rhs.type === "string" ? (rhs as StringVal).value : (rhs as NumberVal).value?.toString();
            return MK_STRING(lstr + rstr);
        }
    }

    // Logical operators
    if (binop.operator === "and" || binop.operator === "or") {
        const lval = lhs.type === "boolean" ? (lhs as BooleanVal).value : !!(lhs as NumberVal).value;
        const rval = rhs.type === "boolean" ? (rhs as BooleanVal).value : !!(rhs as NumberVal).value;

        if (binop.operator === "and") return MK_BOOL(lval && rval);
        if (binop.operator === "or") return MK_BOOL(lval || rval);
    }

    // Comparisons
    if (binop.operator === "==") {
        if (lhs.type === "number" && rhs.type === "number") return MK_BOOL((lhs as NumberVal).value === (rhs as NumberVal).value);
        if (lhs.type === "string" && rhs.type === "string") return MK_BOOL((lhs as StringVal).value === (rhs as StringVal).value);
        if (lhs.type === "boolean" && rhs.type === "boolean") return MK_BOOL((lhs as BooleanVal).value === (rhs as BooleanVal).value);
        return MK_BOOL(false);
    }
    if (binop.operator === "!=") {
        if (lhs.type === "number" && rhs.type === "number") return MK_BOOL((lhs as NumberVal).value !== (rhs as NumberVal).value);
        if (lhs.type === "string" && rhs.type === "string") return MK_BOOL((lhs as StringVal).value !== (rhs as StringVal).value);
        if (lhs.type === "boolean" && rhs.type === "boolean") return MK_BOOL((lhs as BooleanVal).value !== (rhs as BooleanVal).value);
        return MK_BOOL(true);
    }

    throw `Unsupported operator ${binop.operator} for types ${lhs.type} and ${rhs.type}`;
}

function evalNumericBinaryExpr(lhs: NumberVal, rhs: NumberVal, operator: string): RuntimeVal {
    let result: number;
    if (operator == "+") result = lhs.value + rhs.value;
    else if (operator == "-") result = lhs.value - rhs.value;
    else if (operator == "*") result = lhs.value * rhs.value;
    else if (operator == "/") {
        if (rhs.value === 0) throw "Division by zero is sus!";
        result = lhs.value / rhs.value;
    }
    else if (operator == "%") result = lhs.value % rhs.value;
    else if (operator == "<") return MK_BOOL(lhs.value < rhs.value);
    else if (operator == ">") return MK_BOOL(lhs.value > rhs.value);
    else if (operator == "<=") return MK_BOOL(lhs.value <= rhs.value);
    else if (operator == ">=") return MK_BOOL(lhs.value >= rhs.value);
    else if (operator == "==") return MK_BOOL(lhs.value === rhs.value);
    else if (operator == "!=") return MK_BOOL(lhs.value !== rhs.value);
    else throw `Invalid numeric operator ${operator}`;

    return MK_NUMBER(result);
}

async function evalCallExpr(call: CallExpr, env: Environment): Promise<RuntimeVal> {
    const args = await Promise.all(call.args.map(arg => evaluate(arg, env)));
    const fn = await evaluate(call.caller, env);
    if (fn.type === "native-fn") {
        return await (fn as NativeFnVal).call(args, env);
    }

    if (fn.type === "function") {
        const func = fn as FunctionVal;
        const scope = new Environment(func.declarationEnv);

        // Bind parameters
        for (let i = 0; i < func.parameters.length; i++) {
            const varname = func.parameters[i];
            scope.declareVar(varname, args[i] || MK_NULL());
        }

        try {
            await evalBlockStatement(func.body, scope);
        } catch (e) {
            if (e instanceof ReturnException) {
                return e.value;
            }
            throw e; // Bubble up breaks/continues
        }

        return MK_NULL();
    }

    throw `Cannot call value that is not a function: ${JSON.stringify(fn)}`;
}

async function evalArrayExpr(arr: ArrayLiteral, env: Environment): Promise<RuntimeVal> {
    const elements = await Promise.all(arr.elements.map(el => evaluate(el, env)));
    return MK_LIST(elements);
}

async function evalObjectExpr(obj: ObjectLiteral, env: Environment): Promise<RuntimeVal> {
    const props = new Map<string, RuntimeVal>();
    for (const prop of obj.properties) {
        if (prop.value === undefined) {
            const val = env.lookupVar(prop.key);
            props.set(prop.key, val);
        } else {
            props.set(prop.key, await evaluate(prop.value, env));
        }
    }
    return MK_OBJECT(props);
}

async function evalMemberExpr(expr: MemberExpr, env: Environment): Promise<RuntimeVal> {
    const object = await evaluate(expr.object, env);

    // List access
    if (object.type === "list") {
        const list = object as ListVal;

        // Native methods
        if (!expr.computed && expr.property.kind === "Identifier") {
            const method = (expr.property as Identifier).symbol;
            if (method === "push") {
                return MK_NATIVE_FN((args) => {
                    list.elements.push(args[0]);
                    return args[0];
                });
            }
            if (method === "pop") {
                return MK_NATIVE_FN(() => {
                    return list.elements.pop() || MK_NULL();
                });
            }
            if (method === "len" || method === "size") {
                return MK_NATIVE_FN(() => MK_NUMBER(list.elements.length));
            }
        }

        // Numeric indexing
        const indexVal = await evaluate(expr.property, env);
        if (indexVal.type !== "number") throw new VybeError("Type Error", "List index must be a number", expr.line || 1, expr.column || 1);
        const index = (indexVal as NumberVal).value;
        return list.elements[index] || MK_NULL();
    }

    if (object.type !== "object") {
        throw new VybeError("Type Error", `Cannot access properties on non-object ${object.type}`, expr.line || 1, expr.column || 1);
    }

    let propertyKey: string;
    if (expr.computed) {
        const computedVal = await evaluate(expr.property, env);
        if (computedVal.type !== "string") throw new VybeError("Type Error", `Computed property must be string, got ${computedVal.type}`, expr.line || 1, expr.column || 1);
        propertyKey = (computedVal as StringVal).value;
    } else {
        propertyKey = (expr.property as Identifier).symbol;
    }

    const value = (object as ObjectVal).properties.get(propertyKey);
    if (value === undefined) {
        throw new VybeError("Reference Error", `Property '${propertyKey}' does not exist on object`, expr.line || 1, expr.column || 1);
    }
    return value;
}

// --- STATEMENTS ---

async function evalProgram(program: Program, env: Environment): Promise<RuntimeVal> {
    let lastEvaluated: RuntimeVal = MK_NULL();
    for (const statement of program.body) {
        lastEvaluated = await evaluate(statement, env);
    }
    return lastEvaluated;
}

async function evalVarDeclaration(declaration: VarDeclaration, env: Environment): Promise<RuntimeVal> {
    const value = await evaluate(declaration.value, env);
    return env.declareVar(declaration.identifier, value);
}

async function evalFunctionDeclaration(declaration: FunctionDeclaration, env: Environment): Promise<RuntimeVal> {
    const func: FunctionVal = {
        type: "function",
        name: declaration.name,
        parameters: declaration.parameters,
        declarationEnv: env,
        body: declaration.body
    };
    env.declareVar(declaration.name, func);
    return func;
}

async function evalBlockStatement(block: BlockStatement, env: Environment): Promise<RuntimeVal> {
    const scope = new Environment(env);
    let lastEvaluated: RuntimeVal = MK_NULL();
    for (const statement of block.body) {
        lastEvaluated = await evaluate(statement, scope);
    }
    return lastEvaluated;
}

async function evalIfStatement(stmt: IfStatement, env: Environment): Promise<RuntimeVal> {
    const condition = await evaluate(stmt.condition, env);
    if (condition.type !== "boolean") throw new VybeError("Type Error", `Sus condition must be boolean, got ${condition.type}`, stmt.line || 1, stmt.column || 1);

    if ((condition as BooleanVal).value) {
        return await evalBlockStatement(stmt.thenBranch, env);
    } else {
        for (const branch of stmt.elseIfBranches) {
            const branchCond = await evaluate(branch.condition, env);
            if (branchCond.type !== "boolean") throw new VybeError("Type Error", `Maybe condition must be boolean, got ${branchCond.type}`, branch.condition.line || 1, branch.condition.column || 1);
            if ((branchCond as BooleanVal).value) {
                return await evalBlockStatement(branch.consequent, env);
            }
        }
        if (stmt.elseBranch) {
            return await evalBlockStatement(stmt.elseBranch, env);
        }
    }
    return MK_NULL();
}

async function evalWhileStatement(whileStmt: WhileStatement, env: Environment): Promise<RuntimeVal> {
    let lastEvaluated: RuntimeVal = MK_NULL();

    while (true) {
        const condition = await evaluate(whileStmt.condition, env);
        if (condition.type !== "boolean" || (condition as BooleanVal).value === false) {
            break;
        }

        try {
            lastEvaluated = await evalBlockStatement(whileStmt.body, env);
        } catch (e) {
            if (e instanceof BreakException) break;
            if (e instanceof ContinueException) continue;
            throw e;
        }
    }

    return lastEvaluated;
}

async function evalLoopStatement(loopStmt: LoopStatement, env: Environment): Promise<RuntimeVal> {
    let lastEvaluated: RuntimeVal = MK_NULL();
    const countVal = await evaluate(loopStmt.count, env);

    if (countVal.type !== "number") throw new VybeError("Type Error", `Grind loop expected a number, got ${countVal.type}`, loopStmt.line || 1, loopStmt.column || 1);
    let count = (countVal as NumberVal).value;

    for (let i = 0; i < count; i++) {
        try {
            lastEvaluated = await evalBlockStatement(loopStmt.body, env);
        } catch (e) {
            if (e instanceof BreakException) break;
            if (e instanceof ContinueException) continue;
            throw e;
        }
    }

    return lastEvaluated;
}

async function evalForEachStatement(stmt: ForEachStatement, env: Environment): Promise<RuntimeVal> {
    const listVal = await evaluate(stmt.list, env);
    if (listVal.type !== "list") {
        throw new VybeError("Type Error", `Each loop requires a list, got ${listVal.type}`, stmt.line || 1, stmt.column || 1);
    }

    let lastEvaluated: RuntimeVal = MK_NULL();

    for (const element of (listVal as ListVal).elements) {
        const loopEnv = new Environment(env);
        loopEnv.declareVar(stmt.item, element);

        try {
            lastEvaluated = await evalBlockStatement(stmt.body, loopEnv);
        } catch (e) {
            if (e instanceof BreakException) break;
            if (e instanceof ContinueException) continue;
            throw e;
        }
    }

    return lastEvaluated;
}

async function evalTryCatchStatement(stmt: TryCatchStatement, env: Environment): Promise<RuntimeVal> {
    const tryEnv = new Environment(env);
    try {
        return await evalBlockStatement(stmt.tryBlock, tryEnv);
    } catch (e) {
        if (e instanceof BreakException || e instanceof ContinueException || e instanceof ReturnException) {
            throw e;
        }

        // Caught an exception (e.g. panic or throw error)
        const catchEnv = new Environment(env);

        // Inject the error as a bound string
        const errMsg = e instanceof Error ? e.message : String(e);
        catchEnv.declareVar(stmt.catchIdentifier, MK_STRING(errMsg));

        return await evalBlockStatement(stmt.catchBlock, catchEnv);
    }
}

async function evalAwaitExpr(expr: AwaitExpr, env: Environment): Promise<RuntimeVal> {
    return await evaluate(expr.argument, env);
}

async function evalForStatement(stmt: ForStatement, env: Environment): Promise<RuntimeVal> {
    const startVal = await evaluate(stmt.start, env);
    const endVal = await evaluate(stmt.end, env);
    if (startVal.type !== "number" || endVal.type !== "number") throw new VybeError("Type Error", `For loop bounds must be numbers`, stmt.line || 1, stmt.column || 1);

    let lastEvaluated: RuntimeVal = MK_NULL();

    for (let i = (startVal as NumberVal).value; i <= (endVal as NumberVal).value; i++) {
        const loopEnv = new Environment(env);
        loopEnv.declareVar(stmt.init, MK_NUMBER(i));
        try {
            lastEvaluated = await evalBlockStatement(stmt.body, loopEnv);
        } catch (e) {
            if (e instanceof BreakException) break;
            if (e instanceof ContinueException) continue;
            throw e;
        }
    }
    return lastEvaluated;
}

async function evalMatchStatement(stmt: MatchStatement, env: Environment): Promise<RuntimeVal> {
    const matchVal = await evaluate(stmt.argument, env);

    for (const matchCase of stmt.cases) {
        if (matchCase.isDefault) {
            return await evalBlockStatement(matchCase.body, new Environment(env));
        }
        const caseVal = await evaluate(matchCase.condition, env);

        let isMatch = false;
        if (matchVal.type === "number" && caseVal.type === "number") isMatch = (matchVal as NumberVal).value === (caseVal as NumberVal).value;
        else if (matchVal.type === "string" && caseVal.type === "string") isMatch = (matchVal as StringVal).value === (caseVal as StringVal).value;
        else if (matchVal.type === "boolean" && caseVal.type === "boolean") isMatch = (matchVal as BooleanVal).value === (caseVal as BooleanVal).value;

        if (isMatch) {
            return await evalBlockStatement(matchCase.body, new Environment(env));
        }
    }
    return MK_NULL();
}

async function evalSquadDeclaration(stmt: SquadDeclaration, env: Environment): Promise<RuntimeVal> {
    const constructorFn = MK_NATIVE_FN(async (args: RuntimeVal[], callEnv: Environment) => {
        const instance = { type: "object", properties: new Map() } as ObjectVal;

        stmt.methods.forEach(method => {
            const methodEnv = new Environment(env);
            methodEnv.declareVar("this", instance);

            const fnVal = {
                type: "function",
                name: method.name,
                parameters: method.parameters,
                declarationEnv: methodEnv,
                body: method.body
            } as FunctionVal;

            instance.properties.set(method.name, fnVal);
        });

        const initMethod = instance.properties.get("init");
        if (initMethod && initMethod.type === "function") {
            const initEnv = new Environment((initMethod as FunctionVal).declarationEnv);
            // Bind arguments
            for (let i = 0; i < (initMethod as FunctionVal).parameters.length; i++) {
                initEnv.declareVar((initMethod as FunctionVal).parameters[i], args[i] || MK_NULL());
            }
            await evalBlockStatement((initMethod as FunctionVal).body, initEnv);
        }

        return instance;
    });

    env.declareVar(stmt.name, constructorFn);
    return MK_NULL();
}

async function evalNamespaceDeclaration(stmt: NamespaceDeclaration, env: Environment): Promise<RuntimeVal> {
    const namespaceEnv = new Environment(env);
    for (const bodyStmt of stmt.body) {
        await evaluate(bodyStmt, namespaceEnv);
    }
    const props = new Map<string, RuntimeVal>();
    namespaceEnv.getVariables().forEach((val, key) => props.set(key, val));
    const obj = MK_OBJECT(props);
    env.declareVar(stmt.name, obj);
    return MK_NULL();
}

async function evalImportStatement(stmt: ImportStatement, env: Environment): Promise<RuntimeVal> {
    throw new VybeError("Runtime Error", "Imports are disabled in the browser environment.", stmt.line || 1, stmt.column || 1);
}

// --- BUILT-INS (Gen Z Syntax specific) ---


async function evalSayStatement(stmt: SayStatement, env: Environment): Promise<RuntimeVal> {
    const value = await evaluate(stmt.argument, env);
    const msg = getPrintable(value);
    if (env.onOutput) env.onOutput(msg);
    else console.log(msg);
    return MK_NULL();
}

async function evalFetchExpr(expr: FetchExpr, env: Environment): Promise<RuntimeVal> {
    const urlVal = await evaluate(expr.url, env);
    if (urlVal.type !== "string") throw new VybeError("Type Error", "fetch requires a string URL", expr.line || 1, expr.column || 1);
    const url = (urlVal as StringVal).value;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const convertToRuntime = (val: any): RuntimeVal => {
            if (val === null) return MK_NULL();
            if (typeof val === "number") return MK_NUMBER(val);
            if (typeof val === "string") return MK_STRING(val);
            if (typeof val === "boolean") return MK_BOOL(val);
            if (Array.isArray(val)) return MK_LIST(val.map(convertToRuntime));
            if (typeof val === "object") {
                const props = new Map<string, RuntimeVal>();
                for (const k in val) props.set(k, convertToRuntime(val[k]));
                return MK_OBJECT(props);
            }
            return MK_NULL();
        };

        return convertToRuntime(data);
    } catch (e) {
        throw new VybeError("Runtime Error", `Fetch failed: ${e}`, expr.line || 1, expr.column || 1);
    }
}

async function evalJsBlock(stmt: JsBlock, env: Environment): Promise<RuntimeVal> {
    try {
        // Simple eval-based interop for the playground
        // We expose the environment to the JS block if possible, or just run it
        const result = eval(stmt.code);
        if (result === undefined) return MK_NULL();
        if (typeof result === "number") return MK_NUMBER(result);
        if (typeof result === "string") return MK_STRING(result);
        if (typeof result === "boolean") return MK_BOOL(result);
        return MK_NULL();
    } catch (e) {
        throw new VybeError("Runtime Error", `JS Interop Error: ${e}`, stmt.line || 1, stmt.column || 1);
    }
}

async function evalNaturalCommandStmt(stmt: NaturalCommandStmt, env: Environment): Promise<RuntimeVal> {
    const verb = stmt.verb.toLowerCase();
    const arg = await evaluate(stmt.argument, env);

    switch (verb) {
        case "wait": {
            if (arg.type !== "number") throw new VybeError("Type Error", "wait requires a number", stmt.line || 1, stmt.column || 1);
            await new Promise(resolve => setTimeout(resolve, (arg as NumberVal).value * 1000));
            break;
        }
        case "fetch": {
            if (arg.type !== "string") throw new VybeError("Type Error", "fetch requires a string URL", stmt.line || 1, stmt.column || 1);
            const data = await evalFetchExpr({ kind: "FetchExpr", url: stmt.argument, line: stmt.line, column: stmt.column } as FetchExpr, env);
            if (stmt.destination && stmt.destination.kind === "Identifier") {
                env.assignVar((stmt.destination as Identifier).symbol, data);
            }
            break;
        }
        case "read":
        case "write":
        case "delete":
        case "move":
        case "run":
            // Stubbed or basic browser behavior
            const msg = `[SYSTEM]: Command '${verb}' is restricted in the playground for safety.`;
            if (env.onOutput) env.onOutput(msg);
            break;
        default:
            throw new VybeError("Runtime Error", `Unknown natural command: ${verb}`, stmt.line || 1, stmt.column || 1);
    }

    return MK_NULL();
}

async function evalFlexStatement(stmt: FlexStatement, env: Environment): Promise<RuntimeVal> {
    const value = await evaluate(stmt.argument, env);
    const msg = "[FLEX DEV LOG]: " + getPrintable(value);
    if (env.onOutput) env.onOutput(msg);
    else console.log(msg);
    return MK_NULL();
}

async function evalPushStatement(stmt: PushStatement, env: Environment): Promise<RuntimeVal> {
    const list = await evaluate(stmt.list, env);
    if (list.type !== "list") throw new VybeError("Type Error", `Cannot push. Expected list, got ${list.type}`, stmt.line || 1, stmt.column || 1);
    const value = await evaluate(stmt.value, env);
    (list as ListVal).elements.push(value);
    return MK_NULL();
}

async function evalPopExpr(expr: any, env: Environment): Promise<RuntimeVal> {
    const list = await evaluate(expr.list, env);
    if (list.type !== "list") throw new VybeError("Type Error", `Cannot pop. Expected list, got ${list.type}`, expr.line || 1, expr.column || 1);
    const popped = (list as ListVal).elements.pop();
    return popped || MK_NULL();
}

async function evalPopStatement(stmt: PopStatement, env: Environment): Promise<RuntimeVal> {
    return evalPopExpr(stmt, env);
}

async function evalPanicExpr(expr: any, env: Environment): Promise<RuntimeVal> {
    const msg = await evaluate(expr.argument, env);
    throw new Error((msg.type === "string" ? (msg as StringVal).value : String(msg)));
}

async function evalAskExpr(expr: AskExpr, env: Environment): Promise<RuntimeVal> {
    throw new VybeError("Runtime Error", "Interactive prompts ('ask') are currently disabled in the playground.", expr.line || 1, expr.column || 1);
}

async function evalStashExpr(expr: StashExpr, env: Environment): Promise<RuntimeVal> {
    const elements = await Promise.all(expr.elements.map(el => evaluate(el, env)));
    return MK_LIST(elements);
}

async function evalSizeExpr(expr: SizeExpr, env: Environment): Promise<RuntimeVal> {
    const arg = await evaluate(expr.argument, env);
    if (arg.type === "list") return MK_NUMBER((arg as ListVal).elements.length);
    if (arg.type === "string") return MK_NUMBER((arg as StringVal).value.length);
    throw new VybeError("Type Error", `Cannot get size of ${arg.type}`, expr.line || 1, expr.column || 1);
}

async function evalTypeExpr(expr: TypeExpr, env: Environment): Promise<RuntimeVal> {
    const arg = await evaluate(expr.argument, env);
    switch (arg.type) {
        case "number": return MK_STRING("number");
        case "string": return MK_STRING("string");
        case "boolean": return MK_STRING("boolean");
        case "list": return MK_STRING("list");
        case "object": return MK_STRING("object");
        case "null": return MK_STRING("ghost");
        case "native-fn":
        case "function": return MK_STRING("function");
        default: return MK_STRING("ghost");
    }
}
