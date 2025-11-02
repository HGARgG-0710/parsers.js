import assert from "assert"

export class OverflowCounter {
	private counter = 0

	inc() {
		const currCounter = this.counter
		if (this.counter === this.limit) this.counter = 0
		else this.counter++
		return currCounter
	}

	constructor(private readonly limit: number = Number.MAX_SAFE_INTEGER) {
		assert(Number.isInteger(limit))
		assert(limit > 0)
	}
}
