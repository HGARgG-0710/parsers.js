import type { IPersistentAccumulator } from "../interfaces.js"

/**
 * A buffer-like class serving as the output for the `FreezableStream<T>`.
 * The user can work with it via a public `IPersistenAccumulator<T>` interface.
 */
export class OutputBuffer<T = any> implements IPersistentAccumulator<T> {
	private ["constructor"]: new () => this

	private readonly collection: T[] = []

	private _isFrozen: boolean = false

	private set isFrozen(newIsFrozen: boolean) {
		this._isFrozen = newIsFrozen
	}

	get isFrozen() {
		return this._isFrozen
	}

	push(...elements: T[]) {
		if (!this.isFrozen) this.collection.push(...elements)
		return this
	}

	get() {
		return this.collection as readonly T[]
	}

	copy() {
		const copy = new this.constructor().push(...this.collection)
		if (this.isFrozen) copy.freeze()
		return copy
	}

	read(i: number) {
		return this.collection![i] as T
	}

	unfreeze() {
		this.isFrozen = false
		return this
	}

	freeze() {
		this.isFrozen = true
		return this
	}

	get size() {
		return this.collection!.length
	}
}
