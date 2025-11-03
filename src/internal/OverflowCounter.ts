import assert from "assert"

export class OverflowCounter {
	private counter = 0

	inc() {
		return this.counter === this.limit ? (this.counter = 0) : ++this.counter
	}

	get() {
		return this.counter
	}

	constructor(private readonly limit: number = Number.MAX_SAFE_INTEGER) {
		assert(Number.isInteger(limit))
		assert(limit > 0)
	}
}
