import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

export function LayeredParser(layers: Function[]) {
	let localParser: Function
	let localLayers: Function[] = []

	const final = function (...x: any[]) {
		return localParser(...x)
	}
	
	Object.defineProperty(final, "layers", {
		get: function () {
			return localLayers
		},
		set: function (layers) {
			localLayers = layers
			localParser = trivialCompose(...layers)
			return layers
		}
	})
	final.layers = layers
	return final
}
