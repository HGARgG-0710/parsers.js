import type { LayeredFunction as ILayeredFunction } from "./interfaces.js"
import { FlexibleFunction } from "./abstract.js"

import { functional } from "@hgargg-0710/one"
const { trivialCompose } = functional

export class LayeredFunction<ArgType extends any[] = any[], OutType = any>
	extends FlexibleFunction
	implements ILayeredFunction
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
