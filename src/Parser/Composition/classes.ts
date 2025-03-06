import type { IComposition } from "./interfaces.js"
import { Callable } from "./abstract.js"

import { functional } from "@hgargg-0710/one"
const { trivialCompose } = functional

export class Composition<ArgType extends any[] = any[], OutType = any>
	extends Callable
	implements IComposition
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

export * from "./DynamicParser/classes.js"
