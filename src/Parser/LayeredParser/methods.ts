import { function as _f } from "@hgargg-0710/one"
const { trivialCompose } = _f

import type { LayeredParser } from "./interfaces.js"

export function layersGet(this: LayeredParser) {
	return this.realLayers
}

export function layersSet(this: LayeredParser, layers: Function[]) {
	this.realLayers = layers
	this.parser = trivialCompose(...layers)
	return layers
}
