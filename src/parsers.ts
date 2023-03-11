/**
 * * Base parser class. Takes the "layer" things of the parser in question and then "combines" them using the given applied
 * (Conceptually, should be a part of the Generic, but it seems to be only for types in TS).
 * They can be anything...
 */
export class Parser<Types extends unknown[], StringType = string> {
	parse: (_in: StringType) => any
	constructor(
		levels: Types,
		applied: (
			current?: any,
			level?: Types[number],
			levelIndex?: number
		) => any
	) {
		this.parse = (input: StringType) => {
			let current: any = input
			for (let i = 0; i < levels.length; i++)
				current = applied(current, levels[i], i)
			return current
		}
	}
}

// TODO: Create other base classes based on the Parser, namely those he the Mr. Body is going to use himself...
