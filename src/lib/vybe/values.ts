export type ValueType = "null" | "number" | "boolean" | "string" | "list" | "object" | "function" | "native-fn";

export interface RuntimeVal {
    type: ValueType;
}

export interface NullVal extends RuntimeVal {
    type: "null";
    value: null;
}

export function MK_NULL(): NullVal {
    return { type: "null", value: null };
}

export interface BooleanVal extends RuntimeVal {
    type: "boolean";
    value: boolean;
}

export function MK_BOOL(b: boolean = true): BooleanVal {
    return { type: "boolean", value: b };
}

export interface NumberVal extends RuntimeVal {
    type: "number";
    value: number;
}

export function MK_NUMBER(n: number = 0): NumberVal {
    return { type: "number", value: n };
}

export interface StringVal extends RuntimeVal {
    type: "string";
    value: string;
}

export function MK_STRING(s: string): StringVal {
    return { type: "string", value: s };
}

export interface ListVal extends RuntimeVal {
    type: "list";
    elements: RuntimeVal[];
}

export function MK_LIST(elements: RuntimeVal[] = []): ListVal {
    return { type: "list", elements };
}

export type FunctionCall = (args: RuntimeVal[], env: any) => Promise<RuntimeVal> | RuntimeVal;

export interface NativeFnVal extends RuntimeVal {
    type: "native-fn";
    call: FunctionCall;
    properties?: Map<string, RuntimeVal>;
}

export function MK_NATIVE_FN(call: FunctionCall): NativeFnVal {
    return { type: "native-fn", call };
}

export interface FunctionVal extends RuntimeVal {
    type: "function";
    name: string;
    parameters: string[];
    declarationEnv: any;
    body: any;
    isArrow?: boolean;
}

export interface ObjectVal extends RuntimeVal {
    type: "object";
    properties: Map<string, RuntimeVal>;
}

export function MK_OBJECT(properties: Map<string, RuntimeVal> = new Map()): ObjectVal {
    return { type: "object", properties };
}

export function getPrintable(val: RuntimeVal): string {
    if (val.type === "string") return (val as StringVal).value;
    if (val.type === "number") return (val as NumberVal).value.toString();
    if (val.type === "boolean") return (val as BooleanVal).value ? "fr" : "cap";
    if (val.type === "null") return "ghost";
    if (val.type === "list") return "[" + (val as ListVal).elements.map(getPrintable).join(", ") + "]";
    return `<${val.type}>`;
}
