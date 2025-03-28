import type { IComposition } from "./interfaces.js"
import { Callable } from "src/internal/Callable.js"

import { array, functional } from "@hgargg-0710/one"
const { trivialCompose, id } = functional

export class Composition<ArgType extends any[] = any[], OutType = any>
	extends Callable
	implements IComposition
{
	#layers: Function[] = []

	protected merged: (...x: ArgType) => OutType = id as any;

	["constructor"]: new (layers?: Function[]) => Composition

	get layers() {
		return this.#layers
	}

	set layers(v: Function[]) {
		this.merged = trivialCompose(...(this.#layers = v))
	}

	protected __call__(...x: ArgType) {
		return this.merged(...x)
	}

	copy() {
		return new this.constructor(array.copy(this.layers))
	}

	constructor(layers?: Function[]) {
		super()
		if (layers) this.layers = layers
	}
}

export * from "./DynamicParser/classes.js"
