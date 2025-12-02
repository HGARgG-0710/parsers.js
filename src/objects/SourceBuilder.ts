import { type } from "@hgargg-0710/one"
import assert from "assert"
import type { IPrototypeCollection } from "../interfaces.js"
import type { IAccumulator } from "../interfaces/Accumulator.js"

const { isString } = type

/**
 * This is a class for a piece-wise construction
 * of a string primitive. Implements `IAccumulator<string>`.
 */
export class SourceBuilder
	implements IAccumulator<string>, IPrototypeCollection<string, string>
{
	private ["constructor"]: new (finalSource?: string) => this

	private readonly proxy: StringProxy
	private readonly frozen: SourceBuilderFrozen
	private readonly unfrozen: SourceBuilderUnfrozen
	private state: ISourceBuilderState

	get isFrozen() {
		return this.state === this.frozen
	}

	copy() {
		const copy = new this.constructor(this.source)
		if (this.isFrozen) copy.freeze()
		return copy
	}

	unfreeze() {
		this.state = this.unfrozen
		return this
	}

	freeze() {
		this.state = this.frozen
		return this
	}

	get() {
		return this.proxy.retrieve()
	}

	push(...strings: string[]) {
		this.state.push(...strings)
		return this
	}

	clear() {
		this.proxy.clear()
		this.unfreeze()
	}

	constructor(private source: string = "") {
		assert(isString(source))
		this.proxy = new StringProxy(source)
		this.frozen = new SourceBuilderFrozen()
		this.unfrozen = new SourceBuilderUnfrozen(this.proxy)
		this.state = this.unfrozen
	}
}

interface ISourceBuilderState {
	push(...strings: string[]): void
}

class StringProxy {
	append(strings: string[]) {
		this.source += strings.join("")
	}

	clear() {
		this.source = ""
	}

	retrieve() {
		return this.source
	}

	constructor(private source: string) {}
}

class SourceBuilderFrozen implements ISourceBuilderState {
	push(...strings: string[]): void {}
}

class SourceBuilderUnfrozen implements ISourceBuilderState {
	push(...strings: string[]) {
		this.source.append(strings)
	}

	constructor(private source: StringProxy) {}
}
