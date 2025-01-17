import type { LayeredFunction as LayeredParserType } from "./interfaces.js"

import { functional } from "@hgargg-0710/one"
const { trivialCompose } = functional

// * Pre-doc note: the infinite (or any) recursion is possible via '__call__() { return this.__call() }'
export abstract class FlexibleFunction extends Function {
	protected self: Function
	protected abstract __call__(...x: any[]): any
	constructor() {
		super("...args", "return this.self.__call__(...args)")
		const self = this.bind(this)
		this.self = self
		return self
	}
}

export class LayeredFunction<ArgType extends any[] = any[], OutType = any>
	extends FlexibleFunction
	implements LayeredParserType
{
	#layers: Function[]

	protected merged: (...x: ArgType) => OutType

	get layers() {
		return this.#layers
	}

	set layers(v: Function[]) {
		this.#layers = v
		this.merged = trivialCompose(...this.layers)
	}

	protected __call__(...x: ArgType) {
		return this.merged(...x)
	}

	constructor(layers: Function[] = []) {
		super()
		this.layers = layers
	}
}
