import type { LayeredParser as LayeredParserType } from "./interfaces.js"

import { function as _f } from "@hgargg-0710/one"
const { trivialCompose } = _f

export abstract class FlexibleFunction extends Function {
	protected self: Function
	protected abstract __call__(...x: any[]): any
	constructor() {
		super("...args", "return this.self.__call__(...args)")
		const self = this.bind(this)
		return self
	}
}

export class LayeredParser extends FlexibleFunction implements LayeredParserType {
	#realLayers: Function[]

	protected parser: Function

	get layers() {
		return this.#realLayers
	}

	set layers(v: Function[]) {
		this.#realLayers = v
		this.parser = trivialCompose(...this.layers)
	}

	protected __call__(...x: any[]) {
		return this.parser(...x)
	}

	constructor(layers: Function[] = []) {
		super()
		this.layers = layers
	}
}
