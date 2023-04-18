/**
 * * Base parser class. Takes the "layer" things of the parser in question and then "combines" them using the given applied
 * (Conceptually, should be a part of the Generic, but it seems to be only for types in TS).
 * They can be anything...
 */
export class Parser {
	constructor(levels, applied) {
		this.parse = (input) => {
			let current = input
			for (let i = 0; i < levels.length; i++)
				current = applied(current, levels[i], i)
			return current
		}
	}
}

// * Version of Parser that uses the functions as abstractions...
export class FunctionParser extends Parser {
	constructor(levels) {
		super(levels, (a, b) => (b !== undefined ? b(a) : null))
	}
}
// TODO: Create other fun base classes based on the Parser, not only those he the Mr. Body is going to use himself...
