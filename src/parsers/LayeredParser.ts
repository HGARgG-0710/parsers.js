import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

export function LayeredParser(layers: Function[]) {
	let localParser: Function
	const final = function (...x: any[]) {
		return localParser(...x)
	}
	final.recompile = function (layers: Function[]) {
		localParser = trivialCompose(...layers)
	}
	final.recompile(layers)
	return final
}
