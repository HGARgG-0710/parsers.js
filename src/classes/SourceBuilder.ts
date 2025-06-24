import { type } from "@hgargg-0710/one"
import assert from "assert"
import type { IClearable } from "../interfaces.js"
import type { IAccumulator } from "../interfaces/Accumulator.js"

const { isString } = type

/**
 * This is a class for a piece-wise construction
 * of a string primitive. Implements `IAccumulator<string>`.
 */
export class SourceBuilder implements IAccumulator<string>, IClearable {
	private ["constructor"]: new (finalSource?: string) => this

	private _isFrozen: boolean = false

	private set isFrozen(newIsFrozen: boolean) {
		this._isFrozen = newIsFrozen
	}

	get isFrozen() {
		return this._isFrozen
	}

	copy() {
		const copy = new this.constructor(this.finalSource)
		if (this.isFrozen) copy.freeze()
		return copy
	}

	unfreeze() {
		this.isFrozen = false
		return this
	}

	freeze() {
		this.isFrozen = true
		return this
	}

	get() {
		return this.finalSource
	}

	push(...strings: string[]) {
		if (!this.isFrozen) this.finalSource += strings.join("")
		return this
	}

	clear() {
		this.finalSource = ""
	}

	constructor(private finalSource: string = "") {
		assert(isString(finalSource))
	}
}
