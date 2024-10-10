import type { Indexed } from "../../../Stream/interfaces.js"
import type { Slicer } from "./interfaces.js"
import { slicedGet } from "./methods.js"

export function Slicer<T extends Indexed & object>(
	indexed: T,
	from: number = 0,
	to: number = indexed.length
): Slicer<T> {
	const slicer: Slicer<T> = new Proxy<Indexed & object>(indexed, {
		get: slicedGet
	}) as Slicer<T>
	slicer.reSlice(from, to)
	return slicer
}
