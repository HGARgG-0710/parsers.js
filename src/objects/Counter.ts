/**
 * This is a class for representing a counter.
 * It can have an arbitrary start-point (by default, begins counting at `0`).
 * Perfect for creation of simple unique identifiers.
 */
export class Counter {
	private count: number

	inc() {
		return ++this.count
	}

	get() {
		return this.count
	}

	constructor(start: number = 0) {
		this.count = start
	}
}
