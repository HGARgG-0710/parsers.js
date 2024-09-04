import type { LayeredParser } from "./interfaces.js"
import { layersGet, layersSet } from "./methods.js"

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
