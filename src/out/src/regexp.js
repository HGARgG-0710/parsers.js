export function digit(a = "", flags = []) {
    return regexp(a, "/\\d/", flags);
}
export const d = digit;
export function word(a = "", flags = []) {
    return regexp(a, "/\\w/", flags);
}
export const w = word;
export function backspace(a = "", flags = []) {
    return regexp(a, "/\\b/", flags);
}
export const b = backspace;
export function underscore(a = "", flags = []) {
    return regexp(a, "/_/", flags);
}
export const u = underscore;
export function bracket(a = "", flags = []) {
    return regexp(a, "/(\\(|\\)|\\[|\\]|\\{|\\})/", flags);
}
export function quote(a = "", flags = []) {
    return regexp(a, "/(\"|')/", flags);
}
export const q = quote;
export function arithmetic(a = "", flags = []) {
    return regexp(a, "/(\\+|\\-|\\*|\\/)", flags);
}
export const a = arithmetic;
export function binary(a = "", flags = []) {
    return regexp(a, "/(\\^|\\&|\\|)/", flags);
}
export function cshifts(a = "", flags = []) {
    return regexp(a, "/(>>|<<)/", flags);
}
export const s = cshifts;
export function comparison(a = "", flags = []) {
    return regexp(a, "/((>|<){1,1}={0,1})/", flags);
}
export function regexp(s, expression, flags = []) {
    return new RegExp(expression, flags.join("")).test(s);
}
export function regexcreate(rea) {
    return (a) => {
        if (a.length !== rea.patterns.length)
            return false;
        origloop: for (let i = 0; i < a.length; i++) {
            let j = 0;
            for (const x of rea.patterns[i]) {
                if (x(a[i], rea.flags[i][j]))
                    continue origloop;
                j++;
            }
            return false;
        }
        return true;
    };
}
export const rc = regexcreate;
