import type { IParseable } from "../interfaces.js"

/**
 * This is an implementation of `IParseable<string>` that relies 
 * upon an in-memory string (an ordinary JavaScript `string`). 
 * It is basically just a very thin wrapper around the `string`
 * primitives. 
*/
export class ParseableInput implements IParseable<string> {
	private ["constructor"]: new (source: string) => this

	get size() {
		return this.source.length
	}

	read(i: number): string {
		return this.source[i]
	}

	copy() {
		return new this.constructor(this.source)
	}

	constructor(private readonly source: string) {}
}
