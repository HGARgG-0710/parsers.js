import { Tuple } from "./general";
export declare class Parser<Types extends unknown[], StringType = string> {
    parse: (_in: StringType) => any;
    constructor(levels: Types, applied: (current?: any, level?: Types[number], levelIndex?: number) => any);
}
export declare class FunctionParser<n extends number, StringType = string> extends Parser<Tuple<Function, n>, StringType> {
    constructor(levels: Tuple<Function, n>);
}
