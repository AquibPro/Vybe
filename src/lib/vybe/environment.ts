import { MK_BOOL, MK_NATIVE_FN, MK_NULL, MK_NUMBER, MK_STRING, RuntimeVal, ObjectVal, NumberVal, StringVal, BooleanVal, ListVal, MK_LIST, getPrintable } from "./values";

export function createGlobalEnv(envVars: Record<string, string> = {}, logger: (msg: string) => void = console.log): Environment {
    const env = new Environment(undefined, logger);
    // Global Booleans
    env.declareVar("fr", MK_BOOL(true));
    env.declareVar("cap", MK_BOOL(false));
    env.declareVar("null", MK_NULL());

    // env object for environment variables
    const envProps = new Map<string, RuntimeVal>();
    for (const [key, value] of Object.entries(envVars)) {
        if (value !== undefined) envProps.set(key, MK_STRING(value));
    }
    env.declareVar("env", { type: "object", properties: envProps } as ObjectVal);

    // Define native functions
    env.declareVar("time", MK_NATIVE_FN((_args, _env) => {
        return MK_NUMBER(Date.now());
    }));

    env.declareVar("rand", MK_NATIVE_FN((args, _env) => {
        if (args.length === 0) return MK_NUMBER(Math.random());
        if (args.length === 1) return MK_NUMBER(Math.random() * (args[0] as NumberVal).value);
        const min = (args[0] as NumberVal).value;
        const max = (args[1] as NumberVal).value;
        return MK_NUMBER(Math.floor(Math.random() * (max - min + 1)) + min);
    }));

    env.declareVar("wait", MK_NATIVE_FN(async (args, _env) => {
        const seconds = (args[0] as NumberVal).value;
        if (seconds < 0) throw "wait() seconds cannot be negative";
        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
        return MK_NULL();
    }));

    env.declareVar("say", MK_NATIVE_FN((args, _env) => {
        const val = args[0];
        logger(getPrintable(val));
        return MK_NULL();
    }));

    env.declareVar("flow", MK_NATIVE_FN((args, _env) => {
        if (args.length < 2) throw "flow() needs at least 2 args (start, end)";
        const start = (args[0] as NumberVal).value;
        const end = (args[1] as NumberVal).value;
        const step = args.length > 2 ? (args[2] as NumberVal).value : 1;

        if (step === 0) throw "flow() step cannot be zero";

        const result: RuntimeVal[] = [];
        if (step > 0) {
            for (let i = start; i <= end; i += step) {
                result.push(MK_NUMBER(i));
            }
        } else {
            for (let i = start; i >= end; i += step) {
                result.push(MK_NUMBER(i));
            }
        }
        return MK_LIST(result);
    }));

    // Math module
    const mathObj = new Map<string, RuntimeVal>();
    mathObj.set("sqrt", MK_NATIVE_FN((args) => MK_NUMBER(Math.sqrt((args[0] as NumberVal).value))));
    mathObj.set("abs", MK_NATIVE_FN((args) => MK_NUMBER(Math.abs((args[0] as NumberVal).value))));
    mathObj.set("floor", MK_NATIVE_FN((args) => MK_NUMBER(Math.floor((args[0] as NumberVal).value))));
    mathObj.set("ceil", MK_NATIVE_FN((args) => MK_NUMBER(Math.ceil((args[0] as NumberVal).value))));
    env.declareVar("Math", { type: "object", properties: mathObj } as ObjectVal);

    // Global Math Shortcuts
    env.declareVar("sqrt", mathObj.get("sqrt")!);
    env.declareVar("abs", mathObj.get("abs")!);
    env.declareVar("floor", mathObj.get("floor")!);
    env.declareVar("ceil", mathObj.get("ceil")!);
    env.declareVar("round", MK_NATIVE_FN((args) => MK_NUMBER(Math.round((args[0] as NumberVal).value))));

    // String module
    const strObj = new Map<string, RuntimeVal>();
    strObj.set("upper", MK_NATIVE_FN((args) => MK_STRING((args[0] as StringVal).value.toUpperCase())));
    strObj.set("lower", MK_NATIVE_FN((args) => MK_STRING((args[0] as StringVal).value.toLowerCase())));
    strObj.set("split", MK_NATIVE_FN((args) => {
        const parts = (args[0] as StringVal).value.split((args[1] as StringVal).value);
        return MK_LIST(parts.map(p => MK_STRING(p)));
    }));
    env.declareVar("String", { type: "object", properties: strObj } as ObjectVal);

    env.declareVar("type", MK_NATIVE_FN((args, _env) => {
        const val = args[0];
        if (!val) return MK_STRING("ghost");
        switch (val.type) {
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
    }));

    // Type Conversions
    env.declareVar("int", MK_NATIVE_FN((args, _env) => {
        if (args.length === 0) throw "int() requires exactly one argument";
        const val = args[0];
        let num: number;
        if (val.type === "number") {
            num = Math.trunc((val as NumberVal).value);
        } else if (val.type === "string") {
            num = parseInt((val as StringVal).value, 10);
            if (isNaN(num)) throw `Invalid integer conversion: "${(val as StringVal).value}"`;
        } else {
            throw `Cannot convert ${val.type} to integer`;
        }
        return MK_NUMBER(num);
    }));

    env.declareVar("float", MK_NATIVE_FN((args, _env) => {
        if (args.length === 0) throw "float() requires exactly one argument";
        const val = args[0];
        let num: number;
        if (val.type === "number") {
            num = (val as NumberVal).value;
        } else if (val.type === "string") {
            num = parseFloat((val as StringVal).value);
            if (isNaN(num)) throw `Invalid float conversion: "${(val as StringVal).value}"`;
        } else {
            throw `Cannot convert ${val.type} to float`;
        }
        return MK_NUMBER(num);
    }));

    env.declareVar("str", MK_NATIVE_FN((args, _env) => {
        if (args.length === 0) throw "str() requires exactly one argument";
        const val = args[0];
        if (val.type === "string") return val;
        if (val.type === "number") return MK_STRING((val as NumberVal).value.toString());
        if (val.type === "boolean") return MK_STRING((val as BooleanVal).value ? "frfr" : "cap");
        if (val.type === "null") return MK_STRING("ghost");
        return MK_STRING(getPrintable(val));
    }));

    // JSON Helper
    env.declareVar("json", MK_NATIVE_FN((args, _env) => {
        const input = args[0];
        if (input.type === "string") {
            try {
                return wrapJsValue(JSON.parse((input as StringVal).value));
            } catch (e) {
                throw new Error("Invalid JSON string");
            }
        } else {
            return MK_STRING(JSON.stringify(unwrapVybeValue(input)));
        }
    }));

    return env;
}

export function unwrapVybeValue(val: RuntimeVal): any {
    if (val.type === "string") return (val as StringVal).value;
    if (val.type === "number") return (val as NumberVal).value;
    if (val.type === "boolean") return (val as BooleanVal).value;
    if (val.type === "null") return null;
    if (val.type === "list") return (val as ListVal).elements.map(unwrapVybeValue);
    if (val.type === "object") {
        const obj: any = {};
        for (const [key, v] of Array.from((val as ObjectVal).properties.entries())) {
            obj[key] = unwrapVybeValue(v);
        }
        return obj;
    }
    return val;
}

export function wrapJsValue(jsVal: any): RuntimeVal {
    if (typeof jsVal === "function" || (typeof jsVal === "object" && jsVal !== null && !Array.isArray(jsVal))) {
        const fakeMap = {
            get: (key: string) => {
                const val = jsVal[key];
                if (typeof val === "function") {
                    return wrapJsValue(val.bind(jsVal));
                }
                return val !== undefined ? wrapJsValue(val) : undefined;
            },
            has: (key: string) => key in jsVal,
            entries: () => {
                const entries = Object.entries(jsVal).map(([k, v]) => [k, wrapJsValue(v)]);
                return entries;
            },
            [Symbol.iterator]: function* () {
                for (const key in jsVal) {
                    yield [key, wrapJsValue(jsVal[key])];
                }
            }
        };

        if (typeof jsVal === "function") {
            return {
                type: "native-fn",
                call: async (args: any[]) => {
                    const unwrapped = args.map(unwrapVybeValue);
                    const res = jsVal(...unwrapped);
                    return wrapJsValue(res instanceof Promise ? await res : res);
                },
                properties: fakeMap
            } as any;
        } else {
            return {
                type: "object",
                properties: fakeMap
            } as any;
        }
    }

    if (Array.isArray(jsVal)) {
        return MK_LIST(jsVal.map(wrapJsValue));
    }
    if (jsVal === null) return MK_NULL();
    if (typeof jsVal === "string") return MK_STRING(jsVal);
    if (typeof jsVal === "number") return MK_NUMBER(jsVal);
    if (typeof jsVal === "boolean") return MK_BOOL(jsVal);
    return MK_NULL();
}

export class Environment {
    private parent?: Environment;
    protected variables: Map<string, RuntimeVal>;
    public logger: (msg: string) => void;

    public getVariables(): Map<string, RuntimeVal> {
        return this.variables;
    }

    constructor(parentENV?: Environment, logger: (msg: string) => void = console.log) {
        this.parent = parentENV;
        this.variables = new Map();
        this.logger = parentENV ? parentENV.logger : logger;
    }

    public declareVar(varname: string, value: RuntimeVal): RuntimeVal {
        if (this.variables.has(varname)) {
            throw new Error(`💀 environment just caught you lackin. Variable '${varname}' already cooked fr.`);
        }
        this.variables.set(varname, value);
        return value;
    }

    public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varname);
        env.variables.set(varname, value);
        return value;
    }

    public lookupVar(varname: string): RuntimeVal {
        const env = this.resolve(varname);
        return env.variables.get(varname) as RuntimeVal;
    }

    public deleteVar(varname: string): void {
        const env = this.resolve(varname);
        env.variables.delete(varname);
    }

    public resolve(varname: string): Environment {
        if (this.variables.has(varname)) {
            return this;
        }

        if (this.parent == undefined) {
            throw new Error(`💀 environment just caught you lackin. Variable '${varname}' not cooked yet (skill issue).`);
        }

        return this.parent.resolve(varname);
    }

    public say(msg: string): void {
        this.logger(msg);
    }
}
