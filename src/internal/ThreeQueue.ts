export class ThreeQueue<Type = any> {
	private items: [Type | null, Type | null, Type | null] = [null, null, null]
	private size: number = 0

	private set first(newFirst: Type | null) {
		this.items[0] = newFirst
	}

	private set second(newSecond: Type | null) {
		this.items[1] = newSecond
	}

	private set third(newThird: Type | null) {
		this.items[2] = newThird
	}

	private get first() {
		return this.items[0]!
	}

	private get second() {
		return this.items[1]!
	}

	private get third() {
		return this.items[2]!
	}

	private hasSpace() {
		return this.size < 3
	}

	private isNonEmpty() {
		return this.size > 0
	}

	private markLastSpotFree() {
		--this.size
	}

	isFull() {
		return !this.hasSpace()
	}

	shift() {
		const prevFirst = this.first
		this.first = this.second
		this.second = this.third
		this.third = null
		if (this.isNonEmpty()) this.markLastSpotFree()
		return prevFirst
	}

	push(item: Type) {
		if (this.hasSpace()) {
			this.items[this.size] = item
			++this.size
		}
	}
}
