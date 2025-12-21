import { array } from "@hgargg-0710/one"
import type { IPrototypeCollection } from "../interfaces.js"
import { ArrayCollection } from "./ArrayCollection.js"

const { copy } = array

/**
 * This is a class for a piece-wise construction
 * of a string primitive. Implements `IPrototypeCollection<string, string>`.
 */
export class SourceBuilder implements IPrototypeCollection<string, string> {
	private ["constructor"]: new (finalSource?: string) => this

	private readonly source = new ArrayCollection<string>()

	private transfer(strings: readonly string[]) {
		this.source.init(copy(strings as string[]))
	}

	copy(): this {
		const copied = new this.constructor()
		copied.transfer(this.source.get())
		return copied
	}

	push(string: string) {
		this.source.push(string)
		return this
	}

	clear() {
		this.source.clear()
	}

	get() {
		return this.source.get().join()
	}

	constructor(startString?: string) {
		if (startString) this.source.push(startString)
	}
}
