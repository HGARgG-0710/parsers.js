import type { IParseable } from "../interfaces.js"

export class ParseableInput implements IParseable<string> {
	protected ["constructor"]: new (source: string) => this

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
