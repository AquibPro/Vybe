export type NodeType =
    | "Program"
    // Statements
    | "VarDeclaration"
    | "FunctionDeclaration"
    | "IfStatement"
    | "WhileStatement"
    | "LoopStatement" // grind loop
    | "ForEachStatement"
    | "BlockStatement"
    | "ForStatement"
    | "MatchStatement"
    | "TryCatchStatement"
    | "BreakStatement"
    | "ContinueStatement"
    | "ReturnStatement"
    // Built-in Statements
    | "SayStatement"
    | "FlexStatement"
    | "PushStatement"
    | "PopStatement"
    | "NamespaceDeclaration"
    | "ImportStatement"
    | "SquadDeclaration"
    | "OnceStatement"
    | "NaturalCommandStmt"
    | "ServeStatement"
    | "JsBlock"
    // Expressions
    | "ExpressionStatement"
    | "RangeExpr"
    | "AssignmentExpr"
    | "UnaryExpr"
    | "BinaryExpr"
    | "CallExpr"
    | "AskExpr"
    | "StashExpr"
    | "SizeExpr"
    | "TypeExpr"
    | "PopExpr"
    | "PanicExpr"
    | "MemberExpr"
    | "AwaitExpr"
    | "ConditionalExpr"
    | "FetchExpr"
    | "ReadExpr"
    | "RunExpr"
    | "SayExpr"
    | "NullCoalescingExpr"
    // Literals
    | "Identifier"
    | "NumericLiteral"
    | "StringLiteral"
    | "BooleanLiteral"
    | "NullLiteral"
    | "ArrayLiteral"
    | "ObjectLiteral"
    | "Property";

export interface Stmt {
    kind: NodeType;
    line?: number;
    column?: number;
}

export interface Program extends Stmt {
    kind: "Program";
    body: Stmt[];
}

export interface BlockStatement extends Stmt {
    kind: "BlockStatement";
    body: Stmt[];
}

export interface VarDeclaration extends Stmt {
    kind: "VarDeclaration";
    identifier: string;
    value: Expr;
}

export interface FunctionDeclaration extends Stmt {
    kind: "FunctionDeclaration";
    name: string;
    parameters: string[];
    body: BlockStatement;
    isArrow?: boolean;
    isAsync?: boolean;
}

export interface SquadDeclaration extends Stmt {
    kind: "SquadDeclaration";
    name: string;
    methods: FunctionDeclaration[];
}

export interface IfStatement extends Stmt {
    kind: "IfStatement";
    condition: Expr;
    thenBranch: BlockStatement;
    elseIfBranches: { condition: Expr, consequent: BlockStatement }[];
    elseBranch?: BlockStatement;
    line: number;
}

// spin loop
export interface WhileStatement extends Stmt {
    kind: "WhileStatement";
    condition: Expr;
    body: BlockStatement;
}

// grind loop
export interface LoopStatement extends Stmt {
    kind: "LoopStatement";
    count: Expr;
    body: BlockStatement;
}

export interface ForEachStatement extends Stmt {
    kind: "ForEachStatement";
    item: string;
    list: Expr;
    body: BlockStatement;
}

export interface ForStatement extends Stmt {
    kind: "ForStatement";
    init: string;
    start: Expr;
    end: Expr;
    body: BlockStatement;
    line: number;
}

export interface MatchCase {
    condition: Expr; // The value to match
    body: BlockStatement;
    isDefault: boolean; // For `_ =>`
}

export interface MatchStatement extends Stmt {
    kind: "MatchStatement";
    argument: Expr;
    cases: MatchCase[];
    line: number;
}

export interface TryCatchStatement extends Stmt {
    kind: "TryCatchStatement";
    tryBlock: BlockStatement;
    catchIdentifier: string;
    catchBlock: BlockStatement;
}

export interface BreakStatement extends Stmt {
    kind: "BreakStatement";
}

export interface ContinueStatement extends Stmt {
    kind: "ContinueStatement";
}

export interface ReturnStatement extends Stmt {
    kind: "ReturnStatement";
    argument?: Expr;
}

export interface OnceStatement extends Stmt {
    kind: "OnceStatement";
    body: BlockStatement;
    id: string; // Used to track execution
}

export interface NaturalCommandStmt extends Stmt {
    kind: "NaturalCommandStmt";
    verb: string;
    argument: Expr;
    destination?: Expr;
}

export interface ServeStatement extends Stmt {
    kind: "ServeStatement";
    port: Expr;
    handler?: BlockStatement | Expr;
    staticPath?: Expr;
    line: number;
}

export interface JsBlock extends Stmt {
    kind: "JsBlock";
    code: string;
}

export interface SayStatement extends Stmt {
    kind: "SayStatement";
    argument: Expr;
}

export interface FlexStatement extends Stmt {
    kind: "FlexStatement";
    argument: Expr;
}

export interface PushStatement extends Stmt {
    kind: "PushStatement";
    list: Expr;
    value: Expr;
}

export interface PopStatement extends Stmt {
    kind: "PopStatement";
    list: Expr;
}

export interface ExpressionStatement extends Stmt {
    kind: "ExpressionStatement";
    expression: Expr;
    line: number;
}

export interface NamespaceDeclaration extends Stmt {
    kind: "NamespaceDeclaration";
    name: string;
    body: Stmt[];
    line: number;
}

export interface ImportStatement extends Stmt {
    kind: "ImportStatement";
    name: string; // The identifier imported or relative path "module.vybe"
    line: number;
}

export interface Expr extends Stmt { }

export interface AskExpr extends Expr {
    kind: "AskExpr";
    message?: Expr;
}

export interface StashExpr extends Expr {
    kind: "StashExpr";
    elements: Expr[]; // Parses list literal after stash
}

export interface SizeExpr extends Expr {
    kind: "SizeExpr";
    argument?: Expr;
}

export interface TypeExpr extends Expr {
    kind: "TypeExpr";
    argument?: Expr;
}

export interface PopExpr extends Expr {
    kind: "PopExpr";
    list?: Expr;
}

export interface PanicExpr extends Expr {
    kind: "PanicExpr";
    argument?: Expr;
}

export interface RangeExpr extends Expr {
    kind: "RangeExpr";
    left: Expr;
    right: Expr;
}

export interface NullCoalescingExpr extends Expr {
    kind: "NullCoalescingExpr";
    left: Expr;
    right: Expr;
}

export interface AssignmentExpr extends Expr {
    kind: "AssignmentExpr";
    assignee: Expr; // Identifier or MemberExpr
    value: Expr;
    operator: string;
}

export interface FetchExpr extends Expr {
    kind: "FetchExpr";
    url: Expr;
}

export interface ReadExpr extends Expr {
    kind: "ReadExpr";
    source: Expr;
}

export interface RunExpr extends Expr {
    kind: "RunExpr";
    command: Expr;
}

export interface SayExpr extends Expr {
    kind: "SayExpr";
    argument: Expr;
}

export interface AwaitExpr extends Expr {
    kind: "AwaitExpr";
    argument: Expr;
}

export interface MemberExpr extends Expr {
    kind: "MemberExpr";
    object: Expr;
    property: Expr;
    computed: boolean; // false for obj.prop, true for obj["prop"]
}

export interface ConditionalExpr extends Expr {
    kind: "ConditionalExpr";
    condition: Expr;
    trueExpr: Expr;
    falseExpr: Expr;
}

export interface UnaryExpr extends Expr {
    kind: "UnaryExpr";
    operator: string;
    argument: Expr;
    prefix: boolean;
}

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr";
    left: Expr;
    right: Expr;
    operator: string;
}

export interface CallExpr extends Expr {
    kind: "CallExpr";
    caller: Expr;
    args: Expr[];
}

export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}

export interface StringLiteral extends Expr {
    kind: "StringLiteral";
    value: string;
}

export interface BooleanLiteral extends Expr {
    kind: "BooleanLiteral";
    value: boolean;
}

export interface NullLiteral extends Expr {
    kind: "NullLiteral";
}

export interface ArrayLiteral extends Expr {
    kind: "ArrayLiteral";
    elements: Expr[];
}

export interface Property extends Expr {
    kind: "Property";
    key: string;
    value?: Expr; // if undefined, use shorthand e.g { foo } instead of { foo: foo }
}

export interface ObjectLiteral extends Expr {
    kind: "ObjectLiteral";
    properties: Property[];
}
