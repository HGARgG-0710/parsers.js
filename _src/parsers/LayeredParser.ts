import type { SummatFunction } from "@hgargg-0710/summat.ts"

import { function as _f } from "@hgargg-0710/one"
const { trivialCompose } = _f

export interface LayeredParser extends SummatFunction {
	layers: Function[]
	parser: Function
}

export function layersGet(this: LayeredParser) {
	return this.realLayers
}
export function layersSet(this: LayeredParser, layers: Function[]) {
	this.realLayers = layers
	this.parser = trivialCompose(...layers)
	return layers
}

export function LayeredParser(layers: Function[]): LayeredParser {
	const final: LayeredParser = function (...x: any[]) {
		return final.parser(...x)
	} as unknown as LayeredParser

	Object.defineProperty(final, "layers", {
		get: layersGet,
		set: layersSet
	})

	final.layers = layers
	return final
}
