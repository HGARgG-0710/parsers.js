export type RegExpArgs<FlagType = string> = {
    patterns: ((...args: any[]) => boolean)[][];
    flags: FlagType[][][];
};
/**
 * This is a comment; Adding ones like it would affect the typing hints within the JS files (JSDoc)...
*/
export declare function digit(a?: string, flags?: string[]): boolean;
export declare const d: typeof digit;
export declare function word(a?: string, flags?: string[]): boolean;
export declare const w: typeof word;
export declare function backspace(a?: string, flags?: string[]): boolean;
export declare const b: typeof backspace;
export declare function underscore(a?: string, flags?: string[]): boolean;
export declare const u: typeof underscore;
export declare function bracket(a?: string, flags?: string[]): boolean;
export declare function quote(a?: string, flags?: string[]): boolean;
export declare const q: typeof quote;
export declare function arithmetic(a?: string, flags?: string[]): boolean;
export declare const a: typeof arithmetic;
export declare function binary(a?: string, flags?: string[]): boolean;
export declare function cshifts(a?: string, flags?: string[]): boolean;
export declare const s: typeof cshifts;
export declare function comparison(a?: string, flags?: string[]): boolean;
export declare function regexp(s: string, expression: string, flags?: string[]): boolean;
export declare function regexcreate<FlagType = string>(rea: RegExpArgs<FlagType>): (a: string) => boolean;
export declare const rc: typeof regexcreate;
