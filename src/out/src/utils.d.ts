import { Key, Table } from "./general";
export declare function delimited<StringType = string>({ begin, end, separator, parser, skipEnd, noStartSymbol, noStopSymbol, notice, next: next, skip, isEnd, output, beginCallback: beginCallback, endCallback, skipmultiseps, }: {
    begin: StringType[];
    end: StringType[];
    separator: StringType[];
    parser: Function;
    skipEnd: boolean | Function;
    noStartSymbol: StringType;
    noStopSymbol: StringType;
    notice: Function;
    next: Function;
    skip: (toSkip: StringType, noticeFunction?: Function) => any;
    isEnd: (...a: any) => boolean;
    output: (beginVal: any, endVal: any, delimitedRes: any[]) => any;
    beginCallback?: Function;
    endCallback?: Function;
    skipmultiseps?: boolean;
}): any;
export declare function readWhilst<StringType = string>({ predicate, curr, next, append, beforeEvery, afterEvery, isEnd, emptyValue, beginCallback, endCallback, skipFirst, }: {
    predicate: Function;
    curr: Function;
    next: Function;
    append: Function;
    beforeEvery: Function;
    afterEvery: Function;
    isEnd: () => boolean;
    emptyValue: StringType;
    beginCallback: Function;
    endCallback: Function | undefined;
    skipFirst?: boolean;
}): StringType;
export declare const readWhile: typeof readWhilst;
export declare function read({ typetable, type, args, }: {
    typetable: Table<Function>;
    type: Key;
    args?: any[];
}): any;
export declare function readSequence({ typetables, types, args, }: {
    typetables: Table<Function>[];
    types: Key[];
    args?: any[][];
}): any;
export declare function recursiveIndexation<InType = object, OutType = any>({ object, fields, }: {
    object: InType;
    fields: Key[];
}): OutType;
export declare function recursiveSetting<InType = object, OutType = any>({ object, fields, value, }: {
    object: InType;
    fields: Key[];
    value: any;
}): OutType;
export declare function whileDo({ isEnd, repeat, }: {
    isEnd: () => boolean;
    repeat: Function;
}): void;
export declare class UtilFunctions<StringType = string, InType = object, OutType = object> {
    functions: Table<Function>;
    params: UtilParams<StringType, InType>;
    constructor(defaultParams: UtilParams<StringType, InType>);
    call(funcname: string, ...args: any[]): any;
}
export type UtilParams<StringType, InType> = {
    begin: StringType[];
    end: StringType[];
    separator: StringType[];
    parser: Function;
    skipEnd: boolean | Function;
    noStartSymbol: StringType;
    noStopSymbol: StringType;
    notice: Function;
    next: Function;
    skip: (toskip: StringType, notice?: Function) => any;
    isEnd: (...a: any) => boolean;
    output: (beginVal: any, endVal: any, delimitedRes: any[]) => any;
    beginCallback: Function;
    endCallback: Function;
    skipmultiseps: boolean;
    char: StringType;
    typetable: Table<Function>;
    type: Key;
    args: any[];
    typetables: Table<Function>[];
    types: Key[];
    repeat: Function;
    object: InType;
    fields: Key[];
    value: any;
};
export declare function InputStream(input: string, errorfunc: (message: string, line: number, colon: number) => never): {
    sourcestring: string[];
    pos: number;
    curr: () => any;
    next: () => any;
    prev: () => any;
    isEnd: () => boolean;
    err: (message: string) => never;
};
