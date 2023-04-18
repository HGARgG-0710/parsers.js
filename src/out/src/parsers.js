export class Parser {
    constructor(levels, applied) {
        this.parse = (input) => {
            let current = input;
            for (let i = 0; i < levels.length; i++)
                current = applied(current, levels[i], i);
            return current;
        };
    }
}
export class FunctionParser extends Parser {
    constructor(levels) {
        super(levels, (a, b) => b !== undefined ? b(a) : null);
    }
}
