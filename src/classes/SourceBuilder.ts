import { type } from "@hgargg-0710/one"
import assert from "assert"
import type { IAccumulator } from "../interfaces/Accumulator.js"

const { isString } = type

export class SourceBuilder implements IAccumulator<string> {
	private ["constructor"]: new (finalSource?: string) => this

	private _isFrozen: boolean = false

	private set isFrozen(newIsFrozen: boolean) {
		this._isFrozen = newIsFrozen
	}

	get isFrozen() {
		return this._isFrozen
	}

	copy() {
		return new this.constructor(this.finalSource)
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

	constructor(private finalSource: string = "") {
		assert(isString(finalSource))
	}
}
