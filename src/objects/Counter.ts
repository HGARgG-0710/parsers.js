import assert from "assert"

/**
 * This is a class for representing a counter.
 * It can have an arbitrary start-point (by default, begins counting at `0`).
 * It can also be locked (ex: when doing multiple passes across an Iterable, and
 * finalizing recording of its length after the first pass).
 * Perfect for creation of simple unique identifiers.
 */
export class Counter {
	private state: ICounterState
	private readonly locked: CounterLocked
	private readonly unlocked: CounterUnlocked

	lock() {
		this.locked.transfer(this.state.getCount())
		this.state = this.locked
	}

	unlock() {
		this.unlocked.transfer(this.state.getCount())
		this.state = this.unlocked
	}

	inc() {
		this.state.inc()
	}

	dec() {
		this.state.dec()
	}

	reset() {
		this.state.reset()
	}

	get() {
		return this.state.getCount()
	}

	get start() {
		return this.state.start
	}

	constructor(start: number = 0) {
		this.locked = new CounterLocked(start)
		this.unlocked = new CounterUnlocked(start)
		this.state = this.unlocked
	}
}

interface ICounterState {
	reset(): void
	dec(): number
	inc(): number
	transfer(count: number): void
	getCount(): number
	readonly start: number
}

abstract class BaseCounterState implements ICounterState {
	protected count: number

	abstract reset(): void
	abstract dec(): number
	abstract inc(): number

	transfer(count: number): void {
		this.count = count
	}

	getCount(): number {
		return this.count
	}

	constructor(readonly start: number) {
		this.count = start
	}
}

class CounterLocked extends BaseCounterState {
	dec() {
		return this.count
	}

	inc() {
		return this.count
	}

	reset() {}
}

class CounterUnlocked extends BaseCounterState {
	dec() {
		assert(this.count > this.start)
		return --this.count
	}

	inc(): number {
		return ++this.count
	}

	reset() {
		this.count = this.start
	}
}
