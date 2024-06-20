export const isNumber = (x) => typeof x === "number" || x instanceof Number
export const predicateChoice = (x) => (isNumber(x) ? (input, i, j = 0) => i + j < x : x)
export const parserChoice = (x) => (typeof x === "function" ? x : TableParser(x))
export const setPredicate = (set) => (x) => set.has(x)