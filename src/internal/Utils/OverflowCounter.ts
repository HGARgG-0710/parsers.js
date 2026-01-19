import assert from "assert"

export class OverflowCounter {
	private counter = 0

	private handleOverflow() {
		this.overflowCallback()
		return (this.counter = 0)
	}

	inc() {
		return this.counter === this.limit
			? this.handleOverflow()
			: ++this.counter
	}

	get() {
		return this.counter
	}

	constructor(
		private readonly overflowCallback: () => void = () => {},
		private readonly limit: number = Number.MAX_SAFE_INTEGER
	) {
		assert(Number.isInteger(limit))
		assert(limit > 0)
	}
}
