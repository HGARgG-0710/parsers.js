import { type } from "@hgargg-0710/one"
import assert from "assert"
import type { IAccumulator } from "src/interfaces/Accumulator.js"

const { isString } = type

export class SourceBuilder implements IAccumulator<string> {
	["constructor"]: new (finalSource?: string) => this

	isFrozen: boolean = false

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
