import type { LayeredParser } from "./interfaces.js"
import { layersGet, layersSet } from "./methods.js"

export function LayeredParser(layers: Function[]): LayeredParser {
	const final = function (...x: any[]) {
		return final.parser(...x)
	} as LayeredParser

	Object.defineProperty(final, "layers", {
		get: layersGet,
		set: layersSet
	})

	final.layers = layers
	return final
}
