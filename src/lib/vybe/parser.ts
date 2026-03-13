import { Token, TokenType } from "./lexer";
import { VybeError } from "./error";
import {
    Stmt, Program, Expr, BinaryExpr, Identifier, NumericLiteral, StringLiteral,
    BooleanLiteral, VarDeclaration, AssignmentExpr, BlockStatement, IfStatement,
    WhileStatement, LoopStatement, TryCatchStatement, BreakStatement,
    ContinueStatement, ReturnStatement, FunctionDeclaration, CallExpr, ExpressionStatement,
    ArrayLiteral, NullLiteral, SayStatement, FlexStatement, PushStatement, PopStatement,
    AskExpr, StashExpr, SizeExpr, TypeExpr, PopExpr, PanicExpr, AwaitExpr,
    ObjectLiteral, Property, MemberExpr, NamespaceDeclaration, ImportStatement, ForEachStatement,
    MatchStatement, MatchCase, SquadDeclaration, ForStatement, OnceStatement, ConditionalExpr, UnaryExpr,
    NaturalCommandStmt, JsBlock, FetchExpr
} from "./ast";

export class Parser {
    private tokens: Token[] = [];
    private pos: number = 0;

    public produceAST(sourceCodeTokens: Token[]): Program {
        this.tokens = sourceCodeTokens;
        this.pos = 0;

        const program: Program = {
            kind: "Program",
            body: [],
        };

        // Check for top-level vibe main { ... }
        if (this.at().type === TokenType.Vibe && (this.peek(1).type === TokenType.OpenBrace || (this.peek(1).type === TokenType.Identifier && this.peek(1).value === "main"))) {
            this.consume(TokenType.Vibe, "Expected 'vibe' keyword");
            if (this.at().type === TokenType.Identifier && this.at().value === "main") {
                this.consume(TokenType.Identifier, "Expected 'main'");
            }
            this.consume(TokenType.OpenBrace, "Expected '{'");
            while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
                program.body.push(this.parseStmt());
            }
            this.consume(TokenType.CloseBrace, "Expected '}'");
        } else {
            while (this.notEOF()) {
                program.body.push(this.parseStmt());
            }
        }

        return program;
    }

    private notEOF(): boolean {
        return this.tokens[this.pos].type !== TokenType.EOF;
    }

    private at(): Token {
        return this.tokens[this.pos];
    }

    private peek(offset: number = 0): Token {
        return this.tokens[this.pos + offset];
    }

    private consume(type: TokenType, _err: string): Token {
        const prev = this.tokens[this.pos++];
        if (!prev || prev.type !== type) {
            throw new VybeError(
                "Syntax Error",
                `Expected ${TokenType[type]}, but got '${prev ? prev.value : "EOF"}'`,
                prev?.line || this.tokens[this.pos]?.line || 1,
                prev?.column || this.tokens[this.pos]?.column || 1,
                _err
            );
        }
        return prev;
    }

    // --- STATEMENTS ---

    private parseStmt(): Stmt {
        switch (this.at().type) {
            case TokenType.Cook:
                return this.parseVarDeclaration();
            case TokenType.Zone:
                return this.parseNamespaceDeclaration();
            case TokenType.Yo:
                return this.parseImportStatement();
            case TokenType.Swap:
                return this.parseAssignmentStmt();
            case TokenType.Async:
                this.consume(TokenType.Async, "");
                this.consume(TokenType.Vibe, "Expected 'vibe' after async");
                return this.parseFunctionDeclaration(true);
            case TokenType.Vibe:
                // vibe func(args) { ... } OR vibe i = 0 to 10 { ... } OR vibe condition { ... }
                if (this.peek(1).type === TokenType.Identifier && this.peek(2).type === TokenType.OpenParen) {
                    return this.parseFunctionDeclaration(false);
                }
                if (this.peek(1).type === TokenType.Identifier && this.peek(2).type === TokenType.Equals) {
                    return this.parseForStatement();
                }
                return this.parseWhileStatement();
            case TokenType.Sus:
                return this.parseIfStatement();
            case TokenType.Grind:
                return this.parseLoopStatement();
            case TokenType.For:
                return this.parseForStatement();
            case TokenType.Each:
                return this.parseForEachStatement();
            case TokenType.Match:
                return this.parseMatchStatement();
            case TokenType.Try:
                return this.parseTryCatchStatement();
            case TokenType.Squad:
                return this.parseSquadDeclaration();
            case TokenType.Say:
                return this.parseSayStatement();
            case TokenType.Flex:
                return this.parseFlexStatement();
            case TokenType.Push:
                return this.parsePushStatement();
            case TokenType.Pop:
                return this.parsePopStatement();
            case TokenType.Crash:
                return this.parsePanicStatement();
            case TokenType.Bounce: {
                const token = this.consume(TokenType.Bounce, "Expected 'bounce'");
                return { kind: "BreakStatement", line: token.line } as BreakStatement;
            }
            case TokenType.Skip: {
                const token = this.consume(TokenType.Skip, "Expected 'skip'");
                return { kind: "ContinueStatement", line: token.line } as ContinueStatement;
            }
            case TokenType.Once:
                return this.parseOnceStatement();
            case TokenType.Return:
                return this.parseReturnStatement();
            case TokenType.Js: {
                const token = this.consume(TokenType.Js, "Expected 'js'");
                return { kind: "JsBlock", code: token.value, line: token.line } as JsBlock;
            }
            case TokenType.Read:
            case TokenType.Fetch:
            case TokenType.Run:
            case TokenType.Delete:
            case TokenType.Wait:
            case TokenType.Move:
            case TokenType.Write:
                return this.parseNaturalCommandStmt();
            default:
                return this.parseExprStmt();
        }
    }

    private parseBlock(): BlockStatement {
        this.consume(TokenType.OpenBrace, "Expected '{' to start block");
        const body: Stmt[] = [];
        while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
            body.push(this.parseStmt());
        }
        this.consume(TokenType.CloseBrace, "Expected '}' to end block");
        return { kind: "BlockStatement", body };
    }

    private parseVarDeclaration(): VarDeclaration {
        const line = this.at().line || 1;
        this.consume(TokenType.Cook, "Expected 'cook' keyword");
        const identifier = this.consume(TokenType.Identifier, "Expected variable name").value;

        this.consume(TokenType.Equals, "Expected '=' after variable name");

        const value = this.parseExpr();

        return { kind: "VarDeclaration", identifier, value, line };
    }

    private parseAssignmentStmt(): ExpressionStatement {
        // swap x = 20 or swap obj.x = 20
        const line = this.at().line || 1;
        this.consume(TokenType.Swap, "Expected 'swap' keyword");
        const assignee = this.parseLogical(); // Use logical precedence so it stops at '='
        this.consume(TokenType.Equals, "Expected '=' for assignment");
        const value = this.parseExpr();

        const expr = { kind: "AssignmentExpr", assignee, value, operator: "=", line } as AssignmentExpr;
        return { kind: "ExpressionStatement", expression: expr, line };
    }

    private parseFunctionDeclaration(isAsync: boolean = false): FunctionDeclaration {
        const line = this.at().line || 1;
        if (!isAsync) {
            this.consume(TokenType.Vibe, "Expected 'vibe' keyword");
        }
        const name = this.consume(TokenType.Identifier, "Expected function name").value;

        const args = this.parseArgsList();
        const parameters = args.map(a => {
            if (a.kind !== "Identifier") throw new VybeError("Syntax Error", "Expected identifier in parameters", this.at().line, this.at().column);
            return (a as Identifier).symbol;
        });

        if (this.at().type === TokenType.Arrow) {
            this.consume(TokenType.Arrow, "Expected '->' or '=>'");
            const expr = this.parseExpr();
            return {
                kind: "FunctionDeclaration",
                name,
                parameters,
                body: {
                    kind: "BlockStatement",
                    body: [{ kind: "ReturnStatement", argument: expr } as ReturnStatement]
                },
                isArrow: true,
                isAsync,
                line
            };
        }

        const body = this.parseBlock();
        return { kind: "FunctionDeclaration", name, parameters, body, isAsync, line };
    }

    private parseSquadDeclaration(): SquadDeclaration {
        const line = this.at().line || 1;
        this.consume(TokenType.Squad, "Expected 'gng'");
        const name = this.consume(TokenType.Identifier, "Expected gng name").value;
        this.consume(TokenType.OpenBrace, "Expected '{'");

        const methods: FunctionDeclaration[] = [];
        while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
            let isAsync = false;
            if (this.at().type === TokenType.Async) {
                this.consume(TokenType.Async, "");
                this.consume(TokenType.Vibe, "Expected 'vibe'");
                isAsync = true;
            } else {
                this.consume(TokenType.Vibe, "Expected 'vibe' for method");
            }
            const methodName = this.consume(TokenType.Identifier, "Expected method name").value;
            const args = this.parseArgsList();
            const parameters = args.map(a => {
                if (a.kind !== "Identifier") throw "Expected identifier in parameters";
                return (a as Identifier).symbol;
            });
            const body = this.parseBlock();
            methods.push({ kind: "FunctionDeclaration", name: methodName, parameters, body, isAsync, line: this.at().line } as FunctionDeclaration);
        }
        this.consume(TokenType.CloseBrace, "Expected '}'");
        return { kind: "SquadDeclaration", name, methods, line };
    }

    private parseMatchStatement(): MatchStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Match, "Expected 'match'");
        const argument = this.parseExpr();
        this.consume(TokenType.OpenBrace, "Expected '{'");

        const cases: MatchCase[] = [];
        while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
            let isDefault = false;
            let condition: Expr | undefined = undefined;

            if (this.at().type === TokenType.Identifier && this.at().value === "_") {
                this.consume(TokenType.Identifier, "");
                isDefault = true;
            } else {
                condition = this.parseExpr();
            }

            this.consume(TokenType.Arrow, "Expected '=>'");
            let body: BlockStatement;

            // Allow single line or block
            if (this.at().type === TokenType.OpenBrace) {
                body = this.parseBlock();
            } else {
                body = { kind: "BlockStatement", body: [this.parseStmt()] };
            }

            cases.push({ condition: condition as Expr, body, isDefault });
        }
        this.consume(TokenType.CloseBrace, "Expected '}'");

        return { kind: "MatchStatement", argument, cases, line };
    }

    private parseIfStatement(): IfStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Sus, "Expected 'sus' keyword");
        const condition = this.parseExpr();
        const thenBranch = this.parseBlock();

        const elseIfBranches: { condition: Expr, consequent: BlockStatement }[] = [];
        while ((this.at().type === TokenType.Maybe || this.at().type === TokenType.Fr) && this.notEOF()) {
            this.consume(this.at().type, "Expected 'fr' or 'maybe'");
            const maybeCond = this.parseExpr();
            const maybeBlock = this.parseBlock();
            elseIfBranches.push({ condition: maybeCond, consequent: maybeBlock });
        }

        let elseBranch: BlockStatement | undefined;
        if (this.at().type === TokenType.Nah) {
            this.consume(TokenType.Nah, "Expected 'nah'");
            elseBranch = this.parseBlock();
        }

        return { kind: "IfStatement", condition, thenBranch, elseIfBranches, elseBranch, line };
    }

    private parseWhileStatement(): WhileStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Vibe, "Expected loop keyword");
        const condition = this.parseExpr();
        const body = this.parseBlock();
        return { kind: "WhileStatement", condition, body, line };
    }

    private parseForStatement(): ForStatement {
        // for i = 0 to 10 { }
        const line = this.at().line || 1;
        this.consume(this.at().type, "Expected loop keyword");
        const init = this.consume(TokenType.Identifier, "Expected identifier").value;
        this.consume(TokenType.Equals, "Expected '='");
        const start = this.parseExpr();
        this.consume(TokenType.To, "Expected 'to'");
        const end = this.parseExpr();
        const body = this.parseBlock();
        return { kind: "ForStatement", init, start, end, body, line };
    }

    private parseLoopStatement(): LoopStatement {
        // grind 5 { ... }
        const line = this.at().line || 1;
        this.consume(TokenType.Grind, "Expected 'grind'");
        const count = this.parseExpr();
        const body = this.parseBlock();
        return { kind: "LoopStatement", count, body, line };
    }

    private parseForEachStatement(): ForEachStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Each, "Expected 'each'");
        const item = this.consume(TokenType.Identifier, "Expected loop variable after 'each'").value;
        this.consume(TokenType.In, "Expected 'in'");
        const list = this.parseExpr();
        const body = this.parseBlock();
        return { kind: "ForEachStatement", item, list, body, line };
    }

    private parseTryCatchStatement(): TryCatchStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Try, "Expected 'try'");
        const tryBlock = this.parseBlock();
        this.consume(TokenType.Catch, "Expected 'catch'");
        const catchIdentifier = this.consume(TokenType.Identifier, "Expected error identifier").value;
        const catchBlock = this.parseBlock();
        return { kind: "TryCatchStatement", tryBlock, catchIdentifier, catchBlock, line };
    }

    private parseReturnStatement(): ReturnStatement {
        const line = this.at().line || 1;
        this.consume(this.at().type, "Expected return keyword");
        // if next token is not end of line or }, parse expr
        let argument;
        if (this.at().type !== TokenType.CloseBrace && this.notEOF()) {
            argument = this.parseExpr();
        }
        return { kind: "ReturnStatement", argument, line };
    }

    private parseSayStatement(): SayStatement {
        const line = this.at().line || 1;
        this.consume(this.at().type, "Expected say keyword");
        const argument = this.parseExpr();
        return { kind: "SayStatement", argument, line };
    }

    private parseFlexStatement(): FlexStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Flex, "Expected 'flex'");
        const argument = this.parseExpr();
        return { kind: "FlexStatement", argument, line };
    }

    private parsePushStatement(): PushStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Push, "Expected 'push'");
        const list = this.parseExpr();
        const value = this.parseExpr();
        return { kind: "PushStatement", list, value, line };
    }

    private parsePopStatement(): PopStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Pop, "Expected 'pop'");
        const list = this.parseExpr();
        return { kind: "PopStatement", list, line };
    }

    private parsePanicStatement(): ExpressionStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Crash, "Expected 'crash' or 'panic'");
        const argument = this.parseExpr();
        // Treating Panic as a built-in expression wrapped in a statement for simplistic AST
        return { kind: "ExpressionStatement", expression: { kind: "PanicExpr", argument, line } as PanicExpr, line };
    }

    private parseExprStmt(): ExpressionStatement {
        const expr = this.parseExpr();
        return { kind: "ExpressionStatement", expression: expr, line: expr.line || 1 };
    }


    private parseNamespaceDeclaration(): NamespaceDeclaration {
        const line = this.at().line || 1;
        this.consume(TokenType.Zone, "Expected 'zone'");
        const name = this.consume(TokenType.Identifier, "Expected namespace name").value;
        const body: Stmt[] = [];
        this.consume(TokenType.OpenBrace, "Expected '{'");
        while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
            body.push(this.parseStmt());
        }
        this.consume(TokenType.CloseBrace, "Expected '}'");
        return { kind: "NamespaceDeclaration", name, body, line };
    }

    private parseImportStatement(): ImportStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Yo, "Expected 'yo' or 'plug'");

        let name: string;
        if (this.at().type === TokenType.String) {
            name = this.consume(TokenType.String, "Expected module path").value;
        } else {
            name = this.consume(TokenType.Identifier, "Expected module name").value;
        }

        return { kind: "ImportStatement", name, line };
    }

    private parseOnceStatement(): OnceStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Once, "Expected 'once'");
        const body = this.parseBlock();
        // ID is basically the line number for now, simple enough for a prototype
        return { kind: "OnceStatement", body, id: `once_${line}`, line } as OnceStatement;
    }

    private parseNaturalCommandStmt(): NaturalCommandStmt {
        const line = this.at().line || 1;
        const verbToken = this.consume(this.at().type, "Expected natural command verb");
        const verb = verbToken.value;
        const argument = this.parseExpr();

        let destination: Expr | undefined;
        if (this.at().type === TokenType.Into || this.at().type === TokenType.With) {
            this.consume(this.at().type, "Expected 'into' or 'with'");
            destination = this.parseExpr();
        }

        // Handle Optional "seconds" after wait
        if (verb === "wait" && this.at().type === TokenType.Seconds) {
            this.consume(TokenType.Seconds, "");
        }

        return { kind: "NaturalCommandStmt", verb, argument, destination, line };
    }

    // --- EXPRESSIONS ---

    private parseExpr(): Expr {
        return this.parseAssignment();
    }

    private parseAssignment(): Expr {
        const left = this.parseConditional();
        const tkType = this.at().type;
        if ([TokenType.Equals, TokenType.PlusEquals, TokenType.MinusEquals, TokenType.StarEquals, TokenType.SlashEquals, TokenType.PercentEquals].includes(tkType)) {
            const operatorToken = this.consume(tkType, "Expected assignment operator");
            const value = this.parseAssignment();
            return {
                kind: "AssignmentExpr",
                assignee: left,
                value,
                operator: operatorToken.value,
                line: left.line
            } as AssignmentExpr;
        }
        return left;
    }

    private parseConditional(): Expr {
        let left = this.parsePipeline();

        if (this.at().type === TokenType.QuestionMark) {
            this.consume(TokenType.QuestionMark, "Expected '?'");
            const trueExpr = this.parseExpr();
            this.consume(TokenType.Colon, "Expected ':'");
            const falseExpr = this.parseConditional();
            return {
                kind: "ConditionalExpr",
                condition: left,
                trueExpr,
                falseExpr,
                line: left.line
            } as ConditionalExpr;
        }

        return left;
    }

    private parsePipeline(): Expr {
        let left = this.parseLogical();
        while (this.at().type === TokenType.Pipeline && this.notEOF()) {
            this.consume(TokenType.Pipeline, "Expected '|>'");

            if (this.at().type === TokenType.Say) {
                this.consume(TokenType.Say, "");
                left = { kind: "CallExpr", caller: { kind: "Identifier", symbol: "say", line: left.line } as Identifier, args: [left], line: left.line } as CallExpr;
            } else {
                const right = this.parseLogical();
                if (right.kind === "CallExpr") {
                    (right as CallExpr).args.unshift(left);
                    left = right;
                } else {
                    left = { kind: "CallExpr", caller: right, args: [left], line: left.line } as CallExpr;
                }
            }
        }
        return left;
    }

    private parseLogical(): Expr {
        let left = this.parseEquality();
        while (this.at().type === TokenType.And || this.at().type === TokenType.Or) {
            const operator = this.consume(this.at().type, "Expected 'and' or 'or'").value;
            const right = this.parseEquality();
            left = { kind: "BinaryExpr", left, right, operator, line: left.line } as BinaryExpr;
        }
        return left;
    }

    private parseEquality(): Expr {
        let left = this.parseRelational();
        while (this.at().type === TokenType.DoubleEquals || this.at().type === TokenType.NotEquals) {
            const operator = this.consume(this.at().type, "Expected == or !=").value;
            const right = this.parseRelational();
            left = { kind: "BinaryExpr", left, right, operator, line: left.line } as BinaryExpr;
        }
        return left;
    }

    private parseRelational(): Expr {
        let left = this.parseAdditive();
        while ([TokenType.LessThan, TokenType.GreaterThan, TokenType.LessThanEquals, TokenType.GreaterThanEquals].includes(this.at().type)) {
            const operator = this.consume(this.at().type, "Expected relational operator").value;
            const right = this.parseAdditive();
            left = { kind: "BinaryExpr", left, right, operator, line: left.line } as BinaryExpr;
        }
        return left;
    }

    private parseAdditive(): Expr {
        let left = this.parseMultiplicative();
        while (this.at().type === TokenType.Plus || this.at().type === TokenType.Minus) {
            const operator = this.consume(this.at().type, "Expected + or -").value;
            const right = this.parseMultiplicative();
            left = { kind: "BinaryExpr", left, right, operator, line: left.line } as BinaryExpr;
        }
        return left;
    }

    private parseMultiplicative(): Expr {
        let left = this.parseUnary();
        while (this.at().type === TokenType.Star || this.at().type === TokenType.Slash || this.at().type === TokenType.Percent) {
            const operator = this.consume(this.at().type, "Expected *, /, or %").value;
            const right = this.parseUnary();
            left = { kind: "BinaryExpr", left, right, operator, line: left.line } as BinaryExpr;
        }
        return left;
    }

    private parseUnary(): Expr {
        const tkType = this.at().type;
        if (tkType === TokenType.Minus) {
            const token = this.consume(TokenType.Minus, "");
            const argument = this.parseUnary();
            return {
                kind: "BinaryExpr",
                left: { kind: "NumericLiteral", value: 0, line: token.line } as NumericLiteral,
                right: argument,
                operator: "-",
                line: token.line
            } as BinaryExpr;
        } else if (tkType === TokenType.Not || tkType === TokenType.PlusPlus || tkType === TokenType.MinusMinus) {
            const token = this.consume(tkType, "");
            const argument = this.parseUnary();
            return {
                kind: "UnaryExpr",
                operator: token.value,
                argument,
                prefix: true,
                line: token.line
            } as UnaryExpr;
        }
        return this.parsePostfixExpr();
    }

    private parsePostfixExpr(): Expr {
        let member = this.parseCallMemberExpr();
        if (this.at().type === TokenType.PlusPlus || this.at().type === TokenType.MinusMinus) {
            const token = this.consume(this.at().type, "");
            member = {
                kind: "UnaryExpr",
                operator: token.value,
                argument: member,
                prefix: false,
                line: member.line
            } as UnaryExpr;
        }
        return member;
    }

    private parseCallMemberExpr(): Expr {
        const member = this.parseMemberExpr();

        if (this.at().type === TokenType.OpenParen) {
            return this.parseCallExpr(member);
        }
        return member;
    }

    private parseMemberExpr(): Expr {
        let object = this.parsePrimary();

        while (this.at().type === TokenType.Dot || this.at().type === TokenType.OpenBracket) {
            const operator = this.consume(this.at().type, "");
            let property: Expr;
            let computed: boolean;

            if (operator.type === TokenType.Dot) {
                computed = false;
                const propTk = this.tokens[this.pos++];
                property = { kind: "Identifier", symbol: propTk.value, line: propTk.line } as Identifier;
            } else {
                computed = true;
                property = this.parseExpr();
                this.consume(TokenType.CloseBracket, "Expected closing ']'");
            }

            object = {
                kind: "MemberExpr",
                object,
                property,
                computed,
                line: object.line
            } as MemberExpr;
        }

        return object;
    }

    private parseCallExpr(caller: Expr): Expr {
        let callExpr: Expr = {
            kind: "CallExpr",
            caller,
            args: this.parseArgsList(),
            line: caller.line
        } as CallExpr;

        // Handle chained calls like foo()()
        if (this.at().type === TokenType.OpenParen) {
            callExpr = this.parseCallExpr(callExpr);
        }
        return callExpr;
    }

    private parseArgsList(): Expr[] {
        this.consume(TokenType.OpenParen, "Expected '('");
        const args = this.at().type === TokenType.CloseParen ? [] : this.parseArgs();
        this.consume(TokenType.CloseParen, "Expected ')'");
        return args;
    }

    private parseArgs(): Expr[] {
        const args = [this.parseExpr()];
        while (this.at().type === TokenType.Comma && this.notEOF()) {
            this.consume(TokenType.Comma, "Expected ','");
            args.push(this.parseExpr());
        }
        return args;
    }

    private parsePrimary(): Expr {
        const tk = this.at();

        switch (tk.type) {
            case TokenType.Ask:
                this.consume(TokenType.Ask, "");
                return { kind: "AskExpr", message: this.parseExpr(), line: tk.line } as AskExpr;

            case TokenType.Size:
                this.consume(TokenType.Size, "");
                return { kind: "SizeExpr", argument: this.parseExpr(), line: tk.line } as SizeExpr;

            case TokenType.Type:
                this.consume(TokenType.Type, "");
                return { kind: "TypeExpr", argument: this.parseExpr(), line: tk.line } as TypeExpr;

            case TokenType.Pop:
                this.consume(TokenType.Pop, "");
                return { kind: "PopExpr", list: this.parseExpr(), line: tk.line } as PopExpr;

            case TokenType.Crash:
                this.consume(TokenType.Crash, "");
                return { kind: "PanicExpr", argument: this.parseExpr(), line: tk.line } as PanicExpr;

            case TokenType.Stash:
                this.consume(TokenType.Stash, "");
                if (this.at().type === TokenType.OpenBracket) {
                    this.consume(TokenType.OpenBracket, "");
                    const elements: Expr[] = [];
                    if (this.at().type !== TokenType.CloseBracket) {
                        elements.push(this.parseExpr());
                        while (this.at().type === TokenType.Comma) {
                            this.consume(TokenType.Comma, "");
                            elements.push(this.parseExpr());
                        }
                    }
                    this.consume(TokenType.CloseBracket, "Expected ']'");
                    return { kind: "StashExpr", elements, line: tk.line } as StashExpr;
                }
                return { kind: "StashExpr", elements: [], line: tk.line } as StashExpr;

            case TokenType.Await:
                this.consume(TokenType.Await, "");
                return { kind: "AwaitExpr", argument: this.parseExpr(), line: tk.line } as AwaitExpr;

            case TokenType.Fetch:
                // Check if it's an expression: fetch "url"
                // If it's a statement, it would've been caught by parseStmt
                this.consume(TokenType.Fetch, "");
                return { kind: "FetchExpr", url: this.parseExpr(), line: tk.line } as FetchExpr;

            case TokenType.Identifier:
            case TokenType.Wait:
            case TokenType.Check:
                return { kind: "Identifier", symbol: this.consume(tk.type, "").value, line: tk.line } as Identifier;

            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.consume(TokenType.Number, "").value), line: tk.line } as NumericLiteral;

            case TokenType.String:
                return { kind: "StringLiteral", value: this.consume(TokenType.String, "").value, line: tk.line } as StringLiteral;

            case TokenType.Frfr:
            case TokenType.Fr:
                this.consume(tk.type, "");
                return { kind: "BooleanLiteral", value: true, line: tk.line } as BooleanLiteral;

            case TokenType.Cap:
                this.consume(TokenType.Cap, "");
                return { kind: "BooleanLiteral", value: false, line: tk.line } as BooleanLiteral;

            case TokenType.Ghost:
                this.consume(TokenType.Ghost, "");
                return { kind: "NullLiteral", line: tk.line } as NullLiteral;

            case TokenType.OpenParen: {
                // Check if it's an arrow function:
                let isArrow = false;
                let tempPos = this.pos + 1;
                let parenCount = 1;
                while (tempPos < this.tokens.length && parenCount > 0) {
                    if (this.tokens[tempPos].type === TokenType.OpenParen) parenCount++;
                    if (this.tokens[tempPos].type === TokenType.CloseParen) parenCount--;
                    tempPos++;
                }
                if (tempPos < this.tokens.length && this.tokens[tempPos].type === TokenType.Arrow) {
                    isArrow = true;
                }

                if (isArrow) {
                    this.consume(TokenType.OpenParen, "");
                    const params: string[] = [];
                    if (this.at().type !== TokenType.CloseParen) {
                        params.push(this.consume(TokenType.Identifier, "Expected parameter identifier").value);
                        while (this.at().type === TokenType.Comma && this.notEOF()) {
                            this.consume(TokenType.Comma, "");
                            params.push(this.consume(TokenType.Identifier, "Expected parameter identifier").value);
                        }
                    }
                    this.consume(TokenType.CloseParen, "");
                    this.consume(TokenType.Arrow, "Expected '=>'");

                    const bodyExpr = this.parseExpr();
                    const body: BlockStatement = { kind: "BlockStatement", body: [{ kind: "ReturnStatement", argument: bodyExpr, line: tk.line } as ReturnStatement] };
                    // Cast to Expr so it can be returned safely from parsePrimary
                    return { kind: "FunctionDeclaration", name: "anonymous", parameters: params, body, isArrow: true, line: tk.line } as unknown as Expr;
                }

                this.consume(TokenType.OpenParen, "");
                const value = this.parseExpr();
                this.consume(TokenType.CloseParen, "Expected closing ')'");
                return value;
            }

            case TokenType.OpenBracket: {
                this.consume(TokenType.OpenBracket, "");
                const elements: Expr[] = [];
                if (this.at().type !== TokenType.CloseBracket) {
                    elements.push(this.parseExpr());
                    while (this.at().type === TokenType.Comma && this.notEOF()) {
                        this.consume(TokenType.Comma, "");
                        elements.push(this.parseExpr());
                    }
                }
                this.consume(TokenType.CloseBracket, "Expected ']'");
                return { kind: "ArrayLiteral", elements, line: tk.line } as ArrayLiteral;
            }

            case TokenType.OpenBrace: {
                this.consume(TokenType.OpenBrace, "");
                const properties: Property[] = [];

                while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
                    const key = this.consume(TokenType.Identifier, "Expected object key").value;

                    if (this.at().type === TokenType.Comma) {
                        this.consume(TokenType.Comma, "");
                        properties.push({ kind: "Property", key, line: tk.line } as Property);
                        continue;
                    } else if (this.at().type === TokenType.CloseBrace) {
                        properties.push({ kind: "Property", key, line: tk.line } as Property);
                        continue;
                    }

                    this.consume(TokenType.Colon, "Expected ':' after key");
                    const value = this.parseExpr();
                    properties.push({ kind: "Property", key, value, line: tk.line } as Property);

                    if (this.at().type !== TokenType.CloseBrace) {
                        this.consume(TokenType.Comma, "Expected ',' or '}'");
                    }
                }

                this.consume(TokenType.CloseBrace, "Expected '}'");
                return { kind: "ObjectLiteral", properties, line: tk.line } as ObjectLiteral;
            }

            default: {
                throw new VybeError(
                    "Syntax Error",
                    `Unexpected token: ${tk.value} (type: ${TokenType[tk.type]})`,
                    tk.line,
                    tk.column,
                    "Check your syntax."
                );
            }
        }
    }
}
