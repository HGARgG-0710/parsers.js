import type { LayeredParser as LayeredParserType } from "./interfaces.js"

import { function as _f } from "@hgargg-0710/one"
const { trivialCompose } = _f

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

export class LayeredParser<ArgType extends any[] = any[], OutType = any>
	extends FlexibleFunction
	implements LayeredParserType
{
	#layers: Function[]

	protected parser: (...x: ArgType) => OutType

	get layers() {
		return this.#layers
	}

	set layers(v: Function[]) {
		this.#layers = v
		this.parser = trivialCompose(...this.layers)
	}

	protected __call__(...x: ArgType) {
		return this.parser(...x)
	}

	constructor(layers: Function[] = []) {
		super()
		this.layers = layers
	}
}
